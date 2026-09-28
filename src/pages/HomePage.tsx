import { ArrowRight, Bell, ChevronRight, House, MapPin, Sparkles } from 'lucide-react';
import { BenefitTile } from '../components/Benefit';
import { LevelHeroCard } from '../components/LevelHeroCard';
import { Logo } from '../components/Logo';
import { Disclaimer, Section } from '../components/Section';
import type { TabId } from '../components/BottomNav';
import { benefits, featuredBenefitIds, user, zoneLabel, type Benefit } from '../data/mock';
import type { LevelStatus } from '../lib/levels';
import { useToast } from '../components/Toast';

interface HomePageProps {
  status: LevelStatus;
  orders: number;
  preferredZones: number[];
  routeActive: boolean;
  onNavigate: (tab: TabId) => void;
  onOpenProfile: () => void;
  onOpenRoute: () => void;
  onOpenBenefit: (b: Benefit) => void;
}

export function HomePage({
  status,
  orders,
  preferredZones,
  routeActive,
  onNavigate,
  onOpenProfile,
  onOpenRoute,
  onOpenBenefit,
}: HomePageProps) {
  const toast = useToast();
  const featured = featuredBenefitIds
    .map((id) => benefits.find((b) => b.id === id))
    .filter((b): b is Benefit => Boolean(b));
  const [primaryZone, altZone] = preferredZones;

  return (
    <div className="space-y-7">
      {/* Encabezado */}
      <header className="animate-fade-up">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast('🔔 No tienes notificaciones nuevas')}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink-700 shadow-card transition active:scale-95"
              aria-label="Notificaciones"
            >
              <Bell size={18} />
            </button>
            <button
              onClick={onOpenProfile}
              className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-[13px] font-extrabold text-white shadow-glow transition active:scale-95"
              aria-label="Mi perfil"
            >
              {user.initials}
            </button>
          </div>
        </div>

        <h1 className="mt-6 text-[28px] font-extrabold leading-tight tracking-tight">Hola, {user.firstName} 👋</h1>
        <p className="mt-0.5 text-[15px] text-ink-500">Bienvenido a Rappi Club</p>
      </header>

      {/* Nivel */}
      <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
        <LevelHeroCard
          status={status}
          orders={orders}
          eyebrow="Tu nivel actual"
          onClick={() => onNavigate('level')}
          footer={
            <p className="flex items-center justify-between text-[12.5px] font-medium text-white/70">
              <span>
                Tu esfuerzo suma. <span className="text-white">Tus beneficios se quedan contigo.</span>
              </span>
              <ChevronRight size={16} className="shrink-0" />
            </p>
          }
        />
      </div>

      {/* Beneficios */}
      <Section
        title="Tus beneficios"
        subtitle="Tus beneficios están aquí."
        delay={160}
        action={
          <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">
            <Sparkles size={12} /> {status.level.name}
          </span>
        }
      >
        <div className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
          {featured.map((b) => (
            <BenefitTile key={b.id} benefit={b} onOpen={onOpenBenefit} />
          ))}
        </div>
        <button className="btn-secondary mt-3 w-full" onClick={() => onNavigate('benefits')}>
          Ver todos los beneficios <ArrowRight size={16} />
        </button>
      </Section>

      {/* Zona */}
      <Section title="Tu zona" delay={240}>
        <div className="card p-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <MapPin size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-ink-400">Zona preferida</p>
              <p className="truncate text-[16px] font-extrabold">
                {primaryZone ? zoneLabel(primaryZone) : 'Sin zona elegida'}
              </p>
              {altZone && <p className="truncate text-[12.5px] text-ink-500">Alternativa: {zoneLabel(altZone)}</p>}
            </div>
          </div>
          <div className="mt-3.5 flex items-start gap-2 rounded-2xl bg-surface px-3 py-2.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <p className="text-[12.5px] font-medium leading-snug text-ink-700">
              Priorización disponible cuando exista disponibilidad
            </p>
          </div>
          <button className="btn-ghost mt-3 w-full" onClick={() => onNavigate('zone')}>
            Gestionar mi zona
          </button>
        </div>
      </Section>

      {/* Ruta a Casa */}
      <Section title="¿Ya terminas tu jornada?" delay={320}>
        <div className="card overflow-hidden p-2">
          <button
            onClick={onOpenRoute}
            className="relative flex w-full items-center gap-4 overflow-hidden rounded-[20px] bg-brand-gradient px-5 py-5 text-left text-white shadow-glow transition active:scale-[0.98]"
          >
            <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 text-[24px]">🏠</span>
            <span className="flex-1">
              <span className="block text-[19px] font-extrabold tracking-tight">Ruta a Casa</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-white/85">
                {routeActive ? (
                  <>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Activa
                  </>
                ) : (
                  'Toca para ver cómo funciona'
                )}
              </span>
            </span>
            <House size={20} className="shrink-0 opacity-80" />
          </button>
          <p className="px-3 pb-2 pt-3 text-[12.5px] leading-relaxed text-ink-500">
            Activa esta opción para priorizar pedidos que te acerquen progresivamente hacia tu zona de residencia, cuando
            la operación lo permita.
          </p>
        </div>
      </Section>

      <Disclaimer>Prototipo conceptual · Datos de demostración</Disclaimer>
    </div>
  );
}
