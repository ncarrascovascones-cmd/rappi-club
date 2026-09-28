import { zones } from '../data/mock';

/** Posición de cada zona en el mapa conceptual (viewBox 300x200). */
const layout: Record<number, { x: number; y: number; w: number; h: number }> = {
  2: { x: 60, y: 6, w: 180, h: 52 },
  5: { x: 6, y: 66, w: 96, h: 68 },
  1: { x: 110, y: 66, w: 80, h: 68 },
  3: { x: 198, y: 66, w: 96, h: 68 },
  4: { x: 60, y: 142, w: 180, h: 52 },
};

interface ZoneMapProps {
  selected: number[];
  onToggle: (id: number) => void;
}

/** Mapa esquemático de zonas: toca una zona para elegirla. */
export function ZoneMap({ selected, onToggle }: ZoneMapProps) {
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="group" aria-label="Mapa conceptual de zonas">
      {zones.map((zone) => {
        const box = layout[zone.id];
        const role = selected.indexOf(zone.id);
        const isPrimary = role === 0;
        const isAlt = role === 1;
        const fill = isPrimary ? '#FF5A2C' : isAlt ? '#FFE5DC' : '#F1EFEC';
        const stroke = isPrimary ? '#F03D16' : isAlt ? '#FF9E80' : '#E4E1DC';
        const text = isPrimary ? '#FFFFFF' : isAlt ? '#C92D0C' : '#686875';

        return (
          <g
            key={zone.id}
            role="button"
            tabIndex={0}
            aria-pressed={role >= 0}
            aria-label={`Zona ${zone.id} ${zone.name}`}
            onClick={() => onToggle(zone.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(zone.id)}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-ink"
          >
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx="16"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            <text x={box.x + box.w / 2} y={box.y + box.h / 2 - 2} textAnchor="middle" fontSize="15" fontWeight="800" fill={text}>
              {zone.id}
            </text>
            <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill={text}>
              {zone.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
