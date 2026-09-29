'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookCheck,
  BookPlus,
  Clock3,
  Inbox,
  Layers,
  MessageSquareText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { CLUSTER_STATUS, HELP_STATUS, categoryLabel } from '@/lib/labels';
import { DEMO_ADMIN } from '@/lib/demo-data';
import { cn, formatNumber, timeAgo } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { CrewFlow } from '@/components/crew-flow';
import { CategoryIcon } from '@/components/category-icon';

export default function AdminHome() {
  const { state, createProtocol } = useCrew();
  const router = useRouter();
  const pending = state.protocols.filter((p) => ['borrador', 'en_validacion', 'aprobado'].includes(p.status));
  const validated = state.protocols.filter((p) => p.status === 'publicado');
  const clusters = [...state.clusters].sort((a, b) => b.cases - a.cases);
  const recent = [...state.helpRequests].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  const kpis = [
    { label: 'Casos recibidos', value: state.helpRequests.length, icon: Inbox, href: '/admin/experiencias?tab=casos', tone: 'bg-brand-50 text-brand-600' },
    { label: 'Problemas recurrentes', value: state.clusters.length, icon: Layers, href: '/admin/patrones', tone: 'bg-sun-50 text-sun-700' },
    { label: 'Experiencias', value: state.experiences.length, icon: MessageSquareText, href: '/admin/experiencias', tone: 'bg-sky-50 text-sky-600' },
    { label: 'Protocolos pendientes', value: pending.length, icon: Clock3, href: '/admin/protocolos?s=pendientes', tone: 'bg-grape-50 text-grape-600' },
    { label: 'Protocolos validados', value: validated.length, icon: BookCheck, href: '/admin/protocolos?s=publicado', tone: 'bg-mint-50 text-mint-600' },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Rappi Crew"
        title={`Hola, ${DEMO_ADMIN.firstName}`}
        description="Convierte las experiencias de la flota en Protocolos Crew validados. Aquí ves qué está pasando en la calle."
        actions={
          <>
            <ButtonLink href="/admin/experiencias" variant="secondary" size="sm">
              Ver experiencias
            </ButtonLink>
            <Button
              size="sm"
              variant="dark"
              icon={<BookPlus className="h-4 w-4" />}
              onClick={() => router.push(`/admin/protocolos/${createProtocol()}`)}
            >
              Crear protocolo
            </Button>
          </>
        }
      />

      <section className="mb-8 animate-fade-up rounded-[28px] bg-white p-4 shadow-card ring-1 ring-ink-900/[0.04] sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-600">El corazón de Rappi Crew</p>
            <p className="text-xl font-extrabold tracking-tight text-ink-900">De la experiencia al Protocolo Crew</p>
          </div>
          <p className="max-w-sm text-xs text-ink-500">
            Los consejos de la Crew no se vuelven reglas automáticamente: Rappi identifica, propone y valida.
          </p>
        </div>
        <CrewFlow
          counts={[
            state.helpRequests.length,
            state.experiences.length,
            state.clusters.filter((c) => c.status !== 'publicado').length,
            state.protocols.filter((p) => p.status === 'borrador').length,
            state.protocols.filter((p) => p.status === 'en_validacion' || p.status === 'aprobado').length,
            validated.length,
            formatNumber(validated.reduce((a, p) => a + p.views, 0)),
          ]}
          links={[
            '/admin/experiencias?tab=casos',
            '/admin/experiencias',
            '/admin/patrones',
            '/admin/protocolos?s=borrador',
            '/admin/protocolos?s=en_validacion',
            '/admin/protocolos?s=publicado',
            '/admin/analitica',
          ]}
        />
        <p className="mt-2 text-center text-[11px] text-ink-400">
          Números en vivo de esta demo: casos · experiencias · patrones abiertos · borradores · en validación · publicados · consultas
        </p>
      </section>

      <div className="stagger grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="group rounded-3xl bg-white p-4 shadow-card ring-1 ring-ink-900/[0.04] transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', k.tone)}>
              <k.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">{k.value}</p>
            <p className="flex items-center justify-between text-xs font-semibold text-ink-500">
              {k.label}
              <ArrowRight className="h-3.5 w-3.5 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
            </p>
          </Link>
        ))}
      </div>


      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-5 pb-3">
            <div>
              <p className="text-lg font-extrabold text-ink-900">Problemas recurrentes</p>
              <p className="text-sm text-ink-500">Agrupados a partir de casos y experiencias.</p>
            </div>
            <ButtonLink href="/admin/patrones" variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              Gestionar
            </ButtonLink>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-y border-ink-100 bg-ink-50/60 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-3">Problema</th>
                  <th className="px-3 py-3 text-right">Número de casos</th>
                  <th className="px-3 py-3 text-right">Tendencia</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {clusters.map((c) => (
                  <tr key={c.id} className="transition hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/patrones#${c.id}`} className="flex items-center gap-3">
                        <CategoryIcon category={c.category} size="sm" />
                        <span>
                          <span className="block font-bold text-ink-900">{c.title}</span>
                          <span className="block text-xs text-ink-400">{categoryLabel(c.category)}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right text-base font-extrabold text-ink-900">{c.cases}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={cn('inline-flex items-center gap-1 text-xs font-bold', c.trend > 0 ? 'text-brand-600' : 'text-mint-600')}>
                        {c.trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {c.trend > 0 ? '+' : ''}
                        {c.trend}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={CLUSTER_STATUS[c.status].tone} dot>
                        {CLUSTER_STATUS[c.status].label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-ink-900">Casos recientes</p>
              <Link href="/admin/experiencias?tab=casos" className="text-sm font-bold text-brand-600">
                Ver todos
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-ink-100">
              {recent.map((h) => (
                <li key={h.id} className="flex items-start gap-3 py-3">
                  <CategoryIcon category={h.category} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{categoryLabel(h.category)}</p>
                    <p className="line-clamp-1 text-xs text-ink-500">{h.text}</p>
                    <p className="mt-0.5 text-[11px] text-ink-400">
                      {h.riderName} · {h.zone} · {timeAgo(h.createdAt)}
                    </p>
                  </div>
                  <Badge tone={HELP_STATUS[h.status].tone}>{HELP_STATUS[h.status].label}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <p className="text-lg font-extrabold text-ink-900">Protocolos pendientes</p>
            {pending.length === 0 ? (
              <p className="mt-2 text-sm text-ink-500">No hay protocolos pendientes. 🎉</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pending.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/protocolos/${p.id}`} className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3 transition hover:bg-ink-100">
                      <span className="text-xs font-extrabold text-ink-400">#{String(p.number).padStart(3, '0')}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink-900">{p.title}</span>
                      <Badge tone={p.status === 'borrador' ? 'ink' : p.status === 'en_validacion' ? 'sun' : 'sky'}>
                        {p.status === 'borrador' ? 'Borrador' : p.status === 'en_validacion' ? 'Validación' : 'Aprobado'}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
