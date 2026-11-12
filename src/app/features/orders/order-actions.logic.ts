import { ServiceOrder } from '../../core/api/models';
import { UiActor } from '../../core/state/actor.service';

export type OrderAction = 'quote' | 'approve' | 'reject' | 'cancel' | 'start' | 'complete';

/**
 * Actions the current actor may take on the order (rule 4). The backend enforces the same state machine;
 * the UI only avoids offering buttons that would end in a 409.
 */
export function availableActions(order: ServiceOrder, actor: UiActor): OrderAction[] {
  if (actor === 'workshop') {
    switch (order.status) {
      case 'Created':
        return ['quote'];
      case 'Approved':
        return ['start'];
      case 'InProgress':
        return ['complete'];
      default:
        return [];
    }
  }

  const actions: OrderAction[] = [];
  if (order.status === 'Quoted' && order.awaitingClientApproval) {
    actions.push('approve', 'reject');
  }
  if (order.status === 'Created' || order.status === 'Quoted' || order.status === 'Approved') {
    actions.push('cancel');
  }
  return actions;
}
