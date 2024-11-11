'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EyeIcon, EyeOffIcon, Fish } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export default function Component() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-blue-950">
      <Card className="mx-auto w-full max-w-[1100px] overflow-hidden rounded-xl lg:grid lg:grid-cols-2">
        <div className="p-8 lg:p-12">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
              <Fish />
            </div>
            Login
          </div>
          <div className="mt-12 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Log in to your Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back! Select method to log in:
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.945 22v-8.834H7V9.485h2.945V6.54c0-3.043 1.926-4.54 4.64-4.54 1.3 0 2.418.097 2.744.14v3.18h-1.883c-1.476 0-1.82.703-1.82 1.732v2.433h3.68l-.736 3.68h-2.944L13.685 22" />
                </svg>
                Facebook
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  defaultValue="admin@dotwork.com"
                />
              </div>
              <div className="relative space-y-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  defaultValue="admin"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-blue-600">
                  Forgot Password?
                </Link>
              </div>
              <Link href="/dashboard">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Log in
                </Button>
              </Link>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="#" className="text-blue-600">
                Create an account
              </Link>
            </div>
          </div>
        </div>
        <div className="relative hidden bg-blue-600 lg:block">
          <Image
            src="/quarry.png"
            alt="Cover Image"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-600/10" />
          {/* <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm" /> */}
        </div>
      </Card>
    </div>
  );
}
