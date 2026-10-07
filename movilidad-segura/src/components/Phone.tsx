import { useEffect, useState, type ReactNode } from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { STAGE_CLOCK, useStore } from '../state/store';

export const PHONE_W = 390;
export const PHONE_H = 844;

/** Escala para que el teléfono entre completo en pantallas de escritorio bajas. */
export function useFitScale(margin = 48) {
  const get = () => (typeof window === 'undefined' ? 1 : Math.min(1, (window.innerHeight - margin) / PHONE_H));
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const onResize = () => setScale(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return Math.max(0.6, scale);
}

interface PhoneProps {
  children: ReactNode;
  /** `responsive`: pantalla completa en móvil y marco en escritorio. `framed`: siempre con marco. */
  variant?: 'responsive' | 'framed';
  tone?: 'dark' | 'light';
  scale: number;
  label?: string;
}

export function Phone({ children, variant = 'responsive', tone = 'dark', scale, label }: PhoneProps) {
  const { state } = useStore();
  const framed = variant === 'framed';
  const box = framed ? '' : 'md:';

  return (
    <div className={framed ? 'flex flex-col items-center gap-3' : `contents ${box}flex ${box}flex-col ${box}items-center ${box}gap-3`}>
      {label && <span className={`${framed ? '' : 'hidden md:inline'} text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3`}>{label}</span>}
      <div className={framed ? 'relative shrink-0' : 'relative h-[100dvh] w-full md:h-auto md:w-auto md:shrink-0'} style={{ ['--s' as string]: scale }}>
        <div
          className={
            framed
              ? 'phone-scaled relative overflow-hidden rounded-[54px] bg-white shadow-phone [--hb:22px] [--sb:50px]'
              : 'relative h-full w-full overflow-hidden bg-white [--hb:env(safe-area-inset-bottom)] [--sb:env(safe-area-inset-top)] md:phone-scaled md:rounded-[54px] md:shadow-phone md:[--hb:22px] md:[--sb:50px]'
          }
        >
          {/* Barra de estado simulada */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-[90] ${framed ? 'flex' : 'hidden md:flex'} h-12 items-center justify-between px-8 pt-1 text-[14px] font-semibold tabular ${
              tone === 'light' ? 'text-white' : 'text-ink'
            }`}
          >
            <span className="w-14">{STAGE_CLOCK[state.stage]}</span>
            <span className="absolute left-1/2 top-2.5 h-[31px] w-[112px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1.5">
              <Signal size={15} strokeWidth={2.5} />
              <Wifi size={15} strokeWidth={2.5} />
              <BatteryFull size={21} strokeWidth={2} />
            </span>
          </div>
          {children}
          <span
            className={`pointer-events-none absolute bottom-2 left-1/2 z-[90] ${framed ? 'block' : 'hidden md:block'} h-[5px] w-[134px] -translate-x-1/2 rounded-full ${tone === 'light' ? 'bg-white/70' : 'bg-navy/80'}`}
          />
        </div>
      </div>
    </div>
  );
}
