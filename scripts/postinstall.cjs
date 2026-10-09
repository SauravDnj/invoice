/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');

// electron-rebuild is only needed for the Electron desktop app; Docker/webserver
// builds use plain Node sqlite3 bindings, so skip it there.
if (process.env.SKIP_ELECTRON_REBUILD === 'true') {
  console.log('[postinstall] SKIP_ELECTRON_REBUILD=true, skipping electron-rebuild');
  process.exit(0);
}

try {
  execSync('electron-rebuild -f -o sqlite3 -m packages/core', { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status ?? 1);
}
