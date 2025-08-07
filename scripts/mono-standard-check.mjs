/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */

/*
Script to check that the packages are correctly setup, inline with our expectations in this nx mono repro.
Created with PHIND.COM as a pair programmer ;)

Basic idea is to check that the package.json, tsconfig.json, .eslintrc.js and other files are correctly setup.

Complexity is high here, just due to lots of ifs, but they logic is simple.

The only command line argument is --verbose, to allow more detailed output when its passing.
*/

import fs from 'fs';
import path from 'path';

function matchesPattern(str, pattern) {
  const regex = new RegExp(pattern);
  return regex.test(str);
}

/**
 * Generic function to check if files matching a pattern exist in any sub directories of the current file.
 * Excludes matching agains the current file and excludes node_modules directories
 * @param {string} file
 * @param {string} pattern - A simple pattern with * as a wildcard
 * @returns {boolean} - true if a file is found, false if not
 */
function findFiles(file, pattern) {
  let found = false;
  const directory = path.dirname(file);
  const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');

  function walk(dir) {
    fs.readdirSync(dir).forEach((item) => {
      const itemPath = path.join(dir, item);
      const itemStat = fs.statSync(itemPath);

      if (itemStat.isDirectory()) {
        if (item !== 'node_modules') {
          walk(itemPath);
        }
      } else if (itemPath !== file && item.match(regex)) {
        found = true;
      }
    });
  }

  walk(directory);
  return found;
}

/**
 * Check the package.json file for compliance
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
function checkPackageJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  const errors = [];

  // Project name should be in the format "@{{rootFolder}}/{{name}}", where {name is - separated, lowercase and matches the filepath without the root folder}
  const projectName = json.name;
  // first folder name of filePath
  const rootFolder = filePath.split('/')[0];

  // create expected project name, remove root folder and replace / with -
  const expectedProjectName = `@${rootFolder}/${path
    .dirname(filePath)
    .replace(`${rootFolder}/`, '')
    .replace(/\//g, '-')}`;

  if (projectName !== expectedProjectName) {
    errors.push(`"name" field is incorrect, expected ${expectedProjectName}`);
  }

  // Check "description" fields
  if (!json.description || json.description.length < 30) {
    errors.push(`"description" field is missing or too short (more than 30 chars)`);
  }
  if (!json.version || !matchesPattern(json.version, '^\\d+\\.\\d+\\.\\d+')) {
    errors.push(`"version" field is missing or does not match the required format (semver)`);
  }

  // Check for "author", "license"
  if (!json.author || json.author !== 'BENlabs') {
    errors.push(`"author" field must be set to 'BENlabs'`);
  }
  if (!json.license || json.license !== 'UNLICENSED') {
    errors.push(`"license" field must be set to 'UNLICENSED'`);
  }

  // Check for scripts field
  if (!json.scripts) {
    errors.push(`"scripts" is missing`);
  } else {
    const expectedScripts = {
      lint: 'eslint . --max-warnings 0 --cache',
      'lint:css': "stylelint '**/*.(module|styles).*'", // special case, see code later
      typecheck: 'tsc --noEmit -p tsconfig.json',
      start: true,
      serve: true,
      build: true,
      'unit-tests': true,
      'storybook-tests': true,
      'e2e-tests': true,
    };

    // check if this is a root/parent package, does it have package.json's in sub folders (not including node_modules)
    const isParent = findFiles(filePath, 'package.json');

    if (isParent) {
      // Check for scripts field should trigger all sub packages via nx run many
      // these run many for the children need a -all suffix to avoid double running
      Object.entries(expectedScripts).forEach(([script]) => {
        const runMany = `nx run-many -t ${script} -p ${projectName}-*`;
        // checking the -all variant is set to the run many command
        if (json.scripts[script + '-all'] !== runMany) {
          errors.push(`"scripts.${script}-all" must be set to "${runMany}"`);
        }
        // We don’t want the normal script to be set on the parent
        if (json.scripts[script]) {
          errors.push(`"scripts.${script}" must not be set on project roots`);
        }
      });
    } else {
      // lint:css only apply if there is a *.styles.* file in the project
      const stylesFile = findFiles(filePath, '*.styles.*');
      if (stylesFile && !json.scripts['lint:css']?.endsWith(expectedScripts['lint:css'])) {
        errors.push(`"scripts.lint:css" must be set to "${expectedScripts['lint:css']}"`);
      }
      delete expectedScripts['lint:css'];

      const dockerFile = findFiles(filePath, 'Dockerfile');
      if (dockerFile) {
        expectedScripts['lint'] =
          "set -e && sh ../../../scripts/container-lint-check.sh && hadolint --config ../../../.hadolint.yaml Dockerfile && echo 'Container linting passed, skipping '";
        // Dangerous, we really need a separate way to handle Dockerfiles and
        // eventually Python code.
        // delete expectedScripts['storybook-tests'];
        // delete expectedScripts['e2e-tests'];
        // delete expectedScripts['unit-tests'];
        delete expectedScripts['typecheck'];
      }

      // its a child package, so we need to check the right scripts are in place
      Object.entries(expectedScripts).forEach(([script, value]) => {
        if (!json.scripts[script] || (value !== true && !json.scripts[script].endsWith(value))) {
          // checked the script ends with our expected value if non true
          const expectedValue = value === true ? 'is missing' : `must be set to "${value}"`;
          errors.push(`"scripts.${script}" ${expectedValue}`);
        }
      });
    }
  }

  // Check the "nx" field exists, has a "tags" field, with at least one tag
  if (!json.nx || !json.nx.tags || !json.nx.tags.length) {
    errors.push(`"nx.tags" is missing or empty`);
  } else {
    // check the tags, testing that at least one is format "scope:@{{projectName}}", where projectName is the name of the project from the package.json
    const projectName = json.name;
    const tags = json.nx.tags;
    const validTags = tags.filter((tag) => tag.trim() === `scope:${projectName}`);
    if (validTags.length === 0) {
      errors.push(`"nx.tags" must contain "scope:${projectName}"`);
    }
  }

  return errors;
}

/**
 * Check the tsconfig.json file for compliance
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
function checkTsConfigJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  const errors = [];

  // Check for "extends" field
  if (!json.extends || !matchesPattern(json.extends, '.*tsconfig\\.base\\.json$')) {
    errors.push(`"extends" field is missing or incorrect`);
  }

  // Check for maximum lines
  const lines = content.split('\n');
  if (lines.length > 15) {
    errors.push(`File has more than 15 lines`);
  }

  return errors;
}

/**
 * Check the tsconfig.build.json file for compliance
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
function checkTsConfigBuildJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  const errors = [];

  const expectedStructure = {
    extends: './tsconfig.json',
    exclude: ['test', '**/*spec.ts', 'jest.*'],
  };

  // Check for "extends" field
  if (!json.extends || json.extends !== expectedStructure.extends) {
    errors.push(`"extends" field should equal ${expectedStructure.extends}`);
  }

  // Check for "exclude" field
  if (!json.exclude || json.exclude.length !== expectedStructure.exclude.length) {
    errors.push(`"exclude" field should equal ${expectedStructure.exclude}`);
  }

  // Check for maximum lines
  const lines = content.split('\n');
  if (lines.length > 15) {
    errors.push(`File has more than 15 lines`);
  }

  return errors;
}

/**
 * Check the jest.unit.ts file for compliance
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
function checkEslintConfig(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];

  // Check for "extends" field exists and has at least 1 value in its array
  if (!matchesPattern(content, 'extends:\\s*\\[[^\\]]*\\]')) {
    errors.push(`"extends" field is missing or empty`);
  } else {
    // check the last value contains the string "../.eslintrc.js"
    const extendsArray = content.match(/extends:\s*\[([^\]]*)\]/)[1];
    // get the last value, but remove any empty values first
    const lastValue = extendsArray
      .split(',')
      .filter((value) => value.trim())
      .pop();
    if (!matchesPattern(lastValue.trim(), '\\.\\.\\/\\.eslintrc\\.js')) {
      errors.push(
        `"extends" field does not contain "../.eslintrc.js", or its not the last value in the array`,
      );
    }
  }

  // Check for "overrides" field exsists and matches the following:
  const expectedOverride = [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '__dirname',
        sourceType: 'module',
      },
    },
  ];
  if (!matchesPattern(content, 'overrides:\\s*\\[[^\\]]*\\]')) {
    errors.push(`"overrides" field is missing or empty`);
  } else {
    // check the last value contains the expected override
    const overridesArray = content.match(/overrides:\s*\[([^\]]*)\]/)[1];
    // get the last value, but remove any empty values first
    const lastValue = overridesArray
      .split(',')
      .filter((value) => value.trim())
      .pop();
    if (!matchesPattern(lastValue.trim(), expectedOverride)) {
      errors.push(
        `"overrides" field does not contain the expected override (check any project for an example)`,
      );
    }
  }

  // Check for maximum lines
  const lines = content.split('\n');
  if (lines.length > 22) {
    errors.push(`File has more than 22 lines`);
    // More than 20 lines means they are doing custom stuff, that we probably don't want
  }

  return errors;
}

/**
 * Check the jest.unit.ts file for compliance
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
function checkJestUnitTs(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];

  // check commonConfig is import ends with ../jest.config.js
  if (!matchesPattern(content, "import\\s+commonConfig\\s+from\\s+'.+\\.\\.\\/jest\\.config'")) {
    errors.push(`"commonConfig" import must be imported from the root jest.config.ts`);
  }

  // file should be under 20 lines (indicating not too much is overriden)
  const lines = content.split('\n');
  if (lines.length > 20) {
    errors.push(`File has more than 20 lines`);
  }

  return errors;
}

/**
 * Check the jest.unit.ts file for compliance
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
const noCustomFiles = () => [`File should not exist, root version will apply`];

/**
 * Check the file exists in the package root, and is of min size
 * @param {string} filePath
 * @returns {string[]} - an array of errors, empty if no errors
 */
const neededRootFile = (minSize) => (filePath) => {
  let content;
  const errors = [];

  // check we this is a package root folder, ignore readme.md in sub folders
  if (!fs.existsSync(path.join(path.dirname(filePath), 'package.json'))) {
    return -1;
  }

  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    errors.push(`File is missing`);
  }
  if (content.length < minSize) {
    errors.push(`File is too short (must be at least ${minSize} chars long)`);
  }
  return errors;
};

const verbose = process.argv.includes('--verbose');
const rootDir = process.argv[2] || '.'; // Default to current directory if no argument is provided

const allErrors = {};
let errorFree = true;
const filesAndChecks = {
  'package\\.json$': checkPackageJson,
  'tsconfig\\.json$': checkTsConfigJson,
  'tsconfig\\.build\\.json$': checkTsConfigBuildJson,
  '.eslintrc.\\w+': checkEslintConfig,
  'jest\\.unit\\.ts$': checkJestUnitTs,
  '\\.gitignore$': noCustomFiles,
  '\\.prettierrc$': noCustomFiles,
  '\\.stylelintrc$': noCustomFiles,
  'readme\\.md$': neededRootFile(200),
};

function traverse(dir) {
  const files = fs.readdirSync(dir).filter((file) => file !== 'node_modules');

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const projectName = dir;

    if (stat.isDirectory()) {
      traverse(fullPath);
    } else {
      // skip root level files and . files
      if (dir === rootDir || projectName.startsWith('.')) {
        continue;
      }

      // check file agains regex patterns in filesAndChecks
      for (const [pattern, check] of Object.entries(filesAndChecks)) {
        const regex = new RegExp(pattern);
        if (regex.test(file)) {
          const fileErrors = check(fullPath);
          if (fileErrors === -1) {
            continue;
          }
          if (!allErrors[projectName]) {
            allErrors[projectName] = {};
          }
          if (fileErrors.length > 0) {
            allErrors[projectName][file] = fileErrors;
            errorFree = false;
          }
        }
      }
    }
  }
}

/**
 * Check that each subfolder has an entry in the CODEOWNERS file,
 * and the the entries for the root folder are valid
 * @param {string[]} rootFolders - list of root folders to check
 */
const checkCodeOwners = (rootFolders) => {
  const codeOwnersPath = path.join('.', '.github', 'CODEOWNERS');
  const codeOwnersContent = fs.readFileSync(codeOwnersPath, 'utf-8');
  const codeOwnersLines = codeOwnersContent.split('\n');

  // Checking the root folders individually
  rootFolders.forEach((rootFolder) => {
    // Check all sub folders are owned
    const subfolders = fs
      .readdirSync(rootFolder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    subfolders.forEach((subfolder) => {
      const folderPath = path.join(rootFolder, subfolder);
      const isOwned = codeOwnersLines.some((line) => line.includes('/' + folderPath));

      if (!isOwned) {
        if (!allErrors[folderPath]) {
          allErrors[folderPath] = {};
        }
        allErrors[folderPath]['.'] = [`Missing CODEOWNERS entry for /${folderPath}`];
        errorFree = false;
      }
    });

    const ownersSubFolderPath = subfolders.map((subfolder) =>
      path.join('/', rootFolder, subfolder, '/'),
    );

    // Check all the codeowners entries have a corresponding folder
    codeOwnersLines.forEach((line, lineNumber) => {
      const folder = line.split('@')[0].trim();

      // folders not matching the root folder are ignored
      if (!folder.startsWith(`/${rootFolder}`)) {
        return;
      }

      // if we have a folder, and the folder matches the root dir
      // check it matches a subfolder (remove starting /)
      if (folder && !ownersSubFolderPath.includes(folder)) {
        if (!allErrors[folder]) {
          allErrors[folder] = {};
        }
        if (!allErrors['.github']) {
          allErrors['.github'] = {};
        }
        if (!allErrors['.github']['CODEOWNERS']) {
          allErrors['.github']['CODEOWNERS'] = [];
        }
        allErrors['.github']['CODEOWNERS'].push(
          `Line ${lineNumber} : "${folder}" does not have a corresponding folder`,
        );
        errorFree = false;
      }
    });
  });
};

console.log('\n----------------------------------------');
console.log(' MONO REPO STANDARDS CHECK - BENlabs');
console.log('----------------------------------------\n');
checkCodeOwners(['tb2']);
traverse(rootDir);

// if we have any errors, print them out
if ((!errorFree && Object.keys(allErrors).length > 0) || verbose) {
  Object.entries(allErrors).forEach(([project, files]) => {
    let output = '';
    let projectErrors = false;
    output += `<<projectSTATUS>> Project: ${project}\n`;
    Object.entries(files).forEach(([file, fileErrors]) => {
      console.log({ project, file, fileErrors });
      if (fileErrors.length > 0) {
        output += ` File:   ${file} (${project}/${file})\n`;
        fileErrors.forEach((error) => (output += `    - ${error}\n`));
        errorFree = false;
        projectErrors = true;
      }
    });
    // replace <<projectSTATUS>> with ❌ or ✅
    output = output.replace('<<projectSTATUS>>', projectErrors ? '❌' : '✅');

    // only output if command line arg --verbose is set if we don't have errors
    if (projectErrors || verbose) {
      console.log(output);
    }
  });
  console.log('\n❌❌ Some files are not compliant, please fix them. ❌❌\n\n');
  process.exit(1);
} else {
  console.log('\n✅✅ All files are compliant with monorepo standard ✅✅\n\n');
}
