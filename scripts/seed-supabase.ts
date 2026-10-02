/**
 * Carga los datos demo de Rappi Crew en Supabase.
 * Uso: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run db:seed
 */
import { existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { CLUSTERS, EXPERIENCES, HELP_REQUESTS, PROTOCOLS } from '../src/lib/demo-data';
import { TABLES } from '../src/lib/supabase/repository';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function seed<T extends { id: string }>(table: string, rows: T[]) {
  const { error } = await sb.from(table).upsert(rows.map((r) => ({ id: r.id, data: r })));
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table}: ${rows.length} filas`);
}

(async () => {
  await seed(TABLES.protocols, PROTOCOLS);
  await seed(TABLES.experiences, EXPERIENCES);
  await seed(TABLES.helpRequests, HELP_REQUESTS);
  await seed(TABLES.clusters, CLUSTERS);
  console.log('Seed completado.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
