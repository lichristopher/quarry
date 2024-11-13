'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Delivery {
  id: string;
  date: string;
  direct_receipt: string;
  trucker_id: string;
  trucker_name: string;
  plate_number: string;
  time: string;
  quantity: number;
  price: number;
  destination: string;
  payment_method: string;
  payment_status: string;
}

interface Profile {
  id: string;
  first_name: string;
}

interface TruckerOption {
  id: string;
  fullName: string;
}

const deliverySchema = z.object({
  direct_receipt: z.string().min(1, { message: 'Direct Receipt is required' }),
  trucker_id: z.string().min(1, { message: 'Trucker is required' }),
  trucker_name: z.string().min(1, { message: 'Trucker name is required' }),
  plate_number: z.string().min(1, { message: 'Plate number is required' }),
  quantity: z.number().refine((val) => val === 10 || val === 15, {
    message: 'Quantity must be either 10 or 15',
  }),
  price: z.number().min(1, { message: 'Price is required' }),
  destination: z.string().min(1, { message: 'Destination is required' }),
  payment_method: z.enum(['CASH', 'P.O.'], {
    required_error: 'Payment method is required',
  }),
  payment_status: z.string().min(1, { message: 'Payment status is required' }),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

export default function TestingPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [truckers, setTruckers] = useState<TruckerOption[]>([]);
  const [selectedTrucker, setSelectedTrucker] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      direct_receipt: '',
      trucker_id: '',
      trucker_name: '',
      plate_number: '',
      quantity: 10,
      price: 0,
      destination: '',
      payment_method: 'CASH',
      payment_status: 'PAID',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'payment_method') {
        const paymentStatus =
          value.payment_method === 'CASH' ? 'PAID' : 'PENDING';
        form.setValue('payment_status', paymentStatus);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const fetchTruckers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name')
        .order('first_name');

      if (error) {
        console.error('Error fetching truckers:', error);
        return;
      }

      const truckerOptions = data.map((profile: Profile) => ({
        id: profile.id,
        fullName: profile.first_name.trim(),
      }));
      setTruckers(truckerOptions);
    };

    fetchTruckers();
  }, []);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const supabase = createClient();

      let query = supabase
        .from('deliveries')
        .select('*')
        .order('date', { ascending: true });

      if (selectedTrucker) {
        query = query.eq('trucker_id', selectedTrucker);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error:', error);
        setError(error.message);
        return;
      }

      setDeliveries(data || []);

      const total = (data || []).reduce((sum, delivery) => {
        if (delivery.payment_status === 'PAID') {
          return sum + (delivery.price || 0);
        }
        return sum;
      }, 0);
      setTotalPrice(total);
    };

    fetchDeliveries();
  }, [selectedTrucker]);

  const handleTruckerChange = (value: string) => {
    setSelectedTrucker(value === 'all' ? null : value);
  };

  const onSubmit = async (data: DeliveryFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      console.log('Form Data:', data);

      const paymentStatus = data.payment_method === 'CASH' ? 'PAID' : 'PENDING';

      const recordData = {
        ...data,
        payment_status: paymentStatus,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
      };

      console.log('Record being inserted:', recordData);

      const { error: insertError } = await supabase
        .from('deliveries')
        .insert([recordData]);

      if (insertError) {
        console.error('Insert Error:', insertError);
        setError(insertError.message);
        return;
      }

      form.reset();
      setIsOpen(false);

      const fetchDeliveries = async () => {
        const { data: newData, error: fetchError } = await supabase
          .from('deliveries')
          .select('*')
          .order('date', { ascending: false });

        if (fetchError) {
          console.error('Fetch Error:', fetchError);
          setError(fetchError.message);
          return;
        }

        console.log('Updated deliveries:', newData);
        setDeliveries(newData || []);
      };

      fetchDeliveries();
    } catch (error) {
      console.error('Error adding record:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (deliveryId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('deliveries')
        .update({ payment_status: 'PAID' })
        .eq('id', deliveryId);

      if (error) {
        console.error('Error updating payment status:', error);
        setError(error.message);
        return;
      }

      const { data: newData, error: fetchError } = await supabase
        .from('deliveries')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setDeliveries(newData || []);

      const newTotal = (newData || []).reduce((sum, delivery) => {
        if (delivery.payment_status === 'PAID') {
          return sum + (delivery.price || 0);
        }
        return sum;
      }, 0);
      setTotalPrice(newTotal);
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (deliveryId: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', deliveryId);

      if (error) {
        console.error('Error deleting record:', error);
        setError(error.message);
        return;
      }

      // Refresh the deliveries list
      const { data: newData, error: fetchError } = await supabase
        .from('deliveries')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setDeliveries(newData || []);

      // Update total price
      const newTotal = (newData || []).reduce((sum, delivery) => {
        if (delivery.payment_status === 'PAID') {
          return sum + (delivery.price || 0);
        }
        return sum;
      }, 0);
      setTotalPrice(newTotal);
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cash and Purchase Order</h1>
        <div className="flex gap-4">
          <Select
            value={selectedTrucker || 'all'}
            onValueChange={handleTruckerChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a trucker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Truckers</SelectItem>
              {truckers.map((trucker) => (
                <SelectItem key={trucker.id} value={trucker.id}>
                  {trucker.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Record</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="direct_receipt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Direct Receipt</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter direct receipt number"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trucker_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trucker</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedTrucker = truckers.find(
                              (t) => t.id === value
                            );
                            if (selectedTrucker) {
                              form.setValue(
                                'trucker_name',
                                selectedTrucker.fullName
                              );
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a trucker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {truckers.map((trucker) => (
                              <SelectItem key={trucker.id} value={trucker.id}>
                                {trucker.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trucker_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trucker Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Trucker name will be set automatically"
                            {...field}
                            readOnly
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plate_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter plate number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quantity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter destination" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CASH">CASH</SelectItem>
                            <SelectItem value="P.O.">P.O.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {selectedTrucker && (
            <Button onClick={() => setSelectedTrucker(null)} variant="outline">
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Truckerssssssss
              </th> */}
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
                Price
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
                <td className="px-6 w-3 py-4 whitespace-nowrap">
                  {delivery.id.slice(0, 5)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{delivery.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {delivery.direct_receipt}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  {delivery.trucker_id.slice(0, 5)}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {delivery.trucker_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {delivery.plate_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{delivery.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {delivery.quantity} cubic meter
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₱{delivery.price.toLocaleString()}
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
                  <div className="flex gap-2">
                    {delivery.payment_status === 'PENDING' && (
                      <Button
                        onClick={() => handleMarkAsPaid(delivery.id)}
                        size="sm"
                        variant="outline"
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                      >
                        Mark as Paid
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(delivery.id)}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-semibold">
            <tr>
              <td colSpan={7} className="px-6 py-4 text-right">
                Total:
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ₱{totalPrice.toLocaleString()}
              </td>
              <td colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
        {deliveries.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No deliveries found</p>
        )}
      </div>
    </div>
  );
}
