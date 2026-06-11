import { getDb } from '@/lib/db';
import { getKdsFeed, bumpOrder } from '@/lib/repositories/kds';

export const kdsService = {
  feed(station = 'Kitchen') {
    return getKdsFeed(getDb(), station);
  },
  bump(orderId: number, target: 'Preparing' | 'Ready') {
    return bumpOrder(getDb(), orderId, target);
  },
};
