'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, Bookmark, ChevronDown, Search, ShieldCheck } from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import { HELP_CATEGORIES } from '@/lib/labels';
import type { HelpCategory } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Chip, Input } from '@/components/ui/field';
import { EmptyState } from '@/components/ui/states';
import { Button } from '@/components/ui/button';
import { ProtocolCard } from '@/components/protocol-card';
import { CrewFlow } from '@/components/crew-flow';

export default function ProtocolosPage() {
  const { state } = useCrew();
  const { published } = useSelectors();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<HelpCategory | 'todos' | 'guardados'>('todos');

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return published
      .filter((p) =>
        cat === 'todos' ? true : cat === 'guardados' ? state.savedProtocolIds.includes(p.id) : p.category === cat,
      )
      .filter(
        (p) =>
          !query ||
          p.title.toLowerCase().includes(query) ||
          p.summary.toLowerCase().includes(query) ||
          String(p.number).includes(query),
      )
      .sort((a, b) => b.views - a.views);
  }, [published, q, cat, state.savedProtocolIds]);

  return (
    <div>
      <PageHeader
        eyebrow="Protocolo Crew"
        title="Soluciones que nacen en la calle"
        description="Cada Protocolo Crew se construye con experiencias reales de Rappitenderos y solo se publica cuando Rappi lo valida."
      />

      <details className="group mb-6 animate-fade-up rounded-3xl bg-ink-gradient text-white shadow-lift" open>
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-mint-500">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold">¿Cómo nace un Protocolo Crew?</span>
            <span className="block text-xs text-white/60">
              La Crew aporta experiencias. Rappi identifica el patrón, propone la solución y la valida.
            </span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-white/60 transition group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-5 sm:px-6">
          <CrewFlow dark />
        </div>
      </details>

      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca por problema o número de protocolo…"
            className="bg-white pl-11"
            aria-label="Buscar protocolos"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={cat === 'todos'} onClick={() => setCat('todos')}>
            Todos
          </Chip>
          <Chip active={cat === 'guardados'} onClick={() => setCat('guardados')}>
            <Bookmark className="h-3.5 w-3.5" /> Guardados
          </Chip>
          {HELP_CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink-500">
        <BadgeCheck className="h-4 w-4 text-mint-500" /> {list.length} protocolo{list.length === 1 ? '' : 's'} validado
        {list.length === 1 ? '' : 's'}
      </p>

      {list.length === 0 ? (
        <EmptyState
          icon={cat === 'guardados' ? <Bookmark className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          title={cat === 'guardados' ? 'Aún no guardas protocolos' : 'No encontramos protocolos'}
          description={
            cat === 'guardados'
              ? 'Guarda los protocolos que más usas para tenerlos a mano.'
              : 'Prueba con otra palabra o categoría. Si es algo nuevo, cuéntalo en Necesito una mano.'
          }
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQ('');
                setCat('todos');
              }}
            >
              Ver todos
            </Button>
          }
        />
      ) : (
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProtocolCard key={p.id} protocol={p} />
          ))}
        </div>
      )}
    </div>
  );
}
