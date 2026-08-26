const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const backendDir = path.join(root, 'backend');
const frontendDir = path.join(root, 'frontend');

function startProcess(command, args, cwd, label) {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: 'true' }
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n${label} finalizó con código ${code}`);
    }
  });

  return child;
}

console.log('Iniciando BusinessFlow en modo desarrollo...');
console.log('Backend: http://localhost:8080');
console.log('Frontend: http://localhost:3000');

startProcess('mvn', ['spring-boot:run'], backendDir, 'Backend');
startProcess('npm', ['run', 'dev', '--', '--host', '0.0.0.0'], frontendDir, 'Frontend');
