import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { switchMap, timer } from 'rxjs';
import { VehicleSummary } from '../../core/api/models';
import { FleetApi } from '../../core/api/rutaviva-api';
import { KmPipe } from '../../shared/cop.pipe';

/** Fleet overview: one row per vehicle with a count of routines per status. Refreshes every 5 s. */
@Component({
  selector: 'app-fleet-list',
  imports: [MatTableModule, MatCardModule, MatIconModule, RouterLink, KmPipe],
  templateUrl: './fleet-list.html',
  styleUrl: './fleet.scss',
})
export class FleetList {
  private readonly api = inject(FleetApi);

  protected readonly vehicles = signal<VehicleSummary[]>([]);
  protected readonly loaded = signal(false);
  protected readonly columns = ['plate', 'workshop', 'odometer', 'routines', 'orders'];

  constructor() {
    timer(0, 5000)
      .pipe(
        switchMap(() => this.api.vehicles()),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((list) => {
        this.vehicles.set(list);
        this.loaded.set(true);
      });
  }
}
