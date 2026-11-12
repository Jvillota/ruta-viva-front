import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NotificationsStore } from '../../core/state/app-stores';

/** Fleet manager inbox: the published events, as notices (real delivery is out of scope). */
@Component({
  selector: 'app-notifications-page',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, DatePipe],
  template: `
    <section class="page" id="ctn_notifications_module">
      <header class="page-header">
        <h1 id="ttl_notifications_module">Avisos</h1>
        <p class="muted">Eventos publicados por el sistema para el jefe de flota. Se actualiza cada 5 segundos.</p>
      </header>

      <div class="list" id="lst_notifications">
        @for (n of store.notifications(); track n.id) {
          <mat-card appearance="outlined" [class.unread]="!n.readAt" [id]="'ctn_notification_' + n.id">
            <mat-card-content>
              <div class="row">
                <div>
                  <h2>{{ n.title }}</h2>
                  <p>{{ n.message }}</p>
                  <time class="muted">{{ n.createdAt | date: 'medium' }}</time>
                </div>
                <div class="actions">
                  @if (n.serviceOrderId) {
                    <a mat-button [routerLink]="['/orders', n.serviceOrderId]" [id]="'lnk_notification_order_' + n.id">Ver orden</a>
                  } @else if (n.vehicleId) {
                    <a mat-button [routerLink]="['/fleet', n.vehicleId]" [id]="'lnk_notification_vehicle_' + n.id">Ver vehículo</a>
                  }
                  @if (!n.readAt) {
                    <button mat-stroked-button (click)="store.markAsRead(n.id)" [id]="'btn_notification_read_' + n.id">
                      <mat-icon>done</mat-icon> Marcar leído
                    </button>
                  }
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <p class="empty" id="txt_notifications_empty">No hay avisos todavía.</p>
        }
      </div>
    </section>
  `,
  styles: `
    .list { display: grid; gap: 12px; }
    .row { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    h2 { margin: 0 0 4px; font-size: 16px; }
    p { margin: 0 0 6px; }
    time { font-size: 12px; }
    .actions { display: flex; gap: 8px; align-items: center; }
    .unread { border-left: 4px solid var(--mat-sys-primary); }
  `,
})
export class NotificationsPage {
  protected readonly store = inject(NotificationsStore);
}
