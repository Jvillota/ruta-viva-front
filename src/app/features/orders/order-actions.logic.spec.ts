import { ServiceOrder, ServiceOrderStatus } from '../../core/api/models';
import { availableActions } from './order-actions.logic';

function order(status: ServiceOrderStatus, awaitingClientApproval = false): ServiceOrder {
  return {
    id: 'o1',
    vehicleId: 'v1',
    plate: 'ABC123',
    routineId: 'r1',
    routineName: 'Cambio de aceite',
    workshopId: 'w1',
    status,
    quoteAmountCop: null,
    approvalType: null,
    awaitingClientApproval,
    cancellationReason: null,
    serviceKm: null,
    serviceDate: null,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    transitions: [],
  };
}

describe('availableActions', () => {
  it('lets the workshop quote, start and complete in the right status only', () => {
    expect(availableActions(order('Created'), 'workshop')).toEqual(['quote']);
    expect(availableActions(order('Quoted', true), 'workshop')).toEqual([]);
    expect(availableActions(order('Approved'), 'workshop')).toEqual(['start']);
    expect(availableActions(order('InProgress'), 'workshop')).toEqual(['complete']);
    expect(availableActions(order('Completed'), 'workshop')).toEqual([]);
  });

  it('lets the client approve or reject only quotes waiting for approval', () => {
    expect(availableActions(order('Quoted', true), 'client')).toEqual(['approve', 'reject', 'cancel']);
  });

  it('lets the client cancel before execution but never after (rule 4)', () => {
    expect(availableActions(order('Created'), 'client')).toEqual(['cancel']);
    expect(availableActions(order('Approved'), 'client')).toEqual(['cancel']);
    expect(availableActions(order('InProgress'), 'client')).toEqual([]);
    expect(availableActions(order('Cancelled'), 'client')).toEqual([]);
  });
});
