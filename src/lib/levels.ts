import { LEVELS, TOP_LEVEL_GOAL, type LevelConfig, type LevelId } from '../data/config';

export interface LevelStatus {
  level: LevelConfig;
  index: number;
  next: LevelConfig | null;
  isTopLevel: boolean;
  /** Pedidos objetivo que se muestran como "850 / 1,000". */
  target: number;
  remaining: number;
  /** 0–100 */
  progress: number;
}

export function getLevelIndex(orders: number): number {
  let index = 0;
  LEVELS.forEach((level, i) => {
    if (orders >= level.minOrders) index = i;
  });
  return index;
}

export function getLevelStatus(orders: number): LevelStatus {
  const index = getLevelIndex(orders);
  const level = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const isTopLevel = next === null;
  const target = next ? next.minOrders : Math.max(TOP_LEVEL_GOAL, orders);
  const remaining = Math.max(target - orders, 0);
  const progress = target === 0 ? 100 : Math.min((orders / target) * 100, 100);

  return { level, index, next, isTopLevel, target, remaining, progress };
}

export function getLevel(id: LevelId): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

export function isLevelAtLeast(current: LevelId, required: LevelId): boolean {
  const idx = (id: LevelId) => LEVELS.findIndex((l) => l.id === id);
  return idx(current) >= idx(required);
}

/** Rango legible del nivel, p. ej. "250–499 pedidos" o "700+ pedidos". */
export function getLevelRange(level: LevelConfig): string {
  const i = LEVELS.indexOf(level);
  const next = LEVELS[i + 1];
  return next
    ? `${formatNumber(level.minOrders)}–${formatNumber(next.minOrders - 1)} pedidos`
    : `${formatNumber(level.minOrders)}+ pedidos`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}
