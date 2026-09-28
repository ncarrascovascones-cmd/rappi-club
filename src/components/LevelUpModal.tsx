import type { CSSProperties } from 'react';
import type { LevelConfig } from '../data/config';
import { LevelEmblem } from './LevelEmblem';

const confettiColors = ['#FF5A2C', '#FFC6B3', '#F5C030', '#7C8CFF', '#34D399', '#FF7752'];

interface LevelUpModalProps {
  level: LevelConfig | null;
  onClose: () => void;
  onSeeBenefits: () => void;
}

/** Celebración al subir de nivel. */
export function LevelUpModal({ level, onClose, onSeeBenefits }: LevelUpModalProps) {
  if (!level) return null;

  return (
    <div className="absolute inset-0 z-[65] grid place-items-center px-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 animate-fade-in bg-ink/60 backdrop-blur-sm" aria-label="Cerrar" onClick={onClose} />

      <div className="relative w-full animate-scale-in overflow-hidden rounded-[32px] bg-white px-6 pb-6 pt-9 text-center">
        <div className="pointer-events-none absolute left-1/2 top-16 z-10" aria-hidden>
          {Array.from({ length: 22 }).map((_, i) => {
            const angle = (i / 22) * Math.PI * 2;
            const dist = 90 + (i % 4) * 22;
            return (
              <span
                key={i}
                className="absolute h-2 w-1.5 animate-confetti rounded-sm"
                style={
                  {
                    background: confettiColors[i % confettiColors.length],
                    '--dx': `${Math.cos(angle) * dist}px`,
                    '--dy': `${Math.sin(angle) * dist + 40}px`,
                    animationDelay: `${(i % 5) * 40}ms`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>

        <div className="mx-auto w-fit animate-float">
          <LevelEmblem level={level} size="lg" />
        </div>
        <p className="mt-5 text-[26px] font-extrabold tracking-tight">🎉 ¡Llegaste a {level.name.toUpperCase()}!</p>
        <p className="mx-auto mt-2 max-w-[260px] text-[14.5px] leading-relaxed text-ink-500">
          Tu constancia te trajo hasta aquí. Ya tienes {level.tagline.toLowerCase()}.
        </p>

        <button className="btn-primary mt-6 w-full" onClick={onSeeBenefits}>
          Ver mis beneficios
        </button>
        <button className="mt-2 w-full py-2 text-[14px] font-semibold text-ink-500" onClick={onClose}>
          Seguir explorando
        </button>
      </div>
    </div>
  );
}
