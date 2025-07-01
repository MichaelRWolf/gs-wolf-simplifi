# gs-wolf-simplifi

## Build, Test, and Deploy Instructions

This project uses npm scripts (see `package.json`) to manage building, testing, and deploying Google Apps Script code.

### Prerequisites
- Node.js and npm installed
- [clasp](https://github.com/google/clasp) installed and authenticated
- (Optional) Google Apps Script and Google Sheets URLs configured in `package.json` for the `open:urls` script

### Common Commands

#### Build the Project
Compiles all source files from `src/` to `dist/`, updates the GAS-specific TypeScript config, and sets output files to read-only:

```
npm run build
```

#### Watch and Build on Changes
Automatically rebuilds when files change:

```
npm run build:watch
```

#### Run Tests
Runs all Jest tests (see `test/` directory):

```
npm test
```

#### Run Tests with Coverage
```
npm run test:coverage
```

#### Deploy to Google Apps Script
Builds and pushes all files in `dist/` to your linked GAS project:

```
npm run deploy
```

#### Full Test, Build, and Deploy Workflow
Runs tests, builds, and deploys in sequence:

```
npm run deploy:full
```

#### Open Apps Script and Spreadsheet URLs
Opens the configured URLs in your browser:

```
npm run open:urls
```

---

All scripts and their definitions can be found in the [`package.json`](./package.json) file.
