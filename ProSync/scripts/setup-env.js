const fs = require('fs');
const path = require('path');

const files = [
  ['backend/env.example', 'backend/.env'],
  ['frontend/env.example', 'frontend/.env'],
];

for (const [source, target] of files) {
  const sourcePath = path.resolve(__dirname, '..', source);
  const targetPath = path.resolve(__dirname, '..', target);

  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Created ${target}`);
  } else {
    console.log(`Kept existing ${target}`);
  }
}

console.log('Environment files are ready.');
