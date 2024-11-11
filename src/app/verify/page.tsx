'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token: otp,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to login page after successful verification
      router.push('/login');
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-blue-950">
      <Card className="mx-auto w-full max-w-[500px] overflow-hidden rounded-xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter the verification code sent to your email
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Verify
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
