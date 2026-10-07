import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

/* ---------------------------- Marca ---------------------------- */

export function LogoMark({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill={dark ? '#FFFFFF' : '#0B1F3A'} />
      <path d="M16 5.5l8.5 3.2v6.1c0 5.4-3.6 9.3-8.5 10.9-4.9-1.6-8.5-5.5-8.5-10.9V8.7z" fill="#2563EB" />
      <path d="M12.3 15.6l2.6 2.6 4.8-5.2" stroke="#FFFFFF" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={compact ? 28 : 34} dark={dark} />
      <span className={`font-semibold tracking-tight ${compact ? 'text-[15px]' : 'text-[17px]'} ${dark ? 'text-white' : 'text-ink'}`}>
        Movilidad <span className={dark ? 'text-brand-200' : 'text-brand'}>Segura</span>
      </span>
    </span>
  );
}

/* ---------------------------- Avatar ---------------------------- */

const avatarTones = {
  navy: 'bg-gradient-to-br from-navy-700 to-navy text-white',
  blue: 'bg-brand-50 text-brand-700',
  slate: 'bg-surface text-ink-2',
  green: 'bg-ok-50 text-ok-700',
} as const;

export function Avatar({ initials, size = 44, tone = 'navy' }: { initials: string; size?: number; tone?: keyof typeof avatarTones }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${avatarTones[tone]}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </span>
  );
}

/* ---------------------------- Píldoras de estado ---------------------------- */

const pillTones = {
  blue: 'bg-brand-50 text-brand-700',
  green: 'bg-ok-50 text-ok-700',
  gray: 'bg-surface text-ink-2',
  amber: 'bg-warn-50 text-warn',
  red: 'bg-danger-50 text-danger',
  dark: 'bg-white/10 text-white',
} as const;

export function Pill({ tone = 'blue', live = false, children }: { tone?: keyof typeof pillTones; live?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${pillTones[tone]}`}>
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

/* ---------------------------- Check animado ---------------------------- */

export function SuccessCheck({ size = 88 }: { size?: number }) {
  return (
    <span className="relative grid animate-scale-in place-items-center" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full bg-ok/15" />
      <span className="absolute inset-[12%] rounded-full bg-ok/20" />
      <span
        className="relative grid place-items-center rounded-full bg-ok shadow-[0_10px_30px_-8px_rgba(22,163,74,0.7)]"
        style={{ width: size * 0.62, height: size * 0.62 }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size * 0.32}
          height={size * 0.32}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="48" className="animate-draw-check" />
        </svg>
      </span>
    </span>
  );
}

/* ---------------------------- Bottom sheet ---------------------------- */

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-[60] flex flex-col justify-end">
      <button aria-label="Cerrar" className="absolute inset-0 animate-fade-in bg-navy/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative max-h-[90%] animate-sheet-up overflow-y-auto rounded-t-[28px] bg-white px-5 pb-[max(env(safe-area-inset-bottom),24px)] pt-3 no-scrollbar">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold tracking-tight">{title}</h3>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-2" aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ---------------------------- Filas de detalle ---------------------------- */

export function DetailRow({ icon, label, value, last = false }: { icon: ReactNode; label: string; value: ReactNode; last?: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-3 ${last ? '' : 'border-b border-line'}`}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-ink-2">{icon}</span>
      <span className="flex-1 text-[13px] text-ink-3">{label}</span>
      <span className="text-right text-[14px] font-semibold text-ink">{value}</span>
    </div>
  );
}

/* ---------------------------- Cabecera de pantalla ---------------------------- */

export function ScreenTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between px-5 pb-4 pt-2">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[14px] text-ink-3">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
