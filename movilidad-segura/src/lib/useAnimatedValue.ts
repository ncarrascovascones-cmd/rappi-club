import { useEffect, useRef, useState } from 'react';

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Anima un valor desde `from` hasta `to` en `duration` ms. Cuando cambia `animKey`
 * la animación se reinicia. `onDone` se llama una vez al llegar al final.
 */
export function useAnimatedValue(from: number, to: number, duration: number, animKey: string, onDone?: () => void) {
  const [value, setValue] = useState(from);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let raf = 0;
    let finished = false;
    const start = performance.now();
    const linear = from !== to && duration > 1500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Los tramos largos van a velocidad casi constante; los cortos con easing.
      const k = linear ? t * 0.85 + ease(t) * 0.15 : ease(t);
      setValue(from + (to - from) * k);
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (!finished) {
        finished = true;
        doneRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey]);

  return value;
}
