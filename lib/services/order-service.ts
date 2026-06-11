import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { createOrder, listOrders } from '@/lib/repositories/orders';
import { logAudit } from '@/lib/repositories/billing';

export const orderService = {
  list(filters: Parameters<typeof listOrders>[1]) {
    return listOrders(getDb(), filters);
  },
  create(input: Parameters<typeof createOrder>[1], actor?: string) {
    const db = getDb();
    const orderId = createOrder(db, input);
    logAudit(db, 'create', 'order', String(orderId), actor);
    return orderId;
  },
  async assertAuth() {
    const email = await getSessionEmail();
    if (!email) throw new Error('Unauthorized');
    return email;
  },
};
