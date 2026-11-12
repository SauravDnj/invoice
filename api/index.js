// Vercel serverless entry: serves every /api/* request with the Express webserver.
// dist-server is produced by `npm run build:webserver` during the Vercel build.
import server from '../dist-server/main.js';

export default server.createApp();
