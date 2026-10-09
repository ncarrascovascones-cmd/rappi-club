'use client';

import { AlertTriangle } from 'lucide-react';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-ink-900">Algo se nos cruzó en el camino</h1>
      <p className="mt-2 max-w-sm text-ink-500">Ocurrió un error inesperado. Puedes intentarlo de nuevo.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white hover:bg-ink-800"
      >
        Reintentar
      </button>
    </div>
  );
}
