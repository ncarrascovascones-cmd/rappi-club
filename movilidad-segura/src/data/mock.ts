// Datos ficticios del MVP. Todo es local: no hay backend ni GPS real.

export const PARENT = {
  firstName: 'Nicolás',
  fullName: 'Nicolás Carrasco',
  initials: 'NC',
};

export const CHILD = {
  id: 'mateo',
  firstName: 'Mateo',
  fullName: 'Mateo Carrasco',
  initials: 'MC',
  grade: '3.° de primaria',
  school: 'Colegio Demo',
  route: 'Ruta 04',
  homeAddress: 'Av. Demo 123, Miraflores',
  deliveryCode: '4827',
};

export const DRIVER = {
  name: 'Carlos',
  fullName: 'Carlos Mendoza',
  initials: 'CM',
  rating: '4.9',
  years: 8,
  tutor: 'Lucía Fernández',
  vehicle: 'Van escolar',
  model: 'Hyundai H-1 · Blanca',
  plate: 'ABC-123',
  seats: 12,
};

export const SCHOOL = {
  name: 'Colegio Demo',
  address: 'Av. Primavera 1450, Santiago de Surco',
};

/** Personas que pueden recibir a Mateo en casa. */
export const RECEIVERS = [
  { id: 'mama', label: 'Mamá', name: 'María Carrasco' },
  { id: 'papa', label: 'Papá', name: 'Nicolás Carrasco' },
  { id: 'autorizada', label: 'Persona autorizada', name: 'Rosa Quispe (abuela)' },
] as const;

export type ReceiverId = (typeof RECEIVERS)[number]['id'];

export interface Kid {
  id: string;
  name: string;
  initials: string;
  address: string;
  pickupTime: string;
  dropTime: string;
  parent: string;
  code: string;
}

export const ROUTE_KIDS: Kid[] = [
  {
    id: 'mateo',
    name: 'Mateo Carrasco',
    initials: 'MC',
    address: 'Av. Demo 123',
    pickupTime: '7:11 a. m.',
    dropTime: '3:12 p. m.',
    parent: 'Nicolás Carrasco',
    code: '4827',
  },
  {
    id: 'sofia',
    name: 'Sofía Pérez',
    initials: 'SP',
    address: 'Calle Las Flores 210',
    pickupTime: '7:14 a. m.',
    dropTime: '3:16 p. m.',
    parent: 'Andrea Pérez',
    code: '3190',
  },
  {
    id: 'diego',
    name: 'Diego Torres',
    initials: 'DT',
    address: 'Jr. Los Pinos 455',
    pickupTime: '7:18 a. m.',
    dropTime: '3:20 p. m.',
    parent: 'Javier Torres',
    code: '7712',
  },
  {
    id: 'valentina',
    name: 'Valentina Ruiz',
    initials: 'VR',
    address: 'Av. Primavera 870',
    pickupTime: '7:21 a. m.',
    dropTime: '3:24 p. m.',
    parent: 'Claudia Ruiz',
    code: '5064',
  },
  {
    id: 'lucas',
    name: 'Lucas García',
    initials: 'LG',
    address: 'Calle Monterrico 32',
    pickupTime: '7:24 a. m.',
    dropTime: '3:28 p. m.',
    parent: 'Martín García',
    code: '2281',
  },
  {
    id: 'camila',
    name: 'Camila Rojas',
    initials: 'CR',
    address: 'Av. El Polo 1020',
    pickupTime: '7:27 a. m.',
    dropTime: '3:31 p. m.',
    parent: 'Paola Rojas',
    code: '9437',
  },
  {
    id: 'sebastian',
    name: 'Sebastián Vargas',
    initials: 'SV',
    address: 'Jr. Caminos del Inca 315',
    pickupTime: '7:30 a. m.',
    dropTime: '3:35 p. m.',
    parent: 'Ricardo Vargas',
    code: '6620',
  },
  {
    id: 'isabella',
    name: 'Isabella Mendoza',
    initials: 'IM',
    address: 'Av. Benavides 4410',
    pickupTime: '7:33 a. m.',
    dropTime: '3:39 p. m.',
    parent: 'Elena Mendoza',
    code: '1358',
  },
];

export const INCIDENT_TYPES = [
  { id: 'retraso', label: 'Retraso', desc: 'La ruta llegará más tarde de lo previsto' },
  { id: 'trafico', label: 'Tráfico', desc: 'Congestión en la vía actual' },
  { id: 'ruta', label: 'Cambio de ruta', desc: 'Desvío por obras o cierre de vía' },
  { id: 'vehiculo', label: 'Problema con vehículo', desc: 'Falla mecánica o neumático' },
  { id: 'emergencia', label: 'Emergencia', desc: 'Situación que requiere atención inmediata' },
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number]['id'];

export interface HistoryTrip {
  id: string;
  kind: 'ida' | 'regreso';
  from: string;
  to: string;
  pickup: string;
  drop: string;
  receivedBy?: string;
  duration: string;
  distance: string;
  incidents: number;
}

export const PAST_DAYS: { label: string; date: string; trips: HistoryTrip[] }[] = [
  {
    label: 'Ayer',
    date: 'Martes 6 de octubre',
    trips: [
      {
        id: 'y-ida',
        kind: 'ida',
        from: '7:00 a. m.',
        to: '7:39 a. m.',
        pickup: '7:10 a. m.',
        drop: '7:39 a. m.',
        duration: '29 min',
        distance: '8,2 km',
        incidents: 0,
      },
      {
        id: 'y-reg',
        kind: 'regreso',
        from: '2:35 p. m.',
        to: '3:10 p. m.',
        pickup: '2:36 p. m.',
        drop: '3:10 p. m.',
        receivedBy: 'María Carrasco',
        duration: '34 min',
        distance: '8,4 km',
        incidents: 0,
      },
    ],
  },
  {
    label: 'Lunes',
    date: 'Lunes 5 de octubre',
    trips: [
      {
        id: 'l-ida',
        kind: 'ida',
        from: '7:00 a. m.',
        to: '7:44 a. m.',
        pickup: '7:12 a. m.',
        drop: '7:44 a. m.',
        duration: '32 min',
        distance: '8,2 km',
        incidents: 1,
      },
      {
        id: 'l-reg',
        kind: 'regreso',
        from: '2:35 p. m.',
        to: '3:14 p. m.',
        pickup: '2:35 p. m.',
        drop: '3:14 p. m.',
        receivedBy: 'Rosa Quispe (abuela)',
        duration: '39 min',
        distance: '8,4 km',
        incidents: 0,
      },
    ],
  },
];
