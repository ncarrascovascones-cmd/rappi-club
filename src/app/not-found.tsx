import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 text-center">
      <Logo className="mb-10" />
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-brand-500 shadow-card">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-ink-900">Esta calle no existe</h1>
      <p className="mt-2 max-w-sm text-ink-500">La página que buscas no está en el mapa de la Crew.</p>
      <Link href="/" className="mt-6 rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white hover:bg-ink-800">
        Volver al inicio
      </Link>
    </div>
  );
}
