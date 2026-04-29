const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function build() {
  try {
    await execAsync('npx next build', { cwd: 'C:\\Users\\user\\Forge Project\\Forge\\beautybook' });
    console.log('Build complete');
  } catch (err) {
    console.error('Build failed:', err);
  }
}

build();