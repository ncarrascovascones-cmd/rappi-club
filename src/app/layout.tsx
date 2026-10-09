import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Rappi Crew · La escuela de la calle',
    template: '%s · Rappi Crew',
  },
  description:
    'Prototipo de fidelización de Rappitenderos: Copilotos voluntarios que acompañan a los nuevos y Protocolos Crew validados por Rappi. Compartimos experiencia. Aprendemos todos.',
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#FF5B35',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
