import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ServiceOrder } from '../../core/api/models';
import { ActorService } from '../../core/state/actor.service';
import { OrderActions } from './order-actions';

const quotedOrder: ServiceOrder = {
  id: 'o1',
  vehicleId: 'v1',
  plate: 'ABC123',
  routineId: 'r1',
  routineName: 'Cambio de aceite',
  workshopId: 'w1',
  status: 'Quoted',
  quoteAmountCop: 2_000_000,
  approvalType: null,
  awaitingClientApproval: true,
  cancellationReason: null,
  serviceKm: null,
  serviceDate: null,
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
  transitions: [],
};

describe('OrderActions', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [OrderActions],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  function render() {
    const fixture = TestBed.createComponent(OrderActions);
    fixture.componentRef.setInput('order', quotedOrder);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows approve and reject to the fleet manager for a quote above the threshold', () => {
    const el = render();

    expect(el.querySelector('#btn_approve_quote')).not.toBeNull();
    expect(el.querySelector('#btn_reject_quote')).not.toBeNull();
    expect(el.querySelector('#txt_quote_requires_approval')?.textContent).toContain('2.000.000');
  });

  it('shows no actions to the workshop while the client decides', () => {
    TestBed.inject(ActorService).set('workshop');

    const el = render();

    expect(el.querySelector('#btn_approve_quote')).toBeNull();
    expect(el.querySelector('#txt_order_no_actions')).not.toBeNull();
  });
});
