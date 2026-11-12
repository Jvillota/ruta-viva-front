import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { combineLatest, switchMap, timer } from 'rxjs';
import { ServiceOrder, ServiceOrderStatus } from '../../core/api/models';
import { ServiceOrdersApi } from '../../core/api/rutaviva-api';
import { ActorService } from '../../core/state/actor.service';
import { CopPipe } from '../../shared/cop.pipe';
import { ORDER_STATUS_LABEL } from '../../shared/labels';
import { StatusChip } from '../../shared/status-chip';
import { availableActions } from './order-actions.logic';

/** Service orders, filterable by status. Highlights the ones waiting for the current actor. */
@Component({
  selector: 'app-order-list',
  imports: [MatTableModule, MatCardModule, MatFormFieldModule, MatSelectModule, RouterLink, DatePipe, CopPipe, StatusChip],
  templateUrl: './order-list.html',
  styleUrl: './orders.scss',
})
export class OrderList {
  private readonly api = inject(ServiceOrdersApi);
  protected readonly actor = inject(ActorService);

  protected readonly status = signal<ServiceOrderStatus | null>(null);
  protected readonly orders = signal<ServiceOrder[]>([]);
  protected readonly statuses = Object.entries(ORDER_STATUS_LABEL) as [ServiceOrderStatus, string][];
  protected readonly columns = ['plate', 'routine', 'status', 'quote', 'updated', 'pending'];

  constructor() {
    combineLatest([toObservable(this.status), timer(0, 5000)])
      .pipe(
        switchMap(([status]) => this.api.list(status)),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((orders) => this.orders.set(orders));
  }

  protected needsMe(order: ServiceOrder): boolean {
    return availableActions(order, this.actor.actor()).some((a) => a !== 'cancel');
  }
}
