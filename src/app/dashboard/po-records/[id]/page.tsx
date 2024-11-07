'use client';

import { useEffect, useState } from 'react';

interface PORecordDetailPageProps {
  params: {
    id: string;
  };
}

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

export default function PORecordDetailPage({
  params,
}: PORecordDetailPageProps) {
  const [record, setRecord] = useState<PORecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/quarryDispatchRecords/${params.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecord(data);
      } catch (error) {
        console.error('Error fetching record:', error);
        setError('Failed to load record');
      }
    };

    fetchRecord();
  }, [params.id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!record) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Order Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">DR #{record.drNumber}</h2>
        <div className="grid gap-4">
          <div>
            <span className="font-medium">Date:</span>
            <span className="ml-2">{record.date}</span>
          </div>
          <div>
            <span className="font-medium">Time:</span>
            <span className="ml-2">{record.time}</span>
          </div>
          <div>
            <span className="font-medium">Trucker:</span>
            <span className="ml-2">{record.trucker}</span>
          </div>
          <div>
            <span className="font-medium">Plate Number:</span>
            <span className="ml-2">{record.plateNumber}</span>
          </div>
          <div>
            <span className="font-medium">Quantity Unit:</span>
            <span className="ml-2">{record.quantityUnit}</span>
          </div>
          <div>
            <span className="font-medium">Destination:</span>
            <span className="ml-2">{record.destination}</span>
          </div>
          <div>
            <span className="font-medium">Payment Method:</span>
            <span className="ml-2">{record.paymentMethod}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
