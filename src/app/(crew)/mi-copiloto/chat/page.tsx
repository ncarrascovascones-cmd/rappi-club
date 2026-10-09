'use client';

import { Users } from 'lucide-react';
import { RIDER_THREAD_ID, useSelectors } from '@/lib/store';
import { PageHeader } from '@/components/page-header';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyState } from '@/components/ui/states';
import { ButtonLink } from '@/components/ui/button';

export default function ChatPage() {
  const { assigned } = useSelectors();

  if (!assigned) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="Aún no tienes Copiloto"
        description="Cuando un Copiloto acepte acompañarte, podrás hablar con él aquí."
        action={<ButtonLink href="/mi-copiloto/match">Encontrar mi Copiloto</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <PageHeader
        back={{ href: '/mi-copiloto', label: 'Mi Copiloto' }}
        title={`Hablar con ${assigned.firstName}`}
        description="Comparte dudas de la calle. Para temas de tu cuenta o pagos, usa siempre el soporte oficial."
        className="mb-4"
      />
      <ChatPanel
        threadId={RIDER_THREAD_ID}
        as="nuevo"
        counterpart={{
          name: assigned.name,
          initials: assigned.initials,
          color: assigned.color,
          subtitle: `Copiloto voluntario · ${assigned.responseTime}`,
        }}
        suggestions={[
          '¿Cómo manejas las horas pico?',
          'Hoy me fue bien 🙌',
          '¿Qué zonas me recomiendas de noche?',
          'Tengo una duda con un pedido',
        ]}
      />
    </div>
  );
}
