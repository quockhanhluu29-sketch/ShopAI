const { copyFileSync, existsSync, readFileSync } = require('node:fs');
const path = require('node:path');

if (process.env.EAS_BUILD === 'true') {
  const source = process.env.GOOGLE_SERVICES_JSON;

  if (!source || !existsSync(source)) {
    throw new Error(
      'EAS Android build requires the GOOGLE_SERVICES_JSON secret file variable.',
    );
  }

  JSON.parse(readFileSync(source, 'utf8'));
  const target = path.resolve(__dirname, '..', 'android', 'app', 'google-services.json');
  copyFileSync(source, target);
}
