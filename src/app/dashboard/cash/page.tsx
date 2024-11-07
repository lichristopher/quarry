import CashRecordsTable from './cash-records-table';

export default function CashPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cash Management</h1>
      <div className="grid gap-4">
        <CashRecordsTable />
      </div>
    </div>
  );
}
