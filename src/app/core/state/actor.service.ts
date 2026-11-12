import { Injectable, computed, signal } from '@angular/core';

/** Who is using the console. Authentication is out of scope: the actor only decides which actions are shown. */
export type UiActor = 'client' | 'workshop';

const STORAGE_KEY = 'rutaviva.actor';

function readStoredActor(): UiActor {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'workshop' ? 'workshop' : 'client';
  } catch {
    return 'client';
  }
}

@Injectable({ providedIn: 'root' })
export class ActorService {
  private readonly current = signal<UiActor>(readStoredActor());

  readonly actor = this.current.asReadonly();
  readonly isClient = computed(() => this.current() === 'client');
  readonly isWorkshop = computed(() => this.current() === 'workshop');
  readonly label = computed(() => (this.current() === 'client' ? 'Jefe de flota' : 'Taller'));

  set(actor: UiActor): void {
    this.current.set(actor);
    try {
      localStorage.setItem(STORAGE_KEY, actor);
    } catch {
      // Storage unavailable (private mode): the choice simply is not remembered.
    }
  }
}
