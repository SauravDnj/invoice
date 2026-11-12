import fs from 'fs';
import { getBackendConfig } from '@invoice-builder/core/config';
import { createPostgresAdapter } from '@invoice-builder/core/db/client';
import { initInitialData, initSchema } from '@invoice-builder/core/db/setup';
import type { DatabaseAdapter } from '@invoice-builder/core/types/DatabaseAdapter';
import { runMigrations } from './migration';

// Hosted mode (e.g. Vercel): requests may land on fresh, short-lived instances, so the
// in-memory session/database registries cannot be relied on. Instead every request uses
// one Postgres database configured through DATABASE_URL.
export const getHostedDatabaseUrl = () => process.env.DATABASE_URL?.trim() || undefined;

// On Vercel the filesystem is read-only, so local SQLite sessions can never work there: treat
// it as hosted mode even when DATABASE_URL is missing, so requests fail with error.noDatabase.
export const isHostedMode = () => Boolean(getHostedDatabaseUrl() || process.env.VERCEL);

let hostedDb: Promise<DatabaseAdapter> | undefined;

const openHostedDatabase = async (): Promise<DatabaseAdapter> => {
  const connectionString = getHostedDatabaseUrl();
  if (!connectionString) throw new Error('error.noDatabase');

  // The shared runner silently skips a missing migrations folder. vercel.json bundles dist-migrations
  // via includeFiles, but an empty folder is not deployed, so only warn here instead of failing.
  const { migrationsPath } = getBackendConfig().webserver;
  if (!fs.existsSync(migrationsPath)) console.warn(`Migrations folder not found, skipping: ${migrationsPath}`);

  // Serverless instances should hold few connections and release them when idle.
  const db = createPostgresAdapter(connectionString, { max: 3, allowExitOnIdle: true });
  try {
    await initSchema(db);
    await initInitialData(db);
    const migrationResult = await runMigrations(db);
    if (migrationResult && !migrationResult.success) {
      throw new Error(migrationResult.message ?? 'error.failedMigration');
    }
    return db;
  } catch (error) {
    await db.close().catch(() => undefined);
    throw error;
  }
};

export const getHostedDatabase = (): Promise<DatabaseAdapter> => {
  if (!hostedDb) {
    hostedDb = openHostedDatabase();
    // Allow a later request to retry if initialization failed (e.g. database briefly unreachable).
    hostedDb.catch(() => {
      hostedDb = undefined;
    });
  }
  return hostedDb;
};
