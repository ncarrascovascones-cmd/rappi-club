import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

const ToastContext = createContext<(message: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

/** Toasts que aparecen en la parte superior del "teléfono". */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((message: string) => {
    const id = ++nextId.current;
    setToasts((current) => [...current.slice(-1), { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        className="pointer-events-none absolute inset-x-0 top-3 z-[70] flex flex-col items-center gap-2 px-4 md:top-12"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in rounded-2xl bg-ink/95 px-4 py-3 text-[14px] font-semibold text-white shadow-soft backdrop-blur"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
