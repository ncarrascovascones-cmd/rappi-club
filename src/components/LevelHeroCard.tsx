import type { ReactNode } from 'react';
import { formatNumber, type LevelStatus } from '../lib/levels';
import { levelTheme } from './levelTheme';
import { LevelEmblem } from './LevelEmblem';
import { ProgressBar } from './ProgressBar';

interface LevelHeroCardProps {
  status: LevelStatus;
  orders: number;
  eyebrow: string;
  message?: string;
  footer?: ReactNode;
  onClick?: () => void;
}

/** Tarjeta premium (estilo tarjeta de crédito) con el nivel actual. */
export function LevelHeroCard({ status, orders, eyebrow, message, footer, onClick }: LevelHeroCardProps) {
  const { level, next, remaining, target, progress, isTopLevel } = status;
  const Wrapper = onClick ? 'button' : 'div';

  const remainingText =
    remaining === 0
      ? '¡Alcanzaste tu objetivo! 🎉'
      : isTopLevel
        ? `${formatNumber(remaining)} pedidos para alcanzar el siguiente objetivo`
        : `${formatNumber(remaining)} pedidos para llegar a ${next?.name}`;

  return (
    <Wrapper
      onClick={onClick}
      className="relative block w-full overflow-hidden rounded-[28px] bg-ink-gradient p-5 text-left text-white shadow-[0_24px_48px_-24px_rgba(22,22,29,0.65)] transition active:scale-[0.99]"
    >
      {/* Brillos */}
      <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-500/35 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-[#7C8CFF]/20 blur-3xl" />
      <span className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-white/55">{eyebrow}</p>
            <p
              className={`mt-2 bg-gradient-to-r bg-clip-text text-[34px] font-black leading-none tracking-tight text-transparent ${
                levelTheme[level.id].gradient
              }`}
            >
              {level.name.toUpperCase()}
            </p>
            {message && <p className="mt-2 text-[14px] text-white/75">{message}</p>}
          </div>
          <div className="animate-float">
            <LevelEmblem level={level} size="md" />
          </div>
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <p className="text-[26px] font-extrabold tracking-tight">
            {formatNumber(orders)}
            <span className="text-[16px] font-semibold text-white/45"> / {formatNumber(target)}</span>
          </p>
          <p className="text-[12px] font-semibold text-white/55">pedidos · demo</p>
        </div>

        <div className="mt-2.5">
          <ProgressBar
            value={progress}
            fill={`bg-gradient-to-r ${levelTheme[level.id].bar}`}
            track="bg-white/10"
            label="Progreso de nivel"
          />
        </div>

        <p className="mt-3 text-[13px] font-medium text-white/80">{remainingText}</p>
        {footer && <div className="mt-4 border-t border-white/10 pt-3.5">{footer}</div>}
      </div>
    </Wrapper>
  );
}
