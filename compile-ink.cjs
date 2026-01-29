// Script to compile Ink story to JavaScript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inkFile = path.join(__dirname, 'public/ink/72Hours.ink');
const jsonOutputFile = path.join(__dirname, 'public/ink/72Hours.json');
const jsOutputFile = path.join(__dirname, 'public/ink/72Hours.js');
const inklecateBin = path.join(__dirname, 'node_modules/inklecate/bin/inklecate');

try {
  // Run inklecate directly to compile to JSON
  execSync(`"${inklecateBin}" -o "${jsonOutputFile}" "${inkFile}"`, {
    encoding: 'utf8',
    cwd: __dirname
  });

  // Read the JSON and wrap it as JavaScript
  let jsonContent = fs.readFileSync(jsonOutputFile, 'utf8');
  // Remove BOM if present
  if (jsonContent.charCodeAt(0) === 0xFEFF) {
    jsonContent = jsonContent.slice(1);
  }
  const jsContent = 'var storyContent = ' + jsonContent + ';';
  fs.writeFileSync(jsOutputFile, jsContent);

  // Clean up JSON file (optional, keep if you want)
  fs.unlinkSync(jsonOutputFile);

  console.log('Successfully compiled 72Hours.ink to 72Hours.js');
} catch (error) {
  console.error('Error compiling Ink file:', error.message);
  process.exit(1);
}
