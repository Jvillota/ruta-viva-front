/** Telemetry scenarios of the challenge: the platform repeats readings or sends them out of order. */
export interface TelemetryScenario {
  id: 'repeated' | 'out-of-order' | 'burst';
  label: string;
  description: string;
  /** True: readings are sent at the same time (concurrency). False: one after another, in this order. */
  parallel: boolean;
  /** Kilometers to send, relative to the current odometer. */
  offsets: number[];
}

export const SCENARIOS: TelemetryScenario[] = [
  {
    id: 'repeated',
    label: 'Lecturas repetidas',
    description: 'La misma lectura llega tres veces: solo la primera se aplica.',
    parallel: false,
    offsets: [500, 500, 500],
  },
  {
    id: 'out-of-order',
    label: 'Fuera de orden',
    description: 'Llegan lecturas atrasadas: las menores al odómetro se ignoran sin error.',
    parallel: false,
    offsets: [300, 100, 600, 200, 600, 900],
  },
  {
    id: 'burst',
    label: 'Ráfaga concurrente',
    description: '20 lecturas simultáneas: el odómetro queda en la mayor y nunca hay más de una orden por rutina.',
    parallel: true,
    offsets: Array.from({ length: 20 }, (_, i) => (i + 1) * 100),
  },
];

/** Absolute readings of a scenario for the given odometer. */
export function scenarioReadings(scenario: TelemetryScenario, odometerKm: number): number[] {
  return scenario.offsets.map((offset) => odometerKm + offset);
}
