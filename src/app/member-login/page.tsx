'use client';

import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { login } from './actions';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function MemberLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && user) {
        // Query the profiles table to check admin status
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (!profileError && profiles) {
          // Redirect based on admin status
          if (profiles.is_admin) {
            redirect('/dashboard');
          } else {
            redirect('/client-dashboard');
          }
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 hidden lg:block">
        <Image
          src="/quarry.png"
          alt="Login background"
          width={1080}
          height={1080}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>Member Login</CardTitle>
            <CardDescription>Login to your member dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={login}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Member Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="member@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Member Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex justify-between mt-4 px-0">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <UserIcon className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login as Member'
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
          {error && (
            <CardFooter>
              <p className="text-sm text-red-500">{error}</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
