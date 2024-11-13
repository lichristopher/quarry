'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, HelpCircle, Wallet, FileText } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

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
  last_name: string;
}

interface UserSession {
  id: string;
  email: string | undefined;
  profile?: Profile;
}

export default function ClientDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        router.push('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      setUser({
        id: user.id,
        email: user.email,
        profile: profileData || undefined,
      });

      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select(
          `
          id,
          date,
          direct_receipt,
          trucker_id,
          trucker_name,
          plate_number,
          time,
          quantity,
          price,
          destination,
          payment_method,
          payment_status
        `
        )
        .eq('trucker_id', user.id)
        .order('date', { ascending: false });

      if (deliveriesError) {
        console.error('Error:', deliveriesError);
        setError(deliveriesError.message);
        return;
      }

      setDeliveries(deliveriesData || []);

      const total = (deliveriesData || []).reduce((sum, delivery) => {
        if (delivery.payment_status === 'PAID') {
          return sum + (Number(delivery.price) || 0);
        }
        return sum;
      }, 0);
      setTotalPrice(total);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getUserDisplayName = () => {
    if (user?.profile) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    return user?.email || 'Guest';
  };

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-[#012636F7] text-white ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-300 flex flex-col`}
      >
        {/* Header with User Info */}
        <div className="flex flex-col px-4 py-3">
          {isSidebarOpen && (
            <>
              <Image
                src="/logo.png"
                alt="Renans Quarry"
                width={200}
                height={100}
              />
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Welcome,</p>
                <p className="text-sm font-bold">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                <button
                  onClick={handleSignOut}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/client-dashboard/transactions"
                className={`flex items-center px-4 py-2 transition-colors ${
                  pathname.includes('/client-dashboard/transactions')
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <Wallet className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Transactions</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <Link
            href="/client-dashboard/help"
            className="flex items-center hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Help</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="p-6">
          {/* User welcome message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Welcome, {getUserDisplayName()}
            </h1>
            <p className="text-gray-600">Here are your delivery records</p>
          </div>

          {/* Existing table code */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 w-3 py-4 whitespace-nowrap">
                      {delivery.id.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.direct_receipt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.trucker_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.plate_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.time}
                    </td>
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
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
            {deliveries.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No deliveries found
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
