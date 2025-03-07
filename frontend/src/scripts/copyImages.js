const fs = require('fs');
const path = require('path');

// Paths
const publicDir = path.join(__dirname, '../../public');
const assetsDir = path.join(__dirname, '../assets');

// Make sure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Copy images from public to assets
function copyDir(source, destination) {
  // Make sure destination exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  // Get all files in source directory
  const files = fs.readdirSync(source);

  // Copy each file
  files.forEach(file => {
    const sourceFile = path.join(source, file);
    const destinationFile = path.join(destination, file);

    // Check if it's a directory
    if (fs.lstatSync(sourceFile).isDirectory()) {
      copyDir(sourceFile, destinationFile);
    } else {
      // Copy file
      fs.copyFileSync(sourceFile, destinationFile);
      console.log(`Copied: ${sourceFile} -> ${destinationFile}`);
    }
  });
}

// Copy toys and images directories
copyDir(path.join(publicDir, 'toys'), path.join(assetsDir, 'toys'));
copyDir(path.join(publicDir, 'images'), path.join(assetsDir, 'images'));

console.log('All images copied successfully!');
