import { DatabaseType } from '@invoice-builder/contracts';
import type express from 'express';
import type { AddressInfo } from 'net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { DatabaseAdapter } from '@invoice-builder/core/types/DatabaseAdapter';

const mocks = vi.hoisted(() => ({
  createPostgresAdapter: vi.fn(),
  initSchema: vi.fn(),
  initInitialData: vi.fn(),
  runMigrations: vi.fn()
}));
vi.mock('@invoice-builder/core/db/client', async importOriginal => ({
  ...(await importOriginal<object>()),
  createPostgresAdapter: mocks.createPostgresAdapter
}));
vi.mock('@invoice-builder/core/db/setup', async importOriginal => ({
  ...(await importOriginal<object>()),
  initSchema: mocks.initSchema,
  initInitialData: mocks.initInitialData
}));
vi.mock('../migration', () => ({ runMigrations: mocks.runMigrations }));

const makeDb = () =>
  ({
    type: DatabaseType.postgres,
    run: vi.fn().mockResolvedValue(0),
    get: vi.fn().mockResolvedValue(null),
    all: vi.fn().mockResolvedValue([]),
    close: vi.fn().mockResolvedValue(undefined)
  }) as unknown as DatabaseAdapter;

const request = async (app: express.Express, path: string) => {
  const server = app.listen(0);
  await new Promise<void>(resolve => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    return await fetch(`http://127.0.0.1:${port}${path}`);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
};

// Each test re-imports the whole webserver (vi.resetModules), so the first import is slow.
describe('webserver hosted mode (Vercel)', { timeout: 30_000 }, () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.runMigrations.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('serves data routes from DATABASE_URL without a browser session', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://user:pass@db.example/invoices');
    const db = makeDb();
    mocks.createPostgresAdapter.mockReturnValue(db);

    const { createApp } = await import('../main');
    const res = await request(createApp(), '/api/clients');

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true });
    expect(mocks.createPostgresAdapter).toHaveBeenCalledWith(
      'postgres://user:pass@db.example/invoices',
      expect.objectContaining({ max: 3 })
    );
    expect(db.all).toHaveBeenCalled();
  });

  it('reports a missing database instead of falling back to local files on Vercel', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('DATABASE_URL', '');

    const { createApp } = await import('../main');
    const app = createApp();

    const health = await request(app, '/api/health');
    expect(health.status).toBe(200);

    const res = await request(app, '/api/clients');
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ success: false, key: 'error.noDatabase' });
    expect(mocks.createPostgresAdapter).not.toHaveBeenCalled();
  });

  it('fails hosted startup when migrations fail', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://user:pass@db.example/invoices');
    const db = makeDb();
    mocks.createPostgresAdapter.mockReturnValue(db);
    mocks.runMigrations.mockResolvedValue({ success: false, message: 'boom' });

    const { createApp } = await import('../main');
    const res = await request(createApp(), '/api/clients');

    expect(res.status).toBe(503);
    expect(db.close).toHaveBeenCalled();
  });
});
