import { getDb } from '@/lib/db';
import { listHeldOrders, saveHeldOrder, deleteHeldOrder } from '@/lib/repositories/billing';

export const billingService = {
  listHeld(outletId: number) {
    return listHeldOrders(getDb(), outletId);
  },
  hold(outletId: number, label: string, cartJson: string) {
    return saveHeldOrder(getDb(), outletId, label, cartJson);
  },
  deleteHeld(id: number) {
    return deleteHeldOrder(getDb(), id);
  },
};
