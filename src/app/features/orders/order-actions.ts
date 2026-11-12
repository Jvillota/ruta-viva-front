import { Component, computed, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, filter, switchMap } from 'rxjs';
import { ServiceOrder } from '../../core/api/models';
import { ServiceOrdersApi } from '../../core/api/rutaviva-api';
import { ActorService } from '../../core/state/actor.service';
import { ClockStore } from '../../core/state/app-stores';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/confirm-dialog';
import { CopPipe } from '../../shared/cop.pipe';
import { OrderAction, availableActions } from './order-actions.logic';

/** Buttons and small forms to move an order through its lifecycle, according to the current actor. */
@Component({
  selector: 'app-order-actions',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, CopPipe],
  templateUrl: './order-actions.html',
  styleUrl: './order-actions.scss',
})
export class OrderActions {
  private readonly api = inject(ServiceOrdersApi);
  private readonly dialog = inject(MatDialog);
  private readonly clock = inject(ClockStore);
  protected readonly actor = inject(ActorService);

  readonly order = input.required<ServiceOrder>();
  readonly changed = output<ServiceOrder>();

  protected readonly actions = computed(() => availableActions(this.order(), this.actor.actor()));
  protected readonly can = (action: OrderAction) => this.actions().includes(action);

  protected readonly quoteForm = new FormGroup({
    amountCop: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  protected readonly completeForm = new FormGroup({
    serviceKm: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    serviceDate: new FormControl<string>('', [Validators.required]),
  });

  protected submitQuote(): void {
    const amount = this.quoteForm.value.amountCop;
    if (this.quoteForm.invalid || amount == null) {
      this.quoteForm.markAllAsTouched();
      return;
    }
    this.run(this.api.quote(this.order().id, amount));
  }

  protected approve(): void {
    this.run(this.api.approve(this.order().id));
  }

  protected start(): void {
    this.run(this.api.start(this.order().id));
  }

  protected reject(): void {
    this.confirm({
      title: 'Rechazar cotización',
      message: 'Al rechazar la cotización la orden se cancela. ¿Desea continuar?',
      confirmLabel: 'Rechazar',
    }, () => this.api.reject(this.order().id));
  }

  protected cancel(): void {
    this.confirm({
      title: 'Cancelar orden',
      message: 'La orden se cancelará y no podrá reabrirse. ¿Desea continuar?',
      confirmLabel: 'Cancelar orden',
    }, () => this.api.cancel(this.order().id));
  }

  protected submitCompletion(): void {
    if (!this.completeForm.value.serviceDate) {
      this.completeForm.patchValue({ serviceDate: this.clock.today() });
    }
    const { serviceKm, serviceDate } = this.completeForm.value;
    if (this.completeForm.invalid || serviceKm == null || !serviceDate) {
      this.completeForm.markAllAsTouched();
      return;
    }
    this.run(this.api.complete(this.order().id, serviceKm, serviceDate));
  }

  private confirm(data: ConfirmDialogData, action: () => Observable<ServiceOrder>): void {
    this.dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .pipe(filter(Boolean), switchMap(action))
      .subscribe((order) => this.changed.emit(order));
  }

  private run(request: Observable<ServiceOrder>): void {
    // Errors are shown by the interceptor; on success the parent refreshes with the new state.
    request.subscribe((order) => this.changed.emit(order));
  }
}
