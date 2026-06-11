import { getDb } from '@/lib/db';
import { listTables, openSession, closeSession } from '@/lib/repositories/tables';

export const tableService = {
  list(outletId?: number) {
    return listTables(getDb(), outletId);
  },
  openSession(tableId: number, outletId: number, guestCount?: number) {
    return openSession(getDb(), tableId, outletId, guestCount);
  },
  closeSession(sessionId: number) {
    return closeSession(getDb(), sessionId);
  },
};
