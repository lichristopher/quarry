import PORecordsTable from './po-records-table';

export default function PORecordsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Order Records</h1>
      <div className="grid gap-4">
        <PORecordsTable />
      </div>
    </div>
  );
}
