'use client';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookPlus, ChevronRight, Eye, FileText, ThumbsUp } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { PROTOCOL_STATUS, categoryLabel } from '@/lib/labels';
import { flowSteps } from '@/lib/admin';
import type { ProtocolStatus } from '@/lib/types';
import { cn, formatDate, formatNumber, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/field';
import { EmptyState, PageSkeleton } from '@/components/ui/states';
import { AdminFlow } from '@/components/admin-flow';
import { CategoryIcon } from '@/components/category-icon';

type Filter = 'todos' | 'pendientes' | ProtocolStatus;

function ProtocolsAdminView() {
  const { state, createProtocol } = useCrew();
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get('s') as Filter | null;
  const filter: Filter =
    raw && (['todos', 'pendientes', 'borrador', 'en_validacion', 'aprobado', 'publicado'] as string[]).includes(raw) ? raw : 'todos';

  const setFilter = (f: Filter) => router.replace(f === 'todos' ? '/admin/protocolos' : `/admin/protocolos?s=${f}`);

  const list = useMemo(
    () =>
      state.protocols
        .filter((p) =>
          filter === 'todos' ? true : filter === 'pendientes' ? p.status !== 'publicado' : p.status === filter,
        )
        .sort((a, b) => b.number - a.number),
    [state.protocols, filter],
  );

  const count = (s: ProtocolStatus) => state.protocols.filter((p) => p.status === s).length;

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Pasos 4, 5 y 6"
        title="Gestión de protocolos"
        description="Crea, edita, valida y publica Protocolos Crew. Solo los publicados son visibles para los Rappitenderos."
        actions={
          <Button size="sm" variant="dark" icon={<BookPlus className="h-4 w-4" />} onClick={() => router.push(`/admin/protocolos/${createProtocol()}`)}>
            Nuevo protocolo
          </Button>
        }
      />
      <div className="mb-6">
        <AdminFlow
          steps={flowSteps(state)}
          active={filter === 'borrador' ? 'crear' : filter === 'en_validacion' ? 'validar' : filter === 'aprobado' ? 'publicar' : undefined}
        />
      </div>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip active={filter === 'todos'} onClick={() => setFilter('todos')}>
          Todos ({state.protocols.length})
        </Chip>
        <Chip active={filter === 'pendientes'} onClick={() => setFilter('pendientes')}>
          Pendientes ({state.protocols.length - count('publicado')})
        </Chip>
        {(Object.keys(PROTOCOL_STATUS) as ProtocolStatus[]).map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {PROTOCOL_STATUS[s].label} ({count(s)})
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No hay protocolos en este estado"
          description="Crea uno nuevo o revisa los patrones detectados."
          action={
            <Button size="sm" onClick={() => router.push(`/admin/protocolos/${createProtocol()}`)}>
              Crear protocolo
            </Button>
          }
        />
      ) : (
        <Card className="divide-y divide-ink-100 overflow-hidden">
          {list.map((p) => (
            <Link key={p.id} href={`/admin/protocolos/${p.id}`} className="group flex items-center gap-4 p-4 transition hover:bg-ink-50/70 sm:px-5">
              <CategoryIcon category={p.category} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Protocolo Crew {protocolShort(p.number)}</p>
                <p className="truncate font-bold text-ink-900">{p.title || 'Sin título'}</p>
                <p className="text-xs text-ink-400">
                  {categoryLabel(p.category)} · Actualizado {formatDate(p.updatedAt)}
                </p>
              </div>
              {p.status === 'publicado' && (
                <div className="hidden items-center gap-4 text-xs font-semibold text-ink-500 md:flex">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {formatNumber(p.views)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {formatNumber(p.helpful)}
                  </span>
                </div>
              )}
              <Badge tone={PROTOCOL_STATUS[p.status].tone} dot>
                {PROTOCOL_STATUS[p.status].label}
              </Badge>
              <ChevronRight className={cn('h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500')} />
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}

export default function AdminProtocolsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProtocolsAdminView />
    </Suspense>
  );
}
