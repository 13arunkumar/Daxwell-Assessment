const fs = require('fs');
const path = require('path');

const pathsToRemove = [
  'backend/node_modules',
  'frontend/node_modules',
  'backend/package-lock.json',
  'frontend/package-lock.json',
];

for (const relativePath of pathsToRemove) {
  const targetPath = path.resolve(__dirname, '..', relativePath);

  if (!fs.existsSync(targetPath)) {
    continue;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
  console.log(`Removed ${relativePath}`);
}
