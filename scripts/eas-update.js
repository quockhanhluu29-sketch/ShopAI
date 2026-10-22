const { spawn } = require('node:child_process');

const profiles = {
  staging: { appEnv: 'staging', easEnvironment: 'preview' },
  production: { appEnv: 'production', easEnvironment: 'production' },
};

const profileName = process.argv[2];
const profile = profiles[profileName];

if (!profile) {
  console.error('Usage: node scripts/eas-update.js <staging|production>');
  process.exit(1);
}

const args = [
  'eas-cli@latest',
  'update',
  '--platform',
  'android',
  '--channel',
  profileName,
  '--message',
  `ShopAI ${profileName} update`,
  '--environment',
  profile.easEnvironment,
];

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
  env: { ...process.env, APP_ENV: profile.appEnv },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('error', error => {
  console.error(`Could not start EAS Update: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`EAS Update stopped by signal ${signal}`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = code ?? 1;
});
