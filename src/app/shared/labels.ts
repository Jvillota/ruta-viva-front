import { ReadingOutcome, RoutineStatus, ServiceOrderStatus, TransitionActor } from '../core/api/models';

export const ROUTINE_STATUS_LABEL: Record<RoutineStatus, string> = {
  UpToDate: 'Al día',
  DueSoon: 'Por vencer',
  Overdue: 'Vencida',
};

export const ORDER_STATUS_LABEL: Record<ServiceOrderStatus, string> = {
  Created: 'Creada',
  Quoted: 'Cotizada',
  Approved: 'Aprobada',
  InProgress: 'En ejecución',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
};

export const ACTOR_LABEL: Record<TransitionActor, string> = {
  System: 'Sistema',
  Workshop: 'Taller',
  Client: 'Jefe de flota',
};

export const OUTCOME_LABEL: Record<ReadingOutcome, string> = {
  Applied: 'Aplicada',
  Ignored: 'Ignorada',
};

/** Visual tone of a status, shared by routines and orders. */
export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

export const ROUTINE_TONE: Record<RoutineStatus, Tone> = { UpToDate: 'ok', DueSoon: 'warn', Overdue: 'danger' };

export const ORDER_TONE: Record<ServiceOrderStatus, Tone> = {
  Created: 'info',
  Quoted: 'warn',
  Approved: 'info',
  InProgress: 'info',
  Completed: 'ok',
  Cancelled: 'neutral',
};
