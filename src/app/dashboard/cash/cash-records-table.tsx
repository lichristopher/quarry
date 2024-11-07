'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:3002/quarryDispatchRecords';

interface CashRecord {
  id: number;
  date: string;
  drNumber: string;
  trucker: string;
  plateNumber: string;
  time: string;
  quantityUnit: string;
  destination: string;
  paymentMethod: string;
}

export default function CashRecordsTable() {
  const [records, setRecords] = useState<CashRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const cashRecords = data.filter(
        (record: CashRecord) => record.paymentMethod === 'Cash'
      );
      setRecords(cashRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load records');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRecords();
      } else {
        throw new Error('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete record');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">DR Number</th>
                  <th className="p-4">Trucker</th>
                  <th className="p-4">Plate Number</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Quantity Unit</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">{record.date}</td>
                    <td className="p-4">{record.drNumber}</td>
                    <td className="p-4">{record.trucker}</td>
                    <td className="p-4">{record.plateNumber}</td>
                    <td className="p-4">{record.time}</td>
                    <td className="p-4">{record.quantityUnit}</td>
                    <td className="p-4">{record.destination}</td>
                    <td className="p-4">{record.paymentMethod}</td>
                    <td className="p-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
