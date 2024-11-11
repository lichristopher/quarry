import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
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
import { TruckerOption, DeliveryFormData } from '../types';
import { UseFormReturn } from 'react-hook-form';

interface AddDeliveryFormProps {
  form: UseFormReturn<DeliveryFormData>;
  truckers: TruckerOption[];
  isSubmitting: boolean;
  onSubmit: (data: DeliveryFormData) => Promise<void>;
  onCancel: () => void;
}

export function AddDeliveryForm({
  form,
  truckers,
  isSubmitting,
  onSubmit,
  onCancel,
}: AddDeliveryFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="direct_receipt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direct Receipt</FormLabel>
              <FormControl>
                <Input placeholder="Enter direct receipt number" {...field} />
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
                  const selectedTrucker = truckers.find((t) => t.id === value);
                  if (selectedTrucker) {
                    form.setValue('trucker_name', selectedTrucker.fullName);
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

        {/* ... Rest of the form fields ... */}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
  );
}
