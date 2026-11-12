import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Observable, concatMap, forkJoin, from, map, toArray } from 'rxjs';
import { DailyCheckSummary, OdometerReadingResult, ReadingOutcome, VehicleSummary } from '../../core/api/models';
import { FleetApi, SystemApi, TelemetryApi } from '../../core/api/rutaviva-api';
import { ClockStore, NotificationsStore } from '../../core/state/app-stores';
import { KmPipe } from '../../shared/cop.pipe';
import { OUTCOME_LABEL } from '../../shared/labels';
import { SCENARIOS, TelemetryScenario, scenarioReadings } from './scenarios';

interface SentReading {
  order: number;
  km: number;
  result: OdometerReadingResult;
}

/**
 * Plays the external actors of the demo: the telemetry platform (manual readings and scenarios) and the passing
 * of time (demo clock and daily check). The same endpoints can be used by hand from docs/http/*.http or Scalar.
 */
@Component({
  selector: 'app-simulator-page',
  imports: [
    // FormsModule puts NgForm on the plain <form> elements: without it (ngSubmit) never fires and the browser reloads the page.
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    DatePipe,
    KmPipe,
  ],
  templateUrl: './simulator-page.html',
  styleUrl: './simulator-page.scss',
})
export class SimulatorPage {
  private readonly fleet = inject(FleetApi);
  private readonly telemetry = inject(TelemetryApi);
  private readonly system = inject(SystemApi);
  private readonly notifications = inject(NotificationsStore);
  protected readonly clock = inject(ClockStore);

  protected readonly scenarios = SCENARIOS;
  protected readonly outcomeText = (outcome: ReadingOutcome): string => OUTCOME_LABEL[outcome];
  protected readonly vehicles = signal<VehicleSummary[]>([]);
  protected readonly vehicleId = signal<string | null>(null);
  protected readonly vehicle = computed(() => this.vehicles().find((v) => v.id === this.vehicleId()) ?? null);
  protected readonly sent = signal<SentReading[]>([]);
  protected readonly busy = signal(false);
  protected readonly lastCheck = signal<DailyCheckSummary | null>(null);
  protected readonly columns = ['order', 'km', 'outcome', 'odometer', 'orders'];

  protected readonly manualKm = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);
  protected readonly advanceDays = new FormControl<number>(15, { nonNullable: true, validators: [Validators.min(1)] });

  constructor() {
    this.loadVehicles();
  }

  protected selectVehicle(id: string): void {
    this.vehicleId.set(id);
    this.sent.set([]);
    const vehicle = this.vehicles().find((v) => v.id === id);
    this.manualKm.setValue(vehicle ? vehicle.odometerKm + 100 : null);
  }

  protected sendManual(): void {
    const id = this.vehicleId();
    if (!id || this.manualKm.invalid || this.manualKm.value === null) {
      this.manualKm.markAsTouched();
      return;
    }
    this.play([this.manualKm.value], false);
  }

  protected runScenario(scenario: TelemetryScenario): void {
    const vehicle = this.vehicle();
    if (vehicle) {
      this.play(scenarioReadings(scenario, vehicle.odometerKm), scenario.parallel);
    }
  }

  protected advanceClock(days: number): void {
    this.system.advance(days).subscribe((clock) => this.clock.set(clock));
  }

  protected runDailyCheck(): void {
    this.system.runDailyCheck().subscribe((summary) => {
      this.lastCheck.set(summary);
      this.loadVehicles();
      this.notifications.refresh();
    });
  }

  private play(kms: number[], parallel: boolean): void {
    const id = this.vehicleId();
    if (!id) {
      return;
    }

    const send = (km: number, index: number): Observable<SentReading> =>
      this.telemetry.sendReading(id, km).pipe(map((result) => ({ order: index + 1, km, result })));

    const run$ = parallel
      ? forkJoin(kms.map(send))
      : from(kms.map((km, i) => [km, i] as const)).pipe(concatMap(([km, i]) => send(km, i)), toArray());

    this.busy.set(true);
    run$.subscribe({
      next: (results) => {
        this.sent.set(results);
        this.loadVehicles();
        this.notifications.refresh();
      },
      complete: () => this.busy.set(false),
      error: () => this.busy.set(false),
    });
  }

  private loadVehicles(): void {
    this.fleet.vehicles().subscribe((list) => {
      this.vehicles.set(list);
      if (!this.vehicleId() && list.length > 0) {
        this.selectVehicle(list[0].id);
      }
    });
  }
}
