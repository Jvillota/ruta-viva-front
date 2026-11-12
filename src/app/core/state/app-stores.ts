import { Injectable, computed, inject, signal } from '@angular/core';
import { ClockView, NotificationEntry } from '../api/models';
import { NotificationsApi, SystemApi } from '../api/rutaviva-api';

/** Business clock shown in the toolbar. Null when the demo clock is disabled on the server. */
@Injectable({ providedIn: 'root' })
export class ClockStore {
  private readonly api = inject(SystemApi);
  private readonly state = signal<ClockView | null>(null);

  readonly clock = this.state.asReadonly();
  readonly today = computed(() => this.state()?.today ?? new Date().toISOString().slice(0, 10));

  refresh(): void {
    this.api.clock().subscribe({ next: (c) => this.state.set(c), error: () => this.state.set(null) });
  }

  set(clock: ClockView): void {
    this.state.set(clock);
  }
}

/** Fleet manager inbox, refreshed by polling from the shell. */
@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly api = inject(NotificationsApi);
  private readonly items = signal<NotificationEntry[]>([]);

  readonly notifications = this.items.asReadonly();
  readonly unread = computed(() => this.items().filter((n) => !n.readAt).length);

  refresh(): void {
    this.api.list().subscribe((list) => this.items.set(list));
  }

  markAsRead(id: string): void {
    this.api.markAsRead(id).subscribe(() =>
      this.items.update((list) => list.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))),
    );
  }
}
