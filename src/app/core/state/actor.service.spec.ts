import { TestBed } from '@angular/core/testing';
import { ActorService } from './actor.service';

describe('ActorService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('starts as the fleet manager', () => {
    const service = TestBed.inject(ActorService);

    expect(service.actor()).toBe('client');
    expect(service.isClient()).toBe(true);
    expect(service.label()).toBe('Jefe de flota');
  });

  it('switches to the workshop and remembers the choice', () => {
    TestBed.inject(ActorService).set('workshop');

    expect(TestBed.inject(ActorService).isWorkshop()).toBe(true);
    expect(localStorage.getItem('rutaviva.actor')).toBe('workshop');
  });
});
