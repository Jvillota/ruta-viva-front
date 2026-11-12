import { SCENARIOS, scenarioReadings } from './scenarios';

describe('telemetry scenarios', () => {
  const byId = (id: string) => SCENARIOS.find((s) => s.id === id)!;

  it('repeats the same reading', () => {
    expect(scenarioReadings(byId('repeated'), 58_000)).toEqual([58_500, 58_500, 58_500]);
  });

  it('sends readings out of order, including lower values', () => {
    const readings = scenarioReadings(byId('out-of-order'), 10_000);
    expect(readings.some((km, i) => i > 0 && km < readings[i - 1])).toBe(true);
  });

  it('sends a parallel burst of 20 readings', () => {
    const burst = byId('burst');
    expect(burst.parallel).toBe(true);
    expect(scenarioReadings(burst, 0)).toHaveLength(20);
  });
});
