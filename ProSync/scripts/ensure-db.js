const net = require('net');
const { spawn } = require('child_process');

const reset = '\x1b[0m';

const writeOutput = (name, color, stream, chunk) => {
  const text = chunk.toString();
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (!line && index === lines.length - 1) {
      return;
    }

    stream.write(`${color}[${name}]${reset} ${line}\n`);
  });
};

const runCommand = (command, args, cwd, label) =>
  new Promise((resolve, reject) => {
    const child =
      process.platform === 'win32'
        ? spawn('cmd.exe', ['/c', command, ...args], {
            cwd,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
          })
        : spawn(command, args, {
            cwd,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
          });

    let stderr = '';

    child.stdout.on('data', (chunk) => writeOutput(label, '\x1b[36m', process.stdout, chunk));
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      writeOutput(label, '\x1b[36m', process.stderr, chunk);
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `${label} failed with code ${code}`));
    });
  });

const waitForPort = (port, timeoutMs = 20000) =>
  new Promise((resolve) => {
    const start = Date.now();

    const tryConnect = () => {
      const socket = net.createConnection({ host: '127.0.0.1', port });

      socket.on('connect', () => {
        socket.end();
        resolve(true);
      });

      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }

        setTimeout(tryConnect, 500);
      });
    };

    tryConnect();
  });

const ensureMongoDb = async (rootDir) => {
  const mongoReady = await waitForPort(27017, 1000);

  if (mongoReady) {
    process.stdout.write(`\x1b[36m[DB]${reset} Reusing existing MongoDB on localhost:27017\n`);
    return;
  }

  process.stdout.write(`\x1b[36m[DB]${reset} Starting MongoDB container...\n`);

  try {
    await runCommand('docker', ['compose', 'up', '-d', 'mongodb'], rootDir, 'DB');
  } catch (error) {
    const message = error.message || '';

    if (
      message.includes('dockerDesktopLinuxEngine') ||
      message.includes('docker_engine') ||
      message.includes('The system cannot find the file specified')
    ) {
      throw new Error('Docker Desktop is not running. Start Docker Desktop, wait until it is ready, then run the command again.');
    }

    throw error;
  }

  const started = await waitForPort(27017, 30000);

  if (!started) {
    throw new Error('MongoDB did not become ready on localhost:27017');
  }

  process.stdout.write(`\x1b[36m[DB]${reset} MongoDB is ready on localhost:27017\n`);
};

module.exports = {
  ensureMongoDb,
};
