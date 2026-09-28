import type { LevelConfig } from '../data/config';
import { levelTheme } from './levelTheme';

interface LevelEmblemProps {
  level: LevelConfig;
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
}

const sizes = {
  sm: 'h-10 w-10 text-[20px] rounded-xl',
  md: 'h-14 w-14 text-[28px] rounded-2xl',
  lg: 'h-20 w-20 text-[40px] rounded-[26px]',
};

/** Insignia con el emoji del nivel sobre un gradiente metálico. */
export function LevelEmblem({ level, size = 'md', muted = false }: LevelEmblemProps) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${
        levelTheme[level.id].gradient
      } ${sizes[size]} ${muted ? 'opacity-50 grayscale' : ''}`}
      aria-hidden
    >
      <span className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-transparent" />
      <span className="relative drop-shadow-[0_2px_2px_rgba(0,0,0,0.18)]">{level.emoji}</span>
    </div>
  );
}
