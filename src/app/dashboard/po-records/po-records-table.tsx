'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PORecord {
  id: string;
  date: string;
  drNumber: string;
  trucker: string;
  plateNumber: string;
  time: string;
  quantityUnit: string;
  destination: string;
  paymentMethod: string;
}

export default function PORecordsTable() {
  const router = useRouter();
  const [records, setRecords] = useState<PORecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        'http://localhost:3002/quarryDispatchRecords'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Filter for P.O. payment method records only
      const poRecords = data.filter(
        (record: PORecord) => record.paymentMethod === 'P.O.'
      );
      setRecords(poRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load records');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/po-records/${id}`);
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DR Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trucker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plate Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Method
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr
              key={record.id}
              onClick={() => handleRowClick(record.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">{record.drNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{record.time}</td>
              <td className="px-6 py-4 whitespace-nowrap">{record.trucker}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.plateNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.quantityUnit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.destination}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.paymentMethod}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
