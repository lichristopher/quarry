import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { login } from './actions';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#1a237e] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1000px] flex overflow-hidden">
        {/* Login Form Section */}
        <div className="w-1/2 p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <h1 className="text-xl font-semibold">Login</h1>
          </div>

          <h2 className="text-2xl font-bold mb-2">Log in to your Account</h2>
          <p className="text-gray-500 mb-8">
            Welcome back! Select method to log in.
          </p>

          <div className="flex items-center gap-2 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-500 text-sm">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <form className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="admin@dotwork.com"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              ></button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              formAction={login}
              className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
            >
              Log in
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="w-1/2">
          <img
            src="/quarry.png"
            alt="quarry"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
