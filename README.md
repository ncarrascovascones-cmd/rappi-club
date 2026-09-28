# Rappi Club · Prototipo conceptual

> **Tu esfuerzo suma. Tus beneficios se quedan contigo.**

Prototipo móvil de un programa de fidelización para rappitenderos:
**control + reconocimiento + beneficios + permanencia**.

> ⚠️ Es un concepto independiente con fines de presentación. **No es una aplicación oficial de Rappi**
> ni está integrada con sus sistemas. Niveles, cifras, aliados y beneficios son ilustrativos.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

- En el **celular** (o con DevTools en modo 390×844) ocupa toda la pantalla.
- En **escritorio** se muestra dentro de un marco de teléfono junto a un panel que explica el concepto.

Otros comandos: `npm run build` (typecheck + build de producción), `npm run preview`, `npm run typecheck`.

## Pantallas

| Pantalla | Qué muestra |
| --- | --- |
| Bienvenida | Logo, slogan y botón “Entrar a Rappi Club” |
| Inicio | Nivel actual, beneficios destacados, zona preferida y Ruta a Casa |
| Beneficios | Catálogo por categoría, comparativa por nivel y red de aliados ficticios |
| Mi nivel | Tarjeta de nivel, progreso del mes, los 4 niveles, protección de nivel y simulador de demo |
| Mi zona | Mapa esquemático + lista; máximo 2 zonas (principal y alternativa) |
| Ruta a Casa | Mapa ilustrado (sin GPS), activar/desactivar |
| Mi perfil | Datos, estadísticas, Configuración, Ayuda y Términos |

**Tip para presentar:** en *Mi nivel → Simulador de demo* puedes mover los pedidos o saltar entre niveles para
mostrar el cálculo automático y la celebración “🎉 ¡Llegaste a ORO!”.

## Editar los datos

Todo es local, sin backend:

- `src/data/config.ts` → `ordersCompleted`, umbrales de cada nivel (`LEVELS`), objetivo del nivel más alto
  (`TOP_LEVEL_GOAL`) y máximo de zonas.
- `src/data/mock.ts` → usuario, zonas, beneficios, aliados y comparativa por nivel.

`src/lib/levels.ts` calcula a partir de `ordersCompleted` el nivel actual, el siguiente nivel, el progreso y los
pedidos restantes.

### Sobre los umbrales

Los umbrales de ejemplo son **Bronce 0 · Plata 250 · Oro 500 · Diamante 700+**, con un objetivo de 1,000
dentro de Diamante. Así, con `ordersCompleted = 850` el Inicio muestra **Diamante · 850 / 1,000 · 150 pedidos
para el siguiente objetivo**. Con la escala alternativa 0/300/600/900, 850 pedidos darían **Oro**. Puedes cambiar
cualquiera de estos valores en `config.ts`.

## Estructura

```
src/
  components/   UI reutilizable (Logo, BottomNav, Sheet, Toast, ProgressBar, mapas…)
  pages/        Una página por pantalla
  data/         Configuración y datos mock editables
  lib/          Lógica de niveles
  styles/       Tailwind + estilos base
```

Stack: React 18 · Vite · TypeScript · Tailwind CSS · Lucide React · fuentes locales (Manrope, Nunito).
