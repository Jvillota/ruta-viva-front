import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { timer } from 'rxjs';
import { ActorService, UiActor } from './core/state/actor.service';
import { ClockStore, NotificationsStore } from './core/state/app-stores';

/** Application shell: toolbar (actor, business date, notices) and side navigation. */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonToggleModule,
    DatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly actor = inject(ActorService);
  protected readonly clock = inject(ClockStore);
  protected readonly notifications = inject(NotificationsStore);

  constructor() {
    console.info('RutaViva web started');
    timer(0, 5000)
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => {
        this.notifications.refresh();
        this.clock.refresh();
      });
  }

  protected setActor(actor: UiActor): void {
    this.actor.set(actor);
  }
}
