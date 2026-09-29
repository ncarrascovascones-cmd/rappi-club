import { HandHeart } from 'lucide-react';
import { VOLUNTARY_RULE, VOLUNTARY_RULE_DETAIL } from '@/lib/labels';
import { cn } from '@/lib/utils';

/** Regla fundamental: el Copiloto participa de forma voluntaria y no es supervisor ni trabajador de Rappi. */
export function VoluntaryNotice({
  variant = 'nuevo',
  className,
}: {
  variant?: 'nuevo' | 'copiloto' | 'inline';
  className?: string;
}) {
  if (variant === 'inline') {
    return (
      <p className={cn('flex items-start gap-2 text-xs leading-snug text-mint-700', className)}>
        <HandHeart className="mt-px h-4 w-4 shrink-0" />
        <span>
          <b>{VOLUNTARY_RULE}</b> {VOLUNTARY_RULE_DETAIL}
        </span>
      </p>
    );
  }
  return (
    <div className={cn('flex gap-3 rounded-2xl bg-mint-50 p-4 ring-1 ring-inset ring-mint-100', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-mint-600 shadow-sm">
        <HandHeart className="h-5 w-5" />
      </span>
      <div className="text-sm leading-relaxed text-ink-700">
        {variant === 'nuevo' && (
          <p className="font-bold text-ink-900">Tu Copiloto es otro Rappitendero que voluntariamente decidió acompañarte.</p>
        )}
        <p className={cn(variant === 'nuevo' ? 'mt-1' : 'font-bold text-ink-900')}>
          {variant === 'nuevo' ? (
            <>
              <b>{VOLUNTARY_RULE}</b> {VOLUNTARY_RULE_DETAIL}
            </>
          ) : (
            VOLUNTARY_RULE
          )}
        </p>
        <p className="mt-0.5">
          {variant === 'nuevo'
            ? 'Comparte experiencia práctica: no es tu supervisor ni el soporte oficial. Las soluciones oficiales las valida Rappi.'
            : `${VOLUNTARY_RULE_DETAIL} No eres supervisor ni trabajador de Rappi: compartes tu experiencia práctica.`}
        </p>
      </div>
    </div>
  );
}
