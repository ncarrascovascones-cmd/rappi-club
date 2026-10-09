import {
  BadgeHelp,
  CircleHelp,
  MapPinned,
  PackageX,
  PhoneOff,
  Store,
  type LucideIcon,
} from 'lucide-react';
import type { HelpCategory } from '@/lib/types';
import { categoryTone } from '@/lib/labels';
import { cn } from '@/lib/utils';

export const CATEGORY_ICON: Record<HelpCategory, LucideIcon> = {
  cliente_no_responde: PhoneOff,
  problema_pedido: PackageX,
  problema_incentivo: BadgeHelp,
  demasiado_lejos: MapPinned,
  problema_tienda: Store,
  otro: CircleHelp,
};

const toneBg = {
  brand: 'bg-brand-50 text-brand-600',
  sky: 'bg-sky-50 text-sky-600',
  sun: 'bg-sun-50 text-sun-700',
  grape: 'bg-grape-50 text-grape-600',
  mint: 'bg-mint-50 text-mint-600',
  ink: 'bg-ink-100 text-ink-600',
};

export function CategoryIcon({
  category,
  className,
  size = 'md',
}: {
  category: HelpCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        toneBg[categoryTone(category)],
        size === 'sm' && 'h-8 w-8 rounded-xl',
        size === 'md' && 'h-11 w-11 rounded-2xl',
        size === 'lg' && 'h-14 w-14 rounded-2xl',
        className,
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6')} />
    </span>
  );
}
