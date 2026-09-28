import {
  Backpack,
  ChevronRight,
  Droplets,
  Film,
  Fuel,
  GraduationCap,
  Lock,
  Pill,
  Popcorn,
  ShieldCheck,
  ShoppingBasket,
  Stethoscope,
  Store,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { LevelId } from '../data/config';
import { getPartner, type Benefit, type BenefitIcon, type CategoryId } from '../data/mock';
import { getLevel, isLevelAtLeast } from '../lib/levels';
import { ConceptTag } from './Section';
import { Sheet } from './Sheet';
import { useToast } from './Toast';

const icons: Record<BenefitIcon, LucideIcon> = {
  wrench: Wrench,
  droplets: Droplets,
  fuel: Fuel,
  shield: ShieldCheck,
  stethoscope: Stethoscope,
  users: Users,
  pill: Pill,
  basket: ShoppingBasket,
  store: Store,
  backpack: Backpack,
  graduation: GraduationCap,
  film: Film,
  popcorn: Popcorn,
};

export const categoryTone: Record<CategoryId, string> = {
  movilidad: 'bg-brand-50 text-brand-600',
  salud: 'bg-rose-50 text-rose-500',
  hogar: 'bg-emerald-50 text-emerald-600',
  familia: 'bg-sky-50 text-sky-600',
  entretenimiento: 'bg-violet-50 text-violet-600',
};

export function availabilityLabel(minLevel: LevelId): string {
  if (minLevel === 'bronce') return 'Disponible para todos los niveles';
  if (minLevel === 'diamante') return 'Exclusivo nivel Diamante';
  return `Disponible desde ${getLevel(minLevel).name}`;
}

export function BenefitIconView({ benefit, size = 'md' }: { benefit: Benefit; size?: 'md' | 'lg' }) {
  const Icon = icons[benefit.icon];
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl';
  return (
    <div className={`grid shrink-0 place-items-center ${box} ${categoryTone[benefit.category]}`}>
      <Icon size={size === 'lg' ? 26 : 21} />
    </div>
  );
}

interface BenefitCardProps {
  benefit: Benefit;
  userLevel: LevelId;
  onOpen: (b: Benefit) => void;
}

/** Tarjeta de lista para el marketplace de beneficios. */
export function BenefitCard({ benefit, userLevel, onOpen }: BenefitCardProps) {
  const unlocked = isLevelAtLeast(userLevel, benefit.minLevel);
  const partner = getPartner(benefit.partnerId);

  return (
    <button
      onClick={() => onOpen(benefit)}
      className="card flex w-full items-center gap-3.5 p-3.5 text-left transition hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <BenefitIconView benefit={benefit} />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-snug">{benefit.title}</p>
        <p className="mt-0.5 text-[12.5px] font-medium text-ink-400">{partner?.name}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-700">
            {availabilityLabel(benefit.minLevel)}
          </span>
          {benefit.conceptual && <ConceptTag />}
        </div>
      </div>
      {unlocked ? (
        <ChevronRight size={18} className="shrink-0 text-ink-300" />
      ) : (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-400">
          <Lock size={14} />
        </span>
      )}
    </button>
  );
}

/** Tarjeta compacta para el carrusel del Inicio. */
export function BenefitTile({ benefit, onOpen }: { benefit: Benefit; onOpen: (b: Benefit) => void }) {
  return (
    <button
      onClick={() => onOpen(benefit)}
      className="card flex w-[152px] shrink-0 snap-start flex-col justify-between gap-4 p-4 text-left transition hover:-translate-y-0.5 active:scale-[0.97]"
    >
      <BenefitIconView benefit={benefit} />
      <div>
        <p className="text-[14.5px] font-bold leading-snug text-balance">{benefit.shortTitle ?? benefit.title}</p>
        <p className="mt-1 text-[11.5px] font-medium text-ink-400">{getPartner(benefit.partnerId)?.name}</p>
      </div>
    </button>
  );
}

interface BenefitSheetProps {
  benefit: Benefit | null;
  userLevel: LevelId;
  onClose: () => void;
}

/** Detalle del beneficio en un bottom sheet. */
export function BenefitSheet({ benefit, userLevel, onClose }: BenefitSheetProps) {
  const toast = useToast();
  if (!benefit) return null;

  const unlocked = isLevelAtLeast(userLevel, benefit.minLevel);
  const partner = getPartner(benefit.partnerId);
  const required = getLevel(benefit.minLevel);

  return (
    <Sheet open onClose={onClose}>
      <div className="flex items-start gap-4">
        <BenefitIconView benefit={benefit} size="lg" />
        <div>
          <p className="text-[21px] font-extrabold leading-tight tracking-tight">{benefit.title}</p>
          <p className="mt-1 text-[13px] font-semibold text-ink-500">con {partner?.name}</p>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{benefit.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink-700">
          {required.emoji} {availabilityLabel(benefit.minLevel)}
        </span>
        {benefit.conceptual && <ConceptTag />}
      </div>

      {unlocked ? (
        <button
          className="btn-primary mt-6 w-full"
          onClick={() => {
            toast('🎁 Beneficio listo para usar');
            onClose();
          }}
        >
          Usar beneficio
        </button>
      ) : (
        <div className="mt-6 rounded-2xl bg-surface p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-[14px] font-bold">
            <Lock size={15} /> Se desbloquea en {required.name}
          </p>
          <p className="mt-1 text-[12.5px] text-ink-500">Tu nivel sube con tu constancia.</p>
        </div>
      )}

      <p className="mt-4 text-center text-[11.5px] text-ink-400">
        Beneficios sujetos a disponibilidad y condiciones de cada aliado.
      </p>
    </Sheet>
  );
}
