import type { ReactNode } from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { PresentationPanel } from './PresentationPanel';

interface PhoneFrameProps {
  children: ReactNode;
  /** Color del texto de la barra de estado simulada (solo escritorio). */
  statusBar?: 'dark' | 'light';
}

/**
 * En móvil ocupa toda la pantalla. En escritorio muestra un dispositivo
 * de 390x844 junto a un panel de presentación del concepto.
 */
export function PhoneFrame({ children, statusBar = 'dark' }: PhoneFrameProps) {
  const statusColor = statusBar === 'light' ? 'text-white' : 'text-ink';

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[radial-gradient(ellipse_at_top_left,#FFE9E0_0%,#ECEAE6_45%,#E4E2DE_100%)] md:gap-16 md:p-8">
      <PresentationPanel />

      <div className="relative h-[100dvh] w-full overflow-hidden bg-surface md:h-[844px] md:w-[390px] md:shrink-0 md:rounded-[52px] md:shadow-phone">
        {/* Barra de estado simulada (solo escritorio) */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-[80] hidden h-11 items-center justify-between px-8 pt-1 text-[14px] font-semibold md:flex ${statusColor}`}
        >
          <span>9:41</span>
          <span className="absolute left-1/2 top-2.5 h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1.5">
            <Signal size={15} strokeWidth={2.5} />
            <Wifi size={15} strokeWidth={2.5} />
            <BatteryFull size={20} strokeWidth={2} />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
