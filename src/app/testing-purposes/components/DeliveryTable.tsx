import { Button } from '@/components/ui/button';
import { Delivery } from '../types';

interface DeliveryTableProps {
  deliveries: Delivery[];
  onMarkAsPaid: (id: string) => void;
}

export function DeliveryTable({
  deliveries,
  onMarkAsPaid,
}: DeliveryTableProps) {
  return (
    <div className="overflow-x-hidden">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Direct Receipt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Trucker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Trucker Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Plate Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Payment Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Payment Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{delivery.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{delivery.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.direct_receipt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.trucker_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.trucker_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.plate_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{delivery.time}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.destination}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.payment_method}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    delivery.payment_status === 'PAID'
                      ? 'bg-green-50 text-green-700'
                      : delivery.payment_status === 'PENDING'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {delivery.payment_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {delivery.payment_status === 'PENDING' && (
                  <Button
                    onClick={() => onMarkAsPaid(delivery.id)}
                    size="sm"
                    variant="outline"
                    className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                  >
                    Mark as Paid
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deliveries.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No deliveries found</p>
      )}
    </div>
  );
}
