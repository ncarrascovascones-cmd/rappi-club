// Tipos de dominio de Rappi Crew.

export type Role = 'nuevo' | 'copiloto' | 'admin';

export type Vehicle = 'moto' | 'bici' | 'carro' | 'a_pie';
export type Schedule = 'manana' | 'tarde' | 'noche' | 'fin_de_semana';

export type HelpCategory =
  | 'cliente_no_responde'
  | 'problema_pedido'
  | 'problema_incentivo'
  | 'demasiado_lejos'
  | 'problema_tienda'
  | 'otro';

export interface RiderProfile {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  color: string;
  vehicle: Vehicle;
  zone: string;
  schedule: Schedule[];
  joinedDaysAgo: number;
  deliveries: number;
}

export type CopilotStatus = 'activo' | 'pausa' | 'retirado';

export interface Copilot {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  color: string;
  yearsOnPlatform: number;
  monthsOnPlatform: number;
  deliveries: number;
  vehicle: Vehicle;
  zone: string;
  nearbyZones: string[];
  availability: 'alta' | 'media' | 'baja';
  schedule: Schedule[];
  bio: string;
  specialties: string[];
  accompanied: number;
  experiencesShared: number;
  protocolsOriginated: string[];
  badges: string[];
  status: CopilotStatus;
  responseTime: string;
}

export interface ChatMessage {
  id: string;
  from: 'nuevo' | 'copiloto' | 'system';
  text: string;
  at: string;
}

export type HelpStatus = 'recibido' | 'en_revision' | 'resuelto';

export interface HelpRequest {
  id: string;
  category: HelpCategory;
  text: string;
  createdAt: string;
  status: HelpStatus;
  riderName: string;
  zone: string;
  matchedProtocolId?: string;
  similarCount: number;
  clusterId?: string;
  helpful?: boolean;
}

export type ExperienceStatus = 'nueva' | 'agrupada' | 'en_protocolo';

export interface Experience {
  id: string;
  author: string;
  initials: string;
  color: string;
  authorRole: 'nuevo' | 'copiloto' | 'rappitendero';
  months: number;
  zone: string;
  category: HelpCategory;
  text: string;
  createdAt: string;
  thanks: number;
  status: ExperienceStatus;
  clusterId?: string;
  mine?: boolean;
}

export type ClusterStatus =
  | 'detectado'
  | 'en_analisis'
  | 'protocolo_en_borrador'
  | 'en_validacion'
  | 'publicado';

export interface Cluster {
  id: string;
  title: string;
  category: HelpCategory;
  cases: number;
  experienceIds: string[];
  status: ClusterStatus;
  protocolId?: string;
  trend: number; // variación % semanal
  zones: string[];
  createdAt: string;
}

export type ProtocolStatus = 'borrador' | 'en_validacion' | 'aprobado' | 'publicado';

export interface Protocol {
  id: string;
  number: number;
  title: string;
  category: HelpCategory;
  summary: string;
  problem: string;
  situation: string;
  steps: string[];
  escalate: string[];
  origin: string;
  contributors: string[];
  experiencesCount: number;
  updatedAt: string;
  status: ProtocolStatus;
  views: number;
  helpful: number;
  readMinutes: number;
  clusterId?: string;
}

export type InvitationStatus = 'pendiente' | 'aceptada' | 'rechazada';

export interface Invitation {
  id: string;
  riderName: string;
  initials: string;
  color: string;
  zone: string;
  vehicle: Vehicle;
  joinedDaysAgo: number;
  schedule: Schedule[];
  note: string;
  matchScore: number;
  status: InvitationStatus;
}

export interface Mentee {
  id: string;
  name: string;
  initials: string;
  color: string;
  zone: string;
  vehicle: Vehicle;
  week: number;
  progress: number;
  lastContact: string;
  threadId: string;
  mood: 'bien' | 'dudas' | 'necesita_apoyo';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: 'inicio' | 'chat' | 'protocolo' | 'hito' | 'posta';
}

export interface VoiceStory {
  id: string;
  name: string;
  initials: string;
  color: string;
  badge: string;
  badgeTone: 'brand' | 'mint' | 'sun' | 'grape' | 'sky';
  zone: string;
  months: number;
  contribution: string;
  protocolIds: string[];
  story: string;
  quote: string;
  accompanied: number;
  thanks: number;
}

export type BenefitCategory = 'movilidad' | 'salud' | 'familia' | 'aprendizaje';

export interface Benefit {
  id: string;
  category: BenefitCategory;
  title: string;
  description: string;
  detail: string;
  howTo: string[];
  tag: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  href: string;
}

export interface IncidentReport {
  id: string;
  reason: string;
  text: string;
  createdAt: string;
}
