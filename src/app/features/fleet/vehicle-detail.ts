import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { combineLatest, switchMap, timer } from 'rxjs';
import { OdometerReadingEntry, ReadingOutcome, Routine, VehicleDetail } from '../../core/api/models';
import { FleetApi, TelemetryApi } from '../../core/api/rutaviva-api';
import { KmPipe } from '../../shared/cop.pipe';
import { OUTCOME_LABEL } from '../../shared/labels';
import { StatusChip } from '../../shared/status-chip';

/** Vehicle detail: each routine with its status, due values, what is left and its open order. */
@Component({
  selector: 'app-vehicle-detail',
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, DatePipe, KmPipe, StatusChip],
  templateUrl: './vehicle-detail.html',
  styleUrl: './fleet.scss',
})
export class VehicleDetailPage {
  private readonly fleet = inject(FleetApi);
  private readonly telemetry = inject(TelemetryApi);

  /** Route parameter, bound by withComponentInputBinding(). */
  readonly id = input.required<string>();

  protected readonly vehicle = signal<VehicleDetail | null>(null);
  protected readonly readings = signal<OdometerReadingEntry[]>([]);
  protected readonly routineColumns = ['name', 'interval', 'status', 'due', 'remaining', 'order'];
  protected readonly readingColumns = ['km', 'outcome', 'receivedAt'];
  protected readonly outcomeText = (outcome: ReadingOutcome): string => OUTCOME_LABEL[outcome];

  constructor() {
    combineLatest([toObservable(this.id), timer(0, 5000)])
      .pipe(
        switchMap(([id]) => combineLatest([this.fleet.vehicle(id), this.telemetry.readings(id, 10)])),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(([vehicle, readings]) => {
        this.vehicle.set(vehicle);
        this.readings.set(readings);
      });
  }

  protected intervalText(r: Routine): string {
    const parts = [r.intervalKm ? `${r.intervalKm.toLocaleString('es-CO')} km` : null, r.intervalMonths ? `${r.intervalMonths} meses` : null];
    return parts.filter(Boolean).join(' o ');
  }
}
