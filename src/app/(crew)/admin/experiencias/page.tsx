'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Inbox, Layers, MessageSquareText, Search, X } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { CLUSTER_STATUS, HELP_CATEGORIES, HELP_STATUS, categoryLabel } from '@/lib/labels';
import { flowSteps } from '@/lib/admin';
import type { Experience, HelpCategory, HelpStatus } from '@/lib/types';
import { cn, protocolShort, timeAgo } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip, Input, Label, Select } from '@/components/ui/field';
import { Modal } from '@/components/ui/modal';
import { EmptyState, ErrorNote, PageSkeleton } from '@/components/ui/states';
import { Avatar } from '@/components/ui/avatar';
import { AdminFlow } from '@/components/admin-flow';
import { CategoryIcon } from '@/components/category-icon';
import { useToast } from '@/components/ui/toast';

const EXP_STATUS: Record<Experience['status'], { label: string; tone: 'brand' | 'sky' | 'mint' }> = {
  nueva: { label: 'Nueva', tone: 'brand' },
  agrupada: { label: 'Agrupada', tone: 'sky' },
  en_protocolo: { label: 'En protocolo', tone: 'mint' },
};

function ExperiencesView() {
  const { state, groupExperiences, setHelpStatus } = useCrew();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get('tab') === 'casos' ? 'casos' : 'experiencias';
  const initialCat = params.get('c') as HelpCategory | null;
  const [cat, setCat] = useState<HelpCategory | 'todas'>(
    initialCat && HELP_CATEGORIES.some((c) => c.id === initialCat) ? initialCat : 'todas',
  );
  const [status, setStatus] = useState<Experience['status'] | 'todas'>('todas');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [groupOpen, setGroupOpen] = useState(false);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [clusterId, setClusterId] = useState('');
  const [title, setTitle] = useState('');
  const [newCat, setNewCat] = useState<HelpCategory>('otro');
  const [error, setError] = useState<string | null>(null);

  const experiences = useMemo(() => {
    const query = q.trim().toLowerCase();
    return state.experiences
      .filter((e) => (cat === 'todas' ? true : e.category === cat))
      .filter((e) => (status === 'todas' ? true : e.status === status))
      .filter((e) => !query || e.text.toLowerCase().includes(query) || e.author.toLowerCase().includes(query) || e.zone.toLowerCase().includes(query))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [state.experiences, cat, status, q]);

  const cases = useMemo(() => {
    const query = q.trim().toLowerCase();
    return state.helpRequests
      .filter((h) => (cat === 'todas' ? true : h.category === cat))
      .filter((h) => !query || h.text.toLowerCase().includes(query) || h.riderName.toLowerCase().includes(query) || h.zone.toLowerCase().includes(query))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [state.helpRequests, cat, q]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const openGroup = () => {
    const first = state.experiences.find((e) => e.id === selected[0]);
    const sameCat = state.clusters.filter((c) => c.category === first?.category && c.status !== 'publicado');
    setMode(sameCat.length ? 'existing' : 'new');
    setClusterId(sameCat[0]?.id ?? state.clusters[0]?.id ?? '');
    setNewCat(first?.category ?? 'otro');
    setTitle('');
    setError(null);
    setGroupOpen(true);
  };

  const confirmGroup = () => {
    if (mode === 'new' && title.trim().length < 6) return setError('Ponle un nombre claro al patrón (mínimo 6 caracteres).');
    if (mode === 'existing' && !clusterId) return setError('Elige un patrón existente.');
    const id = groupExperiences(
      selected,
      mode === 'existing' ? { clusterId } : { title: title.trim(), category: newCat },
    );
    setGroupOpen(false);
    setSelected([]);
    toast({ tone: 'success', title: 'Patrón identificado', description: `${selected.length} experiencia(s) agrupadas.` });
    router.push(`/admin/patrones#${id}`);
  };

  const setTab = (t: 'experiencias' | 'casos') => {
    setSelected([]);
    router.replace(t === 'casos' ? '/admin/experiencias?tab=casos' : '/admin/experiencias');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Paso 1"
        title="Experiencias y casos"
        description="Lee lo que comparte la flota, detecta lo que se repite y agrúpalo en patrones para proponer soluciones."
      />

      <div className="mb-6">
        <AdminFlow steps={flowSteps(state)} active="analizar" />
      </div>

      <div className="mb-4 inline-flex rounded-2xl bg-white p-1 shadow-card ring-1 ring-ink-100">
        {(
          [
            { id: 'experiencias', label: 'Experiencias', icon: MessageSquareText, count: state.experiences.length },
            { id: 'casos', label: 'Casos', icon: Inbox, count: state.helpRequests.length },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition',
              tab === t.id ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900',
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
            <span className={cn('rounded-full px-1.5 text-[11px]', tab === t.id ? 'bg-white/20' : 'bg-ink-100')}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por texto, persona o zona…" className="bg-white pl-11" aria-label="Buscar" />
        </div>
        {tab === 'experiencias' && (
          <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="bg-white md:w-52" aria-label="Estado">
            <option value="todas">Todos los estados</option>
            <option value="nueva">Nuevas</option>
            <option value="agrupada">Agrupadas</option>
            <option value="en_protocolo">En protocolo</option>
          </Select>
        )}
      </div>
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip active={cat === 'todas'} onClick={() => setCat('todas')}>
          Todas
        </Chip>
        {HELP_CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>

      {tab === 'experiencias' ? (
        experiences.length === 0 ? (
          <EmptyState icon={<Search className="h-6 w-6" />} title="Sin experiencias con estos filtros" description="Prueba con otra categoría o estado." />
        ) : (
          <div className="stagger grid gap-3 md:grid-cols-2">
            {experiences.map((e) => {
              const isSel = selected.includes(e.id);
              const cluster = state.clusters.find((c) => c.id === e.clusterId);
              const selectable = e.status !== 'en_protocolo';
              return (
                <Card
                  key={e.id}
                  className={cn('p-4 transition', isSel && 'ring-2 ring-brand-400', selectable && 'cursor-pointer hover:shadow-lift')}
                  onClick={() => selectable && toggle(e.id)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      role="checkbox"
                      aria-checked={isSel}
                      aria-disabled={!selectable}
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 transition',
                        isSel ? 'bg-brand-500 text-white ring-brand-500' : selectable ? 'bg-white ring-ink-300' : 'bg-ink-100 ring-ink-200',
                      )}
                    >
                      {isSel && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <Avatar initials={e.initials} color={e.color} size="xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink-900">{e.author}</p>
                      <p className="text-[11px] text-ink-400">
                        {e.zone} · {timeAgo(e.createdAt)}
                      </p>
                    </div>
                    <Badge tone={EXP_STATUS[e.status].tone}>{EXP_STATUS[e.status].label}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{e.text}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-ink-500">
                      <CategoryIcon category={e.category} size="sm" className="h-6 w-6 rounded-lg" /> {categoryLabel(e.category)}
                    </span>
                    {cluster && (
                      <Link
                        href={`/admin/patrones#${cluster.id}`}
                        onClick={(ev) => ev.stopPropagation()}
                        className="ml-auto inline-flex items-center gap-1 font-bold text-brand-600 hover:underline"
                      >
                        <Layers className="h-3.5 w-3.5" /> {cluster.title}
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : cases.length === 0 ? (
        <EmptyState icon={<Inbox className="h-6 w-6" />} title="Sin casos con estos filtros" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/60 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-3">Caso</th>
                  <th className="px-3 py-3">Rappitendero</th>
                  <th className="px-3 py-3">Patrón / Protocolo</th>
                  <th className="px-3 py-3">Recibido</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {cases.map((h) => {
                  const p = state.protocols.find((x) => x.id === h.matchedProtocolId);
                  const cl = state.clusters.find((x) => x.id === h.clusterId);
                  return (
                    <tr key={h.id} className="align-top hover:bg-ink-50/50">
                      <td className="px-5 py-3">
                        <div className="flex gap-3">
                          <CategoryIcon category={h.category} size="sm" />
                          <div className="max-w-xs">
                            <p className="font-bold text-ink-900">{categoryLabel(h.category)}</p>
                            <p className="line-clamp-2 text-xs text-ink-500">{h.text}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-ink-800">{h.riderName}</p>
                        <p className="text-xs text-ink-400">{h.zone}</p>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {cl && (
                          <Link href={`/admin/patrones#${cl.id}`} className="block font-bold text-ink-700 hover:text-brand-600">
                            {cl.title}
                          </Link>
                        )}
                        {p ? (
                          <Link href={`/protocolos/${p.id}`} className="font-bold text-mint-600 hover:underline">
                            Protocolo {protocolShort(p.number)}
                          </Link>
                        ) : (
                          !cl && <span className="text-ink-400">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs text-ink-500">{timeAgo(h.createdAt)}</td>
                      <td className="px-5 py-3">
                        <select
                          value={h.status}
                          onChange={(e) => {
                            setHelpStatus(h.id, e.target.value as HelpStatus);
                            toast({ tone: 'success', title: 'Estado actualizado', description: HELP_STATUS[e.target.value as HelpStatus].label });
                          }}
                          aria-label="Estado del caso"
                          className={cn(
                            'rounded-xl border-0 px-2.5 py-1.5 text-xs font-bold ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-brand-400',
                            h.status === 'resuelto' ? 'bg-mint-50 text-mint-700 ring-mint-100' : h.status === 'en_revision' ? 'bg-sky-50 text-sky-600 ring-sky-100' : 'bg-sun-50 text-sun-700 ring-sun-100',
                          )}
                        >
                          {(Object.keys(HELP_STATUS) as HelpStatus[]).map((s) => (
                            <option key={s} value={s}>
                              {HELP_STATUS[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Barra de selección */}
      {selected.length > 0 && tab === 'experiencias' && (
        <div className="fixed inset-x-4 bottom-24 z-30 mx-auto flex max-w-xl animate-fade-up items-center gap-3 rounded-2xl bg-ink-900 p-3 pl-4 text-white shadow-lift lg:bottom-8 lg:left-[272px] lg:right-0">
          <p className="flex-1 text-sm font-bold">
            {selected.length} seleccionada{selected.length > 1 ? 's' : ''}
          </p>
          <button onClick={() => setSelected([])} className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Limpiar selección">
            <X className="h-4 w-4" />
          </button>
          <Button size="sm" onClick={openGroup} icon={<Layers className="h-4 w-4" />}>
            Agrupar en patrón
          </Button>
        </div>
      )}

      <Modal
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
        title="Identificar patrón"
        description={`Agrupa ${selected.length} experiencia(s) en un problema recurrente.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setGroupOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmGroup} iconRight={<ArrowRight className="h-4 w-4" />}>
              Agrupar
            </Button>
          </>
        }
      >
        <div className="space-y-4 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {(['existing', 'new'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={cn(
                  'rounded-2xl p-3 text-left text-sm font-bold ring-1 transition',
                  mode === m ? 'bg-brand-50 text-brand-700 ring-brand-300' : 'bg-white text-ink-700 ring-ink-200',
                )}
              >
                {m === 'existing' ? 'Patrón existente' : 'Nuevo patrón'}
              </button>
            ))}
          </div>
          {mode === 'existing' ? (
            <div>
              <Label htmlFor="cl">Patrón</Label>
              <Select id="cl" value={clusterId} onChange={(e) => setClusterId(e.target.value)}>
                {state.clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} · {c.cases} casos · {CLUSTER_STATUS[c.status].label}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="title">Nombre del problema</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Punto de recogida difícil de ubicar" invalid={!!error} />
              </div>
              <div>
                <Label htmlFor="cat">Categoría</Label>
                <Select id="cat" value={newCat} onChange={(e) => setNewCat(e.target.value as HelpCategory)}>
                  {HELP_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
          {error && <ErrorNote>{error}</ErrorNote>}
        </div>
      </Modal>
    </div>
  );
}

export default function AdminExperiencesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ExperiencesView />
    </Suspense>
  );
}
