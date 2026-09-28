import { ArrowDown, CalendarCheck, Check, RotateCcw, ShieldCheck, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { LevelEmblem } from '../components/LevelEmblem';
import { LevelHeroCard } from '../components/LevelHeroCard';
import { levelTheme } from '../components/levelTheme';
import { PageHeader } from '../components/PageHeader';
import { ConceptTag, Disclaimer, Section } from '../components/Section';
import { LEVELS, ordersCompleted, previousPeriodOrders } from '../data/config';
import { user } from '../data/mock';
import { formatNumber, getLevelRange, type LevelStatus } from '../lib/levels';

interface LevelPageProps {
  status: LevelStatus;
  orders: number;
  onChangeOrders: (orders: number) => void;
}

export function LevelPage({ status, orders, onChangeOrders }: LevelPageProps) {
  const diff = orders - previousPeriodOrders;
  const protectionPath = LEVELS.slice(0, status.index + 1).reverse().slice(0, 3);

  return (
    <div className="space-y-7">
      <PageHeader title="Mi nivel" />

      <div className="-mt-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <LevelHeroCard
          status={status}
          orders={orders}
          eyebrow={`${status.level.emoji} Tu nivel`}
          message={
            status.isTopLevel ? 'Tu constancia te llevó hasta aquí.' : `Ya eres ${status.level.name}. Tu constancia suma.`
          }
        />
      </div>

      {/* Gamificación sana: constancia, no horas extra */}
      <Section title="Tu progreso este mes" delay={120}>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="card p-4">
            <p className="text-[12px] font-semibold text-ink-400">Pedidos</p>
            <p className="mt-1 text-[26px] font-extrabold leading-none tracking-tight">{formatNumber(orders)}</p>
            <p
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-bold ${
                diff >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-ink-100 text-ink-500'
              }`}
            >
              <TrendingUp size={12} />
              {diff >= 0 ? '+' : ''}
              {formatNumber(diff)} vs. periodo anterior
            </p>
          </div>
          <div className="card p-4">
            <p className="text-[12px] font-semibold text-ink-400">Constancia</p>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-white"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Check size={14} strokeWidth={3} />
                </span>
              ))}
            </div>
            <p className="mt-2 text-[12px] font-semibold leading-snug text-ink-700">
              Has mantenido tu nivel durante {user.monthsAtCurrentLevel} meses.
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3">
          <CalendarCheck size={18} className="shrink-0 text-brand-600" />
          <p className="text-[13px] font-semibold text-brand-800">Tu constancia está creciendo.</p>
        </div>
      </Section>

      {/* Niveles */}
      <Section title="Los niveles" subtitle="Todos los niveles tienen beneficios." delay={180}>
        <div className="relative space-y-2.5">
          {LEVELS.map((level, i) => {
            const isCurrent = i === status.index;
            const reached = i <= status.index;
            return (
              <div
                key={level.id}
                className={`card relative overflow-hidden p-4 transition ${
                  isCurrent ? `ring-2 ${levelTheme[level.id].ring}` : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <LevelEmblem level={level} size="md" muted={!reached} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[16px] font-extrabold uppercase tracking-wide">{level.name}</p>
                      {isCurrent && (
                        <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">Tu nivel</span>
                      )}
                    </div>
                    <p className={`text-[13px] font-bold ${levelTheme[level.id].text}`}>{level.tagline}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{level.description}</p>
                    <p className="mt-2 text-[11.5px] font-semibold text-ink-400">{getLevelRange(level)}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {level.highlights.map((h) => (
                        <span
                          key={h}
                          className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${levelTheme[level.id].soft} ${levelTheme[level.id].text}`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-center">
          <ConceptTag />
        </div>
        <p className="mt-4 text-center text-[16px] font-extrabold tracking-tight">Tu nivel refleja tu constancia.</p>
      </Section>

      {/* Protección de nivel */}
      <Section title="Protección de nivel" delay={240}>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={22} />
            </div>
            <p className="text-[16px] font-extrabold leading-snug">Tu progreso no desaparece de inmediato.</p>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">
            Si reduces temporalmente tu actividad, puedes conservar tu nivel durante un período de protección. Si la
            inactividad continúa, el descenso será progresivo.
          </p>

          <div className="mt-5 flex flex-col items-center">
            {protectionPath.map((level, i) => (
              <div key={level.id} className="flex w-full flex-col items-center">
                <div
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 ${
                    i === 0 ? 'bg-surface ring-1 ring-ink-100' : ''
                  }`}
                  style={{ opacity: 1 - i * 0.22 }}
                >
                  <LevelEmblem level={level} size="sm" />
                  <p className="flex-1 text-[14px] font-extrabold uppercase tracking-wide">{level.name}</p>
                  <span className="whitespace-nowrap text-[11.5px] font-semibold text-ink-500">
                    {i === 0 ? 'Protección' : 'Descenso gradual'}
                  </span>
                </div>
                {i < protectionPath.length - 1 && (
                  <div className="flex h-8 items-center gap-2 text-ink-300">
                    <ArrowDown size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {protectionPath.length === 1 && (
            <p className="mt-2 text-center text-[12.5px] text-ink-500">En Bronce siempre conservas tus beneficios esenciales.</p>
          )}
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-[12.5px] font-semibold text-emerald-700">
            Un nivel a la vez. Respetamos tus tiempos.
          </p>
        </div>
      </Section>

      {/* Simulador para presentaciones */}
      <Section title="Simulador de demo" subtitle="Solo para la presentación del prototipo." delay={300}>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] font-bold text-ink-700">
              <SlidersHorizontal size={16} /> Pedidos del periodo
            </span>
            <span className="rounded-full bg-ink px-2.5 py-1 text-[12px] font-bold text-white">{formatNumber(orders)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1100}
            step={10}
            value={orders}
            onChange={(e) => onChangeOrders(Number(e.target.value))}
            className="mt-4 w-full accent-brand-500"
            aria-label="Pedidos del periodo (demo)"
          />
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onChangeOrders(level.minOrders + 20)}
                className="rounded-xl bg-surface py-2 text-[12px] font-bold text-ink-700 transition hover:bg-ink-100 active:scale-95"
              >
                {level.emoji} {level.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => onChangeOrders(ordersCompleted)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-[12.5px] font-semibold text-ink-500"
          >
            <RotateCcw size={13} /> Restablecer ({formatNumber(ordersCompleted)})
          </button>
        </div>
      </Section>

      <Disclaimer>Los valores de nivel son conceptuales y no representan datos oficiales de Rappi.</Disclaimer>
    </div>
  );
}
