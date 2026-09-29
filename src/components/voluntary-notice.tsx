import { HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Comunica la regla fundamental: el Copiloto participa de forma voluntaria. */
export function VoluntaryNotice({
  variant = 'nuevo',
  className,
}: {
  variant?: 'nuevo' | 'copiloto';
  className?: string;
}) {
  return (
    <div className={cn('flex gap-3 rounded-2xl bg-mint-50 p-4 ring-1 ring-inset ring-mint-100', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-mint-600 shadow-sm">
        <HandHeart className="h-5 w-5" />
      </span>
      <div className="text-sm leading-relaxed text-ink-700">
        {variant === 'nuevo' ? (
          <>
            <p className="font-bold text-ink-900">Tu Copiloto es otro Rappitendero que voluntariamente decidió acompañarte.</p>
            <p className="mt-0.5">
              Comparte su experiencia práctica. No es tu supervisor ni el soporte oficial: las soluciones oficiales las
              valida Rappi.
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-ink-900">Ser Copiloto es 100% voluntario.</p>
            <p className="mt-0.5">
              Puedes aceptar, rechazar, pausar o retirarte cuando quieras, sin ninguna penalización. Compartes experiencia,
              no reemplazas al soporte oficial.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
