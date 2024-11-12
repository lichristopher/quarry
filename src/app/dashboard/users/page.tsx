'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface Profile {
  id: string;
  first_name: string;
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('profiles').select('*');

      if (error) {
        console.error('Error fetching profiles:', error);
        setError(error.message);
        return;
      }

      setProfiles(data || []);
    };

    fetchProfiles();
  }, []);

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

        <div className="mt-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">First Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">{profile.id.slice(0, 8)}</td>
                        <td className="p-4">{profile.first_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {profiles.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No users found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
