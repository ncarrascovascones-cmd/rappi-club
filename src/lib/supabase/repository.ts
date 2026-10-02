import { getSupabase } from './client';
import type { Cluster, Experience, HelpRequest, IncidentReport, Protocol } from '../types';

/**
 * Repositorio remoto. Cada tabla guarda la entidad completa en una columna `data` (jsonb),
 * lo que mantiene el esquema simple para el prototipo. Ver `supabase/schema.sql`.
 */
export const TABLES = {
  protocols: 'crew_protocols',
  experiences: 'crew_experiences',
  helpRequests: 'crew_help_requests',
  clusters: 'crew_clusters',
  incidents: 'crew_incidents',
} as const;

export type RemoteTable = (typeof TABLES)[keyof typeof TABLES];

export interface RemoteSnapshot {
  protocols: Protocol[];
  experiences: Experience[];
  helpRequests: HelpRequest[];
  clusters: Cluster[];
}

async function fetchTable<T>(table: RemoteTable): Promise<T[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from(table).select('data').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: { data: T }) => row.data);
}

export async function fetchSnapshot(): Promise<RemoteSnapshot | null> {
  if (!getSupabase()) return null;
  const [protocols, experiences, helpRequests, clusters] = await Promise.all([
    fetchTable<Protocol>(TABLES.protocols),
    fetchTable<Experience>(TABLES.experiences),
    fetchTable<HelpRequest>(TABLES.helpRequests),
    fetchTable<Cluster>(TABLES.clusters),
  ]);
  return { protocols, experiences, helpRequests, clusters };
}

export async function upsertRemote(
  table: RemoteTable,
  entity: Protocol | Experience | HelpRequest | Cluster | IncidentReport,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb
    .from(table)
    .upsert({ id: entity.id, data: entity, updated_at: new Date().toISOString() });
  if (error) throw error;
}
