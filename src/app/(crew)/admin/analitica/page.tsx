'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Eye,
  FlaskConical,
  Inbox,
  UserCheck,
  UserMinus,
  Users,
  CalendarCheck,
  CalendarRange,
  type LucideIcon,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { ANALYTICS } from '@/lib/demo-data';
import { categoryLabel } from '@/lib/labels';
import { cn, formatNumber, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { BarChart, ChartCard, GroupedBars, HBarList, LineChart, SERIES } from '@/components/charts';

interface Kpi {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  /** true si una baja es buena noticia (p. ej. churn). */
  inverse?: boolean;
  hint: string;
}

export default function AnaliticaPage() {
  const { state } = useCrew();
  const k = ANALYTICS.kpis;

  const kpis: Kpi[] = [
    { label: 'Nuevos Rappitenderos acompañados', value: formatNumber(k.accompanied), delta: k.accompaniedDelta, icon: Users, hint: 'Últimos 6 meses' },
    { label: 'Adopción del Copiloto', value: `${k.adoption}%`, delta: k.adoptionDelta, icon: UserCheck, hint: 'Nuevos que hablan con su Copiloto' },
    { label: 'Problemas reportados', value: formatNumber(k.reported), delta: k.reportedDelta, icon: Inbox, hint: 'Vía Necesito una mano', inverse: true },
    { label: 'Protocolos creados', value: String(k.protocolsCreated), delta: k.protocolsCreatedDelta, icon: BookOpen, hint: 'Desde el lanzamiento' },
    { label: 'Protocolos consultados', value: formatNumber(k.protocolsViewed), delta: k.protocolsViewedDelta, icon: Eye, hint: 'Lecturas totales' },
    { label: 'Problemas resueltos', value: `${k.resolved}%`, delta: k.resolvedDelta, icon: CheckCircle2, hint: 'Con protocolo o Copiloto' },
    { label: 'Retención 30 días', value: `${k.retention30}%`, delta: k.retention30Delta, icon: CalendarCheck, hint: 'Nuevos con Copiloto' },
    { label: 'Retención 60 días', value: `${k.retention60}%`, delta: k.retention60Delta, icon: CalendarRange, hint: 'Nuevos con Copiloto' },
    { label: 'Churn', value: `${k.churn}%`, delta: k.churnDelta, icon: UserMinus, hint: 'Primeros 60 días', inverse: true },
  ];

  const topProtocols = [...state.protocols]
    .filter((p) => p.status === 'publicado')
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Analítica"
        title="Impacto de Rappi Crew"
        description="Cómo el acompañamiento y los Protocolos Crew influyen en la experiencia y permanencia de los nuevos Rappitenderos."
      />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border-2 border-dashed border-sun-400 bg-sun-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun-400 text-white">
          <FlaskConical className="h-5 w-5" />
        </span>
        <div>
          <p className="font-extrabold text-ink-900">
            DATOS DEMO <span className="ml-1 rounded-md bg-ink-900 px-1.5 py-0.5 text-[10px] font-bold text-white">NO REALES</span>
          </p>
          <p className="text-sm text-ink-600">
            Todas las métricas de esta pantalla son ficticias y sirven solo para ilustrar el tablero. No representan datos de Rappi.
          </p>
        </div>
      </div>

      <div className="stagger grid grid-cols-2 gap-3 md:grid-cols-3">
        {kpis.map((kp) => {
          const good = kp.inverse ? kp.delta < 0 : kp.delta > 0;
          return (
            <div key={kp.label} className="relative rounded-3xl bg-white p-4 shadow-card ring-1 ring-ink-900/[0.04] sm:p-5">
              <span className="absolute right-3 top-3 rounded-md bg-sun-50 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-sun-700">DEMO</span>
              <kp.icon className="h-5 w-5 text-ink-400" />
              <p className="mt-3 text-[28px] font-extrabold leading-none tracking-tight text-ink-900 sm:text-[32px]">{kp.value}</p>
              <p className="mt-1.5 text-xs font-bold leading-snug text-ink-700 sm:text-sm">{kp.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cn('inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold', good ? 'bg-mint-50 text-mint-700' : 'bg-brand-50 text-brand-700')}>
                  {kp.delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kp.delta > 0 ? '+' : ''}
                  {kp.delta}
                  {kp.value.endsWith('%') ? ' pp' : '%'}
                </span>
                <span className="text-[11px] text-ink-400">{kp.hint}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Nuevos Rappitenderos acompañados"
          subtitle="Por mes · DEMO"
          table={{ head: ['Mes', 'Acompañados'], rows: ANALYTICS.months.map((m, i) => [m, ANALYTICS.accompaniedByMonth[i]]) }}
        >
          <BarChart labels={ANALYTICS.months} values={ANALYTICS.accompaniedByMonth} />
        </ChartCard>

        <ChartCard
          title="Retención de nuevos: con y sin Copiloto"
          subtitle="% que sigue activo · DEMO"
          legend={[
            { label: 'Con Copiloto', color: SERIES.blue },
            { label: 'Sin Copiloto', color: SERIES.orange },
          ]}
          table={{
            head: ['Periodo', 'Con Copiloto', 'Sin Copiloto'],
            rows: [
              ['30 días', `${ANALYTICS.retention.withCopilot.d30}%`, `${ANALYTICS.retention.withoutCopilot.d30}%`],
              ['60 días', `${ANALYTICS.retention.withCopilot.d60}%`, `${ANALYTICS.retention.withoutCopilot.d60}%`],
            ],
          }}
        >
          <GroupedBars
            groups={['Retención 30 días', 'Retención 60 días']}
            series={[
              { label: 'Con Copiloto', color: SERIES.blue, values: [ANALYTICS.retention.withCopilot.d30, ANALYTICS.retention.withCopilot.d60] },
              { label: 'Sin Copiloto', color: SERIES.orange, values: [ANALYTICS.retention.withoutCopilot.d30, ANALYTICS.retention.withoutCopilot.d60] },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Churn de nuevos (primeros 60 días)"
          subtitle="Por mes · DEMO"
          table={{ head: ['Mes', 'Churn'], rows: ANALYTICS.months.map((m, i) => [m, `${ANALYTICS.churnByMonth[i]}%`]) }}
        >
          <LineChart labels={ANALYTICS.months} values={ANALYTICS.churnByMonth} />
        </ChartCard>

        <ChartCard
          title="Protocolos consultados"
          subtitle="Lecturas por mes · DEMO"
          table={{ head: ['Mes', 'Consultas'], rows: ANALYTICS.months.map((m, i) => [m, ANALYTICS.protocolViewsByMonth[i]]) }}
        >
          <BarChart labels={ANALYTICS.months} values={ANALYTICS.protocolViewsByMonth} format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))} />
        </ChartCard>

        <ChartCard
          title="Problemas reportados por categoría"
          subtitle="Últimos 6 meses · DEMO"
          table={{ head: ['Categoría', 'Casos'], rows: ANALYTICS.problemsByCategory.map((p) => [categoryLabel(p.category), p.value]) }}
        >
          <HBarList items={ANALYTICS.problemsByCategory.map((p) => ({ label: categoryLabel(p.category), value: p.value }))} />
        </ChartCard>

        <ChartCard
          title="Protocolos más consultados"
          subtitle="Consultas acumuladas · DEMO"
          table={{ head: ['Protocolo', 'Consultas'], rows: topProtocols.map((p) => [`${protocolShort(p.number)} ${p.title}`, p.views]) }}
        >
          <HBarList items={topProtocols.map((p) => ({ label: `${protocolShort(p.number)} · ${p.title}`, value: p.views }))} />
        </ChartCard>
      </div>

      <p className="mt-6 text-center text-xs font-semibold text-ink-400">
        Todos los datos de esta pantalla son DEMO y no representan información real.
      </p>
    </div>
  );
}
