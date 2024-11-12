'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [userCount, setUserCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      // Fetch user count
      const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        setError(profileError.message);
        return;
      }

      // Fetch total revenue (sum of paid deliveries)
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('price')
        .eq('payment_status', 'PAID');

      if (deliveriesError) {
        console.error('Error fetching deliveries:', deliveriesError);
        setError(deliveriesError.message);
        return;
      }

      const revenue = deliveriesData.reduce(
        (sum, delivery) => sum + (delivery.price || 0),
        0
      );

      setUserCount(profileCount || 0);
      setTotalRevenue(revenue);
    };

    fetchDashboardData();
  }, []);

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Stats Cards */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Users
            </h3>
            <p className="mt-2 text-3xl font-bold">{userCount}</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Revenue
            </h3>
            <p className="mt-2 text-3xl font-bold">
              ₱{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
