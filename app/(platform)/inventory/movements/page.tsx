import StubPage from '@/components/layout/stub-page';

export default function StockMovementPage() {
  return (
    <StubPage
      title="Stock Movement"
      breadcrumb={['Inventory', 'Movements']}
      description="Track inbound, outbound, and transfer stock movements. Connected to inventory deduction on order completion."
    />
  );
}
