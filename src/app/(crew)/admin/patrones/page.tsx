'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileSearch,
  Lightbulb,
  MapPin,
  Layers,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { CLUSTER_STATUS, categoryLabel } from '@/lib/labels';
import { flowSteps } from '@/lib/admin';
import type { Cluster, ClusterStatus } from '@/lib/types';
import { cn, formatDate, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Chip } from '@/components/ui/field';
import { EmptyState } from '@/components/ui/states';
import { Avatar } from '@/components/ui/avatar';
import { AdminFlow } from '@/components/admin-flow';
import { CategoryIcon } from '@/components/category-icon';
import { useToast } from '@/components/ui/toast';

const ORDER: ClusterStatus[] = ['detectado', 'en_analisis', 'protocolo_en_borrador', 'en_validacion', 'publicado'];

export default function PatronesPage() {
  const { state } = useCrew();
  const [filter, setFilter] = useState<'todos' | 'accion' | 'publicado'>('todos');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (h) {
      setHash(h);
      window.setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }, []);

  const list = useMemo(
    () =>
      [...state.clusters]
        .filter((c) =>
          filter === 'todos' ? true : filter === 'publicado' ? c.status === 'publicado' : c.status !== 'publicado',
        )
        .sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || b.cases - a.cases),
    [state.clusters, filter],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Pasos 2 y 3"
        title="Problemas recurrentes"
        description="Patrones identificados a partir de casos y experiencias. Analiza cada uno y propone una solución que se convierta en Protocolo Crew."
        actions={
          <ButtonLink href="/admin/experiencias" variant="secondary" size="sm" icon={<Layers className="h-4 w-4" />}>
            Agrupar experiencias
          </ButtonLink>
        }
      />
      <div className="mb-6">
        <AdminFlow steps={flowSteps(state)} active="patron" />
      </div>

      <div className="mb-4 flex gap-2">
        <Chip active={filter === 'todos'} onClick={() => setFilter('todos')}>
          Todos ({state.clusters.length})
        </Chip>
        <Chip active={filter === 'accion'} onClick={() => setFilter('accion')}>
          Requieren acción ({state.clusters.filter((c) => c.status !== 'publicado').length})
        </Chip>
        <Chip active={filter === 'publicado'} onClick={() => setFilter('publicado')}>
          Resueltos
        </Chip>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<Layers className="h-6 w-6" />} title="No hay patrones en esta vista" />
      ) : (
        <div className="stagger space-y-3">
          {list.map((c) => (
            <ClusterCard key={c.id} cluster={c} highlight={hash === c.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClusterCard({ cluster: c, highlight }: { cluster: Cluster; highlight: boolean }) {
  const { state, setClusterStatus, createProtocol } = useCrew();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(highlight);
  const exps = state.experiences.filter((e) => c.experienceIds.includes(e.id));
  const protocol = state.protocols.find((p) => p.id === c.protocolId);
  const stepIdx = ORDER.indexOf(c.status);

  useEffect(() => {
    if (highlight) setOpen(true);
  }, [highlight]);

  return (
    <Card id={c.id} className={cn('scroll-mt-24 overflow-hidden', highlight && 'ring-2 ring-brand-300')}>
      <div className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <CategoryIcon category={c.category} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[17px] font-extrabold text-ink-900">{c.title}</p>
                <Badge tone={CLUSTER_STATUS[c.status].tone} dot>
                  {CLUSTER_STATUS[c.status].label}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-ink-500">
                {categoryLabel(c.category)} · Detectado el {formatDate(c.createdAt)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.zones.map((z) => (
                  <span key={z} className="inline-flex items-center gap-1 rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
                    <MapPin className="h-3 w-3" /> {z}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 md:text-right">
            <div>
              <p className="text-3xl font-extrabold text-ink-900">{c.cases}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">casos</p>
            </div>
            <div>
              <p className={cn('inline-flex items-center gap-1 text-lg font-extrabold', c.trend > 0 ? 'text-brand-600' : 'text-mint-600')}>
                {c.trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {c.trend > 0 ? '+' : ''}
                {c.trend}%
              </p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">semana</p>
            </div>
          </div>
        </div>

        {/* Progreso en el flujo */}
        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {ORDER.map((s, i) => (
            <div key={s}>
              <div className={cn('h-1.5 rounded-full', i <= stepIdx ? (c.status === 'publicado' ? 'bg-mint-500' : 'bg-brand-500') : 'bg-ink-100')} />
              <p className={cn('mt-1 hidden text-[10px] font-bold sm:block', i <= stepIdx ? 'text-ink-700' : 'text-ink-300')}>
                {CLUSTER_STATUS[s].label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-sm font-bold text-ink-500 hover:text-ink-900" aria-expanded={open}>
            {exps.length} experiencia{exps.length === 1 ? '' : 's'} agrupada{exps.length === 1 ? '' : 's'}
            <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />
          </button>
          <div className="flex flex-wrap gap-2">
            {c.status === 'detectado' && (
              <Button
                size="sm"
                variant="dark"
                icon={<FileSearch className="h-4 w-4" />}
                onClick={() => {
                  setClusterStatus(c.id, 'en_analisis');
                  toast({ tone: 'success', title: 'Patrón en análisis', description: 'Siguiente paso: proponer una solución.' });
                }}
              >
                Analizar patrón
              </Button>
            )}
            {c.status === 'en_analisis' && (
              <Button
                size="sm"
                icon={<Lightbulb className="h-4 w-4" />}
                onClick={() => {
                  const id = createProtocol(c.id);
                  toast({ tone: 'success', title: 'Borrador creado', description: 'Lo prellenamos con las experiencias del patrón.' });
                  router.push(`/admin/protocolos/${id}`);
                }}
              >
                Proponer solución y crear protocolo
              </Button>
            )}
            {protocol && c.status !== 'publicado' && (
              <ButtonLink href={`/admin/protocolos/${protocol.id}`} size="sm" variant="dark" iconRight={<ArrowRight className="h-4 w-4" />}>
                Abrir protocolo {protocolShort(protocol.number)}
              </ButtonLink>
            )}
            {protocol && c.status === 'publicado' && (
              <ButtonLink href={`/protocolos/${protocol.id}`} size="sm" variant="secondary" icon={<BookOpen className="h-4 w-4" />}>
                Ver protocolo publicado
              </ButtonLink>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-ink-100 bg-ink-50/60 p-4">
          {exps.length === 0 ? (
            <p className="text-sm text-ink-500">
              Este patrón se detectó a partir de {c.cases} casos de “Necesito una mano”. Puedes sumarle experiencias desde{' '}
              <Link href="/admin/experiencias" className="font-bold text-brand-600">
                Experiencias
              </Link>
              .
            </p>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {exps.map((e) => (
                <li key={e.id} className="rounded-2xl bg-white p-3 ring-1 ring-ink-100">
                  <div className="flex items-center gap-2">
                    <Avatar initials={e.initials} color={e.color} size="xs" />
                    <p className="text-xs font-bold text-ink-800">
                      {e.author} · <span className="font-medium text-ink-400">{e.zone}</span>
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-ink-700">{e.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
