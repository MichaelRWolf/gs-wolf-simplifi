const fs = require('fs');
const path = require('path');

// Define the paths to the tsconfig files
const tsconfigInPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfigOutPath = path.resolve(__dirname, 'tsconfig.GAS.json');

// Read...
fs.readFile(tsconfigInPath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading tsconfig.json: ${
      err.message
    }`);
    return;
  }

// Parse...
  let tsconfig;
  try {
    tsconfig = JSON.parse(data);
  } catch (err) {
    console.error(`Error parsing tsconfig.json: ${err.message}`);
    return;
  }

// Override options...
  tsconfig.compilerOptions = tsconfig.compilerOptions || {};

  tsconfig.target = 'ES5';
  tsconfig.compilerOptions.module = 'none';
  tsconfig.compilerOptions.allowJs = true;
  tsconfig.compilerOptions.checkJs = false;
  tsconfig.include = ["src/**/*.ts", "src/**/*.js"];
  tsconfig.exclude = ["test/**/*.ts"];
  tsconfig.lib = ["es5", "dom"];

// Write...
  const tsconfigData = JSON.stringify(tsconfig, null, 2);
  fs.writeFile(tsconfigOutPath, tsconfigData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing ${tsconfigOutPath}: ${err.message
      }`);
      return;
    }
    console.log(`${tsconfigOutPath} has been created successfully!`);
  });
});
