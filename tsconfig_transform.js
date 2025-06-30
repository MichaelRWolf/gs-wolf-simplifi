const fs = require('fs');
const path = require('path');

// Define the paths to the tsconfig files
const tsconfigInPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfigTransformPath = path.resolve(__dirname, 'tsconfig_transform.js');
const tsconfigOutPath = path.resolve(__dirname, 'tsconfig.GAS.json');

// Check if update is needed by comparing timestamps
function needsUpdate() {
  try {
    const sourceStats = fs.statSync(tsconfigTransformPath);
    const targetStats = fs.statSync(tsconfigOutPath);
    return sourceStats.mtime > targetStats.mtime;
  } catch (err) {
    // Target doesn't exist, so update is needed
    return true;
  }
}

// Only proceed if update is needed
if (needsUpdate()) {
  console.log('Updating tsconfig.GAS.json...');
  
  // Ensure the script can modify the file by removing read-only attribute
  fs.chmod(tsconfigOutPath, 0o644, (err) => {
    if (err && err.code !== 'ENOENT') {
      // Ignore if file doesn't exist yet
      console.error(`Error making ${tsconfigOutPath} writable: ${err.message}`);
      return;
    }

    // Read input file
    fs.readFile(tsconfigInPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading tsconfig.json: ${err.message}`);
        return;
      }

      // Parse JSON
      let tsconfig;
      try {
        tsconfig = JSON.parse(data);
      } catch (err) {
        console.error(`Error parsing tsconfig.json: ${err.message}`);
        return;
      }

      // Override options
      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.target = 'ES5';
      tsconfig.compilerOptions.module = 'none';
      tsconfig.compilerOptions.types = [];
      tsconfig.compilerOptions.allowJs = true;
      tsconfig.compilerOptions.checkJs = false;
      tsconfig.compilerOptions.lib = ["es5"];
      tsconfig.include = [ "src/**/*.js" ];
      tsconfig.exclude = [ "test/**/*.ts", "node_modules" ];

      tsconfig.compilerOptions.esModuleInterop = true;
      tsconfig.compilerOptions.moduleResolution = "classic";

      // Write to output file
      const tsconfigData = JSON.stringify(tsconfig, null, 2);
      fs.writeFile(tsconfigOutPath, tsconfigData, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing ${tsconfigOutPath}: ${err.message}`);
          return;
        }
        console.log(`'${tsconfigOutPath}' has been created from '${tsconfigInPath}!'`);

        // Set the file as read-only
        fs.chmod(tsconfigOutPath, 0o444, (err) => {
          if (err) {
            console.error(`Error setting file to read-only: ${err.message}`);
          }
        });
      });
    });
  });
} else {
  console.log('✓ tsconfig.GAS.json is up to date');
}
