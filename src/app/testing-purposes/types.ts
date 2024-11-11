import * as z from 'zod';

export interface Delivery {
  id: string;
  date: string;
  direct_receipt: string;
  trucker_id: string;
  trucker_name: string;
  plate_number: string;
  time: string;
  quantity: number;
  destination: string;
  payment_method: string;
  payment_status: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

export interface TruckerOption {
  id: string;
  fullName: string;
}

export const deliverySchema = z.object({
  direct_receipt: z.string().min(1, { message: 'Direct Receipt is required' }),
  trucker_id: z.string().min(1, { message: 'Trucker is required' }),
  trucker_name: z.string().min(1, { message: 'Trucker name is required' }),
  plate_number: z.string().min(1, { message: 'Plate number is required' }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  destination: z.string().min(1, { message: 'Destination is required' }),
  payment_method: z.string().min(1, { message: 'Payment method is required' }),
  payment_status: z.string().min(1, { message: 'Payment status is required' }),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;
