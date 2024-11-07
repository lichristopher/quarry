import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

const API_URL = 'http://localhost:3002/quarryDispatchRecords';

interface QuarryDispatchRecord {
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

interface FormData {
  drNumber: string;
  trucker: string;
  plateNumber: string;
  quantityUnit: string;
  destination: string;
  paymentMethod: string;
}

export default function Component() {
  const [records, setRecords] = useState<QuarryDispatchRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      drNumber: '',
      trucker: '',
      plateNumber: '',
      quantityUnit: '',
      destination: '',
      paymentMethod: '',
    },
  });

  const fetchRecords = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load records');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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

  const onSubmit = async (data: FormData) => {
    const newRecord = {
      ...data,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        setIsOpen(false);
        form.reset();
        fetchRecords();
      } else {
        throw new Error('Failed to add record');
      }
    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add record');
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
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
                  name="drNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DR Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter DR number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trucker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trucker</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter trucker name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plateNumber"
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
                  name="quantityUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Unit</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter quantity (e.g., 10 cu.m)"
                          {...field}
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
                  name="paymentMethod"
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
                          <SelectItem value="Cash">Cash</SelectItem>
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-center text-sm">
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
