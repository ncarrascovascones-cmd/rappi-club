interface LogoProps {
  /** "color" sobre fondos claros, "white" sobre fondos naranjas u oscuros. */
  variant?: 'color' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { word: 'text-[22px]', badge: 'text-[9px] px-1.5 py-[3px]', gap: 'gap-1.5' },
  md: { word: 'text-[30px]', badge: 'text-[11px] px-2 py-1', gap: 'gap-2' },
  lg: { word: 'text-[52px]', badge: 'text-[15px] px-3 py-1.5', gap: 'gap-2.5' },
};

/**
 * Logo conceptual de Rappi Club. Wordmark redondeado inspirado en la
 * estética de la marca (no es el activo oficial) + insignia "CLUB".
 */
export function Logo({ variant = 'color', size = 'md' }: LogoProps) {
  const s = sizes[size];
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center ${s.gap}`} aria-label="Rappi Club">
      <span
        className={`font-display font-black lowercase leading-none tracking-[-0.04em] ${s.word} ${
          isWhite ? 'text-white' : 'bg-brand-gradient bg-clip-text text-transparent'
        }`}
      >
        rappi
      </span>
      <span
        className={`relative inline-flex items-center overflow-hidden rounded-md font-extrabold uppercase leading-none tracking-[0.18em] ${s.badge} ${
          isWhite ? 'bg-white text-brand-600' : 'bg-ink text-white'
        }`}
      >
        <span className="relative z-10">Club</span>
        <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer" />
      </span>
    </div>
  );
}
