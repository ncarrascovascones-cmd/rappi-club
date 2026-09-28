import { ArrowRight, Gem, Gift, House, MapPin } from 'lucide-react';
import { Logo } from '../components/Logo';

const pillars = [
  { icon: Gem, label: 'Tu nivel' },
  { icon: Gift, label: 'Beneficios' },
  { icon: MapPin, label: 'Tu zona' },
  { icon: House, label: 'Ruta a Casa' },
];

export function WelcomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-brand-gradient px-7 pb-10 pt-16 text-white md:pt-20">
      {/* Formas decorativas */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 animate-float rounded-full bg-white/10 blur-sm" />
      <div
        className="pointer-events-none absolute -left-20 bottom-40 h-56 w-56 animate-float rounded-full bg-[#FFB199]/25"
        style={{ animationDelay: '1.2s' }}
      />

      <div className="relative flex flex-1 flex-col justify-center">
        <div className="animate-scale-in">
          <Logo variant="white" size="lg" />
        </div>

        <h1
          className="mt-8 animate-fade-up text-[34px] font-extrabold leading-[1.12] tracking-tight"
          style={{ animationDelay: '150ms' }}
        >
          Tu esfuerzo suma.
          <br />
          <span className="text-white/75">Tus beneficios se quedan contigo.</span>
        </h1>

        <div className="mt-10 grid grid-cols-2 gap-2.5 animate-fade-up" style={{ animationDelay: '300ms' }}>
          {pillars.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-3 backdrop-blur-sm ring-1 ring-white/15">
              <Icon size={18} />
              <span className="text-[14px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative animate-fade-up" style={{ animationDelay: '450ms' }}>
        <button
          onClick={onEnter}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-[16px] font-extrabold text-brand-600 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] transition active:scale-[0.97]"
        >
          Entrar a Rappi Club
          <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
        </button>
        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-white/70">
          Prototipo conceptual. No es una aplicación oficial de Rappi.
        </p>
      </div>
    </div>
  );
}
