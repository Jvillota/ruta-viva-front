import { Component, computed, input } from '@angular/core';
import { RoutineStatus, ServiceOrderStatus } from '../core/api/models';
import { ORDER_STATUS_LABEL, ORDER_TONE, ROUTINE_STATUS_LABEL, ROUTINE_TONE } from './labels';

/** Status badge: color AND text, so it does not rely on color alone. */
@Component({
  selector: 'app-status-chip',
  template: `<span class="chip" [class]="'chip chip--' + tone()" [id]="chipId()" role="status">{{ label() }}</span>`,
  styleUrl: './status-chip.scss',
})
export class StatusChip {
  readonly kind = input.required<'routine' | 'order'>();
  readonly status = input.required<RoutineStatus | ServiceOrderStatus>();
  readonly chipId = input<string>('');

  protected readonly label = computed(() =>
    this.kind() === 'routine'
      ? ROUTINE_STATUS_LABEL[this.status() as RoutineStatus]
      : ORDER_STATUS_LABEL[this.status() as ServiceOrderStatus],
  );

  protected readonly tone = computed(() =>
    this.kind() === 'routine' ? ROUTINE_TONE[this.status() as RoutineStatus] : ORDER_TONE[this.status() as ServiceOrderStatus],
  );
}
