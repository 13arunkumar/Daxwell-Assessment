const { spawn } = require('child_process');
const path = require('path');
const { ensureMongoDb } = require('./ensure-db');

const rootDir = path.resolve(__dirname, '..');

const runSeed = () =>
  new Promise((resolve, reject) => {
    const child =
      process.platform === 'win32'
        ? spawn('cmd.exe', ['/c', 'npm.cmd', 'run', 'seed'], {
            cwd: path.join(rootDir, 'backend'),
            stdio: 'inherit',
            shell: false,
          })
        : spawn('npm', ['run', 'seed'], {
            cwd: path.join(rootDir, 'backend'),
            stdio: 'inherit',
            shell: false,
          });

    child.on('error', reject);
    child.on('exit', (code) => {
      process.exit(code || 0);
    });
  });

const main = async () => {
  try {
    await ensureMongoDb(rootDir);
    await runSeed();
  } catch (error) {
    console.error(`\x1b[31m[SEED]\x1b[0m ${error.message}`);
    process.exit(1);
  }
};

main();
