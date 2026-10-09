/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Root package.json declares "type": "module", but tsc emits CommonJS output for
// dist-server. Node resolves module type from the nearest package.json, so without
// this marker file dist-server/*.js would incorrectly be loaded as ES modules.
const dir = process.argv[2];
if (!dir) {
  console.error('Usage: node scripts/mark-commonjs.cjs <dir>');
  process.exit(1);
}

fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
