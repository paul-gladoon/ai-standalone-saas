# ShortPoint Code Standards & Linting Rules for AI Agents

This repository contains comprehensive code standards and linting rules extracted from the ShortPoint apps-monorepo that can be applied by AI agents to other projects.

## 📁 Files Overview

- **`ai-agent-code-standards.yaml`** - Human-readable YAML format with detailed explanations
- **`ai-agent-code-standards.json`** - Machine-readable JSON format for programmatic use
- **`README-ai-agent-standards.md`** - This documentation file

## 🎯 Purpose

These rule files enable AI agents to:

1. **Automatically apply consistent code standards** across different projects
2. **Maintain code quality** through standardized linting configurations
3. **Enforce best practices** for TypeScript, React, and Node.js projects
4. **Ensure proper project structure** for monorepos and single projects
5. **Implement comprehensive testing standards** with 100% coverage requirements

## 🚀 Quick Start for AI Agents

### Priority Application Order

When applying these standards to a new project, follow this order:

1. **Package.json Standards** - MUST create package.json for every app including test apps
2. **Yarn Workspace Configuration** - Set up yarn as the package manager
3. **Use ONLY Yarn Commands** - For all package management operations
4. **TypeScript Configuration** - Configure tsconfig.json and tsconfig.base.json
5. **ESLint Configuration** - Set up linting with proper extends chain
6. **Jest Configuration** - Add testing with coverage thresholds
7. **Prettier Formatting** - Configure code formatting
8. **Git Hooks & Commit Standards** - Set up Husky, commitlint, and lint-staged
9. **NX Workspace** - Configure if monorepo
10. **Quality Gates** - Add SonarQube, Hadolint, etc.
11. **Validation Scripts** - Add custom validation scripts

### Package Manager Requirements

- **Required**: yarn (>=1.22.0)
- **Commands**: Always use `yarn install`, `yarn add`, `yarn build`, `yarn test`
- **Forbidden**: NEVER use npm, npx, or pnpm commands
- **Workspaces**: Use `yarn workspaces` for monorepo management

### Core Standards Summary

#### Package.json Requirements

- **Required for ALL apps**: Including e2e testing apps like levercast-e2e
- **Naming**: `@{scope}/{project-name}` format
- **Required fields**: name, description (30+ chars), version (semver), author: "ShortPoint", license: "UNLICENSED"
- **Required scripts**: lint, typecheck, start, serve, build, unit-tests, storybook-tests, e2e-tests
- **NX tags**: Must include `scope:{projectName}`

#### ESLint Configuration

- **Root extends**: eslint:recommended, @nx/typescript, sonarjs/recommended-legacy, prettier/recommended
- **TypeScript extends**: Add react, react-hooks, airbnb-base, airbnb-typescript/base
- **Key rules**: No caret/tilde in dependencies, proper import extensions
- **Project config**: Must extend `../../../.eslintrc.js` (max 22 lines)

#### TypeScript Standards

- **tsconfig.json**: Max 15 lines, must extend tsconfig.base.json
- **Strict mode**: All strict options enabled
- **Target**: ESNext with modern lib support
- **Module resolution**: Node with ESNext modules

#### Jest Configuration

- **Coverage**: 100% threshold for branches, functions, lines, statements
- **Test environment**: Node.js with ts-jest preset
- **Performance**: Error after 1000ms, warn after 500ms
- **Project config**: Max 20 lines, import from root jest.config

#### Dependency Management

- **Exact versions**: Avoid `^` and `~` prefixes (except @playwright/test)
- **Custom ESLint rule**: Automatically fix caret/tilde usage
- **Version consistency**: Script to detect and fix version mismatches

## 📊 Quality Standards

### Test Coverage Requirements

- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%
- **Statements**: 100%

### Test Types & Usage

- **Unit Tests**: Fast, low cost, test functions in isolation (Jest)
- **Integration Tests**: Medium speed/cost, test component interaction (Jest + NestJS)
- **Component Tests**: Medium speed/cost, test UI components (Storybook)
- **E2E Tests**: Slow, high cost, smoke tests only (Playwright)

### Static Analysis Tools

- ESLint with TypeScript, React, and SonarJS plugins
- Prettier for code formatting
- SonarQube for code quality analysis
- Hadolint for Docker linting
- Stylelint for CSS/styled-components

## � Package Manager Standards

### Yarn Requirements

- **Version**: yarn >=1.22.0
- **Commands**: Use `yarn install`, `yarn add`, `yarn add -D`, `yarn remove`
- **Build**: Use `yarn build`, `yarn test`, `yarn start`, `yarn serve`
- **Workspaces**: Use `yarn workspaces` for monorepo management
- **Forbidden**: NEVER use npm, npx, or pnpm commands

### Package.json Requirements for ALL Apps

Every app in the workspace MUST have its own `package.json` file, including:

- Main application apps
- E2E testing apps (e.g., `levercast-e2e`)
- Library apps
- Utility apps

**Required structure**:

```json
{
  "name": "@scope/project-name",
  "description": "Minimum 30 character description of the app",
  "version": "1.0.0",
  "author": "ShortPoint",
  "license": "UNLICENSED",
  "scripts": {
    "lint": "eslint . --max-warnings 0 --cache",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "build": "[project-specific]",
    "test": "[project-specific]"
  }
}
```

## �🔧 Configuration Templates

### Root .eslintrc.js Template

```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@nx/typescript',
    'plugin:sonarjs/recommended-legacy',
    'plugin:prettier/recommended',
  ],
  plugins: ['@nx', 'sonarjs'],
  parserOptions: {
    project: './tsconfig.base.json',
    extraFileExtensions: ['.json'],
  },
  // ... see full config in YAML/JSON files
};
```

### Project .eslintrc.js Template

```javascript
module.exports = {
  extends: ['../../../.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
  ],
};
```

### Package.json Scripts Template

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0 --cache",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "start": "[project-specific]",
    "serve": "[project-specific]",
    "build": "[project-specific]",
    "unit-tests": "[project-specific]",
    "storybook-tests": "[project-specific]",
    "e2e-tests": "[project-specific]"
  }
}
```

## 🛠 Required Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "eslint": "8.55.0",
    "typescript": "5.3.3",
    "nx": "17.2.8",
    "knip": "5.14.0"
  }
}
```

### ESLint Plugins

```json
{
  "devDependencies": {
    "@nx/eslint-plugin": "19.0.0",
    "@typescript-eslint/eslint-plugin": "6.13.2",
    "@typescript-eslint/parser": "6.13.2",
    "eslint-config-airbnb-base": "15.0.0",
    "eslint-config-airbnb-typescript": "17.1.0",
    "eslint-config-prettier": "9.0.0",
    "eslint-plugin-import": "2.29.0",
    "eslint-plugin-jsx-a11y": "6.7.1",
    "eslint-plugin-prettier": "5.1.0",
    "eslint-plugin-react": "7.33.2",
    "eslint-plugin-react-hooks": "4.6.0",
    "eslint-plugin-sonarjs": "1.0.3"
  }
}
```

## 🔍 Validation & Automation

### Git Hooks (Husky)

- **Pre-commit**: Standards check, version mismatch check, knip analysis, lint-staged
- **Commit-msg**: Commitlint validation with JIRA integration

### Lint-staged Configuration

- **TypeScript files**: Type check, lint fix, CSS lint fix
- **JavaScript files**: Lint fix, CSS lint fix
- **Concurrent**: false (run sequentially)

### Custom Validation Scripts

- **mono-standard-check.mjs**: Validates package structure, naming, scripts, configs
- **find-versions-missmatches.mjs**: Detects and fixes dependency version conflicts

## 📋 AI Agent Implementation Checklist

When implementing these standards, ensure:

- [ ] All required files are present
- [ ] Package.json follows naming conventions
- [ ] ESLint extends chain is correct
- [ ] TypeScript configuration is minimal (under line limits)
- [ ] Test coverage thresholds are enforced at 100%
- [ ] Git hooks are functioning
- [ ] Dependencies use exact versions (no ^ or ~)
- [ ] Module boundaries are enforced (for monorepos)
- [ ] Quality gates are in place
- [ ] Custom validation scripts are added

## 🎯 Adaptation Guidelines

### For Different Project Types

- **Single Repository**: Skip NX-specific configurations
- **Non-React Projects**: Remove React-specific ESLint plugins
- **Backend Only**: Focus on Node.js and API testing standards
- **Frontend Only**: Emphasize component testing and Storybook integration

### Version Adaptation

- Maintain core rule philosophy while updating dependency versions
- Keep exact version policy for critical dependencies
- Preserve 100% test coverage requirements
- Maintain consistent naming and structure conventions

## 🔗 Related Documentation

- **Unit & Integration Testing**: `docs/README.unit-integration.tests.md`
- **Component Testing**: `docs/README.ui.components.md`
- **E2E Testing**: `docs/README.e2e.md`
- **Quality Control**: `README.quality.md`

## 📄 License

UNLICENSED - ShortPoint Internal Use

## 📞 Support

For questions about these standards or implementation issues, please refer to the original monorepo documentation or contact the ShortPoint development team.

---

_Generated from apps-monorepo analysis on July 31, 2025_
