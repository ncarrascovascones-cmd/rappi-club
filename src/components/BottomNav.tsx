import { Gem, Gift, House, MapPin, type LucideIcon } from 'lucide-react';

export type TabId = 'home' | 'benefits' | 'level' | 'zone';

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Inicio', icon: House },
  { id: 'benefits', label: 'Beneficios', icon: Gift },
  { id: 'level', label: 'Mi nivel', icon: Gem },
  { id: 'zone', label: 'Mi zona', icon: MapPin },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 backdrop-blur-xl md:pb-6"
      aria-label="Navegación principal"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                className="group flex w-full flex-col items-center gap-1 py-1"
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`grid h-8 w-14 place-items-center rounded-full transition-all duration-300 ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-400 group-hover:text-ink-700'
                  }`}
                >
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                </span>
                <span
                  className={`text-[11px] font-semibold transition-colors ${isActive ? 'text-brand-600' : 'text-ink-400'}`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
