import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subject, merge, switchMap, timer } from 'rxjs';
import { ServiceOrder } from '../../core/api/models';
import { ServiceOrdersApi } from '../../core/api/rutaviva-api';
import { NotificationsStore } from '../../core/state/app-stores';
import { CopPipe, KmPipe } from '../../shared/cop.pipe';
import { ACTOR_LABEL, ORDER_STATUS_LABEL } from '../../shared/labels';
import { StatusChip } from '../../shared/status-chip';
import { OrderActions } from './order-actions';

/** Order detail: summary, the actions of the current actor and the full transition history. */
@Component({
  selector: 'app-order-detail',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, DatePipe, CopPipe, KmPipe, StatusChip, OrderActions],
  templateUrl: './order-detail.html',
  styleUrl: './orders.scss',
})
export class OrderDetailPage {
  private readonly api = inject(ServiceOrdersApi);
  private readonly notifications = inject(NotificationsStore);
  private readonly reload$ = new Subject<void>();

  /** Route parameter, bound by withComponentInputBinding(). */
  readonly id = input.required<string>();

  protected readonly order = signal<ServiceOrder | null>(null);
  protected readonly statusLabel = ORDER_STATUS_LABEL;
  protected readonly actorLabel = ACTOR_LABEL;

  constructor() {
    toObservable(this.id)
      .pipe(
        switchMap((id) => merge(timer(0, 5000), this.reload$).pipe(switchMap(() => this.api.get(id)))),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((order) => this.order.set(order));
  }

  protected onChanged(order: ServiceOrder): void {
    this.order.set(order);
    this.notifications.refresh();
  }
}
