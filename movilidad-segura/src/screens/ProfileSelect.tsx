import type { ReactNode } from 'react';
import { ArrowRight, Bus, ShieldCheck, UsersRound } from 'lucide-react';
import { Logo } from '../components/ui';

export type Profile = 'parent' | 'driver';

export function ProfileSelect({ onPick }: { onPick: (p: Profile) => void }) {
  return (
    <div className="pt-sb pb-hb relative flex h-full flex-col overflow-hidden bg-navy text-white">
      {/* Fondo: trazo de ruta abstracto */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" stroke="#fff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="390" height="844" fill="url(#grid)" />
        <path d="M-10 520 H110 V340 H250 V180 H400" stroke="#60A5FA" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
        <circle cx="110" cy="520" r="7" fill="#22C55E" />
        <circle cx="250" cy="180" r="7" fill="#fff" />
        <circle cx="250" cy="180" r="44" stroke="#60A5FA" strokeDasharray="4 6" />
        <circle cx="110" cy="520" r="44" stroke="#22C55E" strokeDasharray="4 6" />
      </svg>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/30 blur-[100px]" />

      <div className="relative flex flex-1 flex-col px-6 pt-10">
        <div className="animate-fade-up">
          <Logo dark />
        </div>
        <h1 className="mt-auto animate-fade-up text-[34px] font-semibold leading-[1.1] tracking-tight" style={{ animationDelay: '80ms' }}>
          Sabe dónde está tu hijo en cada momento del recorrido.
        </h1>
        <p className="mt-4 animate-fade-up text-[15px] leading-relaxed text-white/70" style={{ animationDelay: '140ms' }}>
          GPS, geocercas y confirmaciones de abordaje, llegada y entrega para el transporte escolar.
        </p>

        <p className="mt-9 animate-fade-up text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50" style={{ animationDelay: '200ms' }}>
          Ingresar como
        </p>
        <div className="mt-3 space-y-3 pb-6">
          <ProfileCard
            delay={240}
            icon={<UsersRound size={22} />}
            title="Padre / Madre"
            desc="Sigue el viaje de tu hijo en tiempo real"
            onClick={() => onPick('parent')}
            primary
          />
          <ProfileCard
            delay={300}
            icon={<Bus size={22} />}
            title="Conductor / Tutora"
            desc="Gestiona la ruta y confirma cada abordaje"
            onClick={() => onPick('driver')}
          />
        </div>
        <p className="flex items-center justify-center gap-1.5 pb-3 text-[11.5px] text-white/40">
          <ShieldCheck size={13} /> MVP con datos simulados · Sin GPS real
        </p>
      </div>
    </div>
  );
}

function ProfileCard({
  icon,
  title,
  desc,
  onClick,
  primary = false,
  delay,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  primary?: boolean;
  delay: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`group flex w-full animate-fade-up items-center gap-4 rounded-3xl p-4 text-left transition active:scale-[0.99] ${
        primary ? 'bg-white text-navy hover:bg-brand-50' : 'border border-white/15 bg-white/[0.06] text-white hover:bg-white/10'
      }`}
    >
      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${primary ? 'bg-brand text-white' : 'bg-white/10 text-white'}`}>{icon}</span>
      <span className="flex-1">
        <span className="block text-[16px] font-semibold">{title}</span>
        <span className={`block text-[13px] ${primary ? 'text-ink-3' : 'text-white/60'}`}>{desc}</span>
      </span>
      <ArrowRight size={19} className="transition group-hover:translate-x-0.5" />
    </button>
  );
}
