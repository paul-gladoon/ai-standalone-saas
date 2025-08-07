/*
Quick and dirty script to help catch package.json missmatches in large projects / mono repros.
Created with PHIND.COM as a pair programmer ;)

Usage:
  node scripts/find-versions-missmatches.js [--fix] [--latest]
  --fix    - Update all packages to the latest version (local)
  --latest - Update all packages to the latest version (npm)

Script will parse all package.json files in the current directory and sub-directories and
will report on the following:
  - Total dependant packages
  - Total unique packages
  - Total shared packages
  - Total shared packages with version miss-match
  - List of shared packages with version miss-match
*/

/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */

import { readdirSync, lstatSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const excludedModules = {
  /** Mapping app breaks if its set to 5.14.* or if all other version are set
   * to 5.13.*. Confusing and frustrating. So we are ignoreing it for now.
   */
  '@mui/material': ['5.13.7'],
};

// Create a map to store the dependencies and their versions
const dependencies = new Map();

// Traverse the directories in the mono repo
const traverseDir = (dir) => {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = lstatSync(filePath);
    if (stat.isDirectory() && file !== 'node_modules') {
      traverseDir(filePath);
    } else if (file === 'package.json') {
      const packageJson = JSON.parse(readFileSync(filePath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      // eslint-disable-next-line guard-for-in
      for (const dep in deps) {
        if (excludedModules[dep] && excludedModules[dep].includes(deps[dep])) {
          continue;
        }
        if (!dependencies.has(dep)) {
          dependencies.set(dep, []);
        }
        dependencies.get(dep).push({
          version: deps[dep],
          path: filePath,
        });
      }
    }
  }
};

traverseDir('.');

// Generate the summary report
let totalDependents = 0;
const totalUniquePackages = dependencies.size;
let sharedPackages = 0;
let packagesWithVersionMismatch = 0;

// Create a map to store the duplicates
const duplicates = new Map();
for (const [dep, versions] of dependencies.entries()) {
  if (versions.length > 1) {
    sharedPackages += 1;
  }

  const uniqueVersions = [...new Set(versions.map((v) => v.version))];
  if (uniqueVersions.length > 1 && !uniqueVersions.every((str) => str.startsWith('file:'))) {
    duplicates.set(dep, uniqueVersions);
    packagesWithVersionMismatch += 1;
  }
  totalDependents += versions.length;
}

console.log('----');
console.log(`${totalDependents} dependant packages in total.`);
console.log(`${totalUniquePackages} unique packages in total.`);
console.log(`${sharedPackages} shared by 1 or more package.json files.`);
console.log('');
console.log('Of the shared packages:');
console.log(`  ${packagesWithVersionMismatch} packages are on different versions`);
console.log(
  `  ${sharedPackages - packagesWithVersionMismatch} packages depend on the same version`,
);
console.log('');
console.log('List of shared packages with version miss-match:');
console.log('');

for (const [dep, versions] of duplicates.entries()) {
  if (versions.length > 1) {
    console.log(`Package "${dep}"`);
    for (const version of versions) {
      const paths = dependencies
        .get(dep)
        .filter((v) => v.version === version)
        .map((v) => v.path);
      console.log(` "${version}" in "${paths.join(', ')}"`);
    }
  }
}

console.log('----');
console.log('');

const fix = process.argv.includes('--fix');

// Check if --fix option is provided
if (fix) {
  console.log('Fixing...');
  // For each mismatched package, update it to the latest or highest version
  for (const [dep, versions] of duplicates.entries()) {
    let newVersion;
    if (process.argv.includes('--latest')) {
      newVersion = execSync(`npm show ${dep} version`, { encoding: 'utf-8' }).trim();
    } else {
      // eslint-disable-next-line sonarjs/cognitive-complexity
      newVersion = versions.reduce((a, b) => {
        const x = a.split('.').map((e) => parseInt(e, 10));
        const y = b.split('.').map((e) => parseInt(e, 10));
        let z = '';

        for (let i = 0; i < x.length; i += 1) {
          if (x[i] === y[i]) {
            z += 'e';
          } else if (x[i] > y[i]) {
            z += 'm';
          } else {
            z += 'l';
          }
        }
        if (!z.match(/[l|m]/g)) {
          return a;
        }
        if (z.split('e').join('')[0] === 'm') {
          return a;
        }
        return b;
      }, '0.0.0');
    }
    console.log('Updating', dep, 'to', newVersion);
    for (const { path: filePath } of dependencies.get(dep)) {
      const packageJsonPath = join(filePath, '..', 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      if (packageJson.dependencies[dep] && packageJson.dependencies[dep] !== newVersion) {
        packageJson.dependencies[dep] = newVersion;
      }
      if (
        packageJson.devDependencies &&
        packageJson.devDependencies[dep] &&
        packageJson.devDependencies[dep] !== newVersion
      ) {
        packageJson.devDependencies[dep] = newVersion;
      }
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('  Updated', packageJsonPath, dep, '->', newVersion);
    }
  }
}

if (!fix && packagesWithVersionMismatch > 0) {
  console.log('Error: Duplicate packages found on different versions.');
  process.exitCode = 1;
}
