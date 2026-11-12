// Contracts of the RutaViva API (v1). Enums travel as strings.

export type RoutineStatus = 'UpToDate' | 'DueSoon' | 'Overdue';
export type ServiceOrderStatus = 'Created' | 'Quoted' | 'Approved' | 'InProgress' | 'Completed' | 'Cancelled';
export type ApprovalType = 'Automatic' | 'Manual';
export type CancellationReason = 'ClientCancelled' | 'QuoteRejected';
export type TransitionActor = 'System' | 'Workshop' | 'Client';
export type ReadingOutcome = 'Applied' | 'Ignored';

export interface Workshop {
  id: string;
  name: string;
}

export interface VehicleSummary {
  id: string;
  plate: string;
  workshopId: string;
  workshopName: string;
  odometerKm: number;
  routinesUpToDate: number;
  routinesDueSoon: number;
  routinesOverdue: number;
  openServiceOrders: number;
}

export interface Routine {
  id: string;
  name: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  cycleStartKm: number;
  cycleStartDate: string;
  status: RoutineStatus;
  dueKm: number | null;
  dueDate: string | null;
  remainingKm: number | null;
  remainingDays: number | null;
  openServiceOrderId: string | null;
}

export interface VehicleDetail {
  id: string;
  plate: string;
  workshopId: string;
  workshopName: string;
  odometerKm: number;
  routines: Routine[];
}

export interface ServiceOrderTransition {
  from: ServiceOrderStatus | null;
  to: ServiceOrderStatus;
  actor: TransitionActor;
  occurredAt: string;
}

export interface ServiceOrder {
  id: string;
  vehicleId: string;
  plate: string;
  routineId: string;
  routineName: string;
  workshopId: string;
  status: ServiceOrderStatus;
  quoteAmountCop: number | null;
  approvalType: ApprovalType | null;
  awaitingClientApproval: boolean;
  cancellationReason: CancellationReason | null;
  serviceKm: number | null;
  serviceDate: string | null;
  createdAt: string;
  updatedAt: string;
  transitions: ServiceOrderTransition[];
}

export interface OdometerReadingResult {
  status: ReadingOutcome;
  currentOdometerKm: number;
  serviceOrdersOpened: number;
}

export interface OdometerReadingEntry {
  vehicleId: string;
  km: number;
  outcome: ReadingOutcome;
  receivedAt: string;
}

export interface NotificationEntry {
  id: string;
  type: string;
  title: string;
  message: string;
  vehicleId: string | null;
  serviceOrderId: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface ClockView {
  now: string;
  today: string;
  offsetDays: number;
  demoEnabled: boolean;
}

export interface DailyCheckSummary {
  businessDate: string;
  vehiclesChecked: number;
  routinesChanged: number;
  serviceOrdersOpened: number;
}

/** RFC 9457 error body returned by the API. */
export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}
