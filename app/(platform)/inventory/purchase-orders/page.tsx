import StubPage from '@/components/layout/stub-page';

export default function PurchaseOrdersPage() {
  return (
    <StubPage
      title="Purchase Orders"
      breadcrumb={['Inventory', 'Purchase Orders']}
      description="Create and receive purchase orders from vendors. Partial receipt supported."
    />
  );
}
