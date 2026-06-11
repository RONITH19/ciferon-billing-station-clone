import { Suspense } from 'react';
import BillingPageClient from './billing-client';

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading POS…</div>}>
      <BillingPageClient />
    </Suspense>
  );
}
