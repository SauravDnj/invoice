/* global process */
// Vercel Routing Middleware: optional password protection for the hosted deployment.
// Set APP_PASSWORD (and optionally APP_USERNAME, default "admin") in the Vercel project
// settings to require a browser login for the whole site, including /api.
export default function middleware(request) {
  const password = process.env.APP_PASSWORD;
  if (!password) return;

  const username = process.env.APP_USERNAME || 'admin';
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    try {
      const [user, ...rest] = atob(header.slice(6)).split(':');
      if (user === username && rest.join(':') === password) return;
    } catch {
      // Malformed header: fall through to the login prompt.
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Invoice Builder", charset="UTF-8"' }
  });
}
