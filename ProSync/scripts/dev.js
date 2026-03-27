const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const { ensureMongoDb } = require('./ensure-db');

const rootDir = path.resolve(__dirname, '..');
const processConfigs = [
  {
    name: 'BACKEND',
    color: '\x1b[34m',
    cwd: path.join(rootDir, 'backend'),
    args: ['run', 'dev'],
  },
  {
    name: 'FRONTEND',
    color: '\x1b[32m',
    cwd: path.join(rootDir, 'frontend'),
    args: ['run', 'dev'],
  },
];

const reset = '\x1b[0m';
let shuttingDown = false;
const children = [];

const checkBackendHealth = () =>
  new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:8080/health', (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });

    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });

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

const shutdown = (code = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  setTimeout(() => process.exit(code), 200);
};

const startProcess = (proc) => {
  const child =
    process.platform === 'win32'
      ? spawn('cmd.exe', ['/c', 'npm.cmd', ...proc.args], {
          cwd: proc.cwd,
          stdio: ['inherit', 'pipe', 'pipe'],
          shell: false,
        })
      : spawn('npm', proc.args, {
          cwd: proc.cwd,
          stdio: ['inherit', 'pipe', 'pipe'],
          shell: false,
        });

  children.push(child);

  child.stdout.on('data', (chunk) => writeOutput(proc.name, proc.color, process.stdout, chunk));
  child.stderr.on('data', (chunk) => writeOutput(proc.name, proc.color, process.stderr, chunk));

  child.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      console.error(`${proc.color}[${proc.name}]${reset} exited with code ${code}`);
      shutdown(code);
    }
  });
};

const main = async () => {
  try {
    await ensureMongoDb(rootDir);
  } catch (error) {
    console.error(`\x1b[31m[DB]${reset} ${error.message}`);
    process.exit(1);
  }

  const backendProcess = processConfigs[0];
  const frontendProcess = processConfigs[1];
  const backendHealthy = await checkBackendHealth();

  if (backendHealthy) {
    process.stdout.write(`${backendProcess.color}[BACKEND]${reset} Reusing existing backend on http://localhost:8080\n`);
  } else {
    startProcess(backendProcess);
  }

  startProcess(frontendProcess);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
main();
