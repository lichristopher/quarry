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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle>Dashboard Login</CardTitle>
            <CardDescription>
              Login to your admin or client dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="client">
                <form id="clientForm" action={login}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="clientPassword">Password</Label>
                      <Input
                        id="clientPassword"
                        name="password"
                        type="password"
                        required
                      />
                    </div>
                  </div>
                  <CardFooter className="flex justify-between mt-4 px-0">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <UserIcon className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Login as Client'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="admin">
                <form id="adminForm" action={login}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        name="password"
                        type="password"
                        required
                      />
                    </div>
                  </div>
                  <CardFooter className="flex justify-between mt-4 px-0">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LockIcon className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Login as Admin'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
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
