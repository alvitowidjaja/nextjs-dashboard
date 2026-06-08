'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeBox from '@/app/dashboard/ThemeBox';
import { registerUser } from '@/app/signup/actions';
import Link from 'next/link';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(registerUser, undefined);
  const router = useRouter();

  // Redirect to login after a 2-second delay on success
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <span>&larr;</span> Back to Home
      </Link>

      {/* Theme toggle */}
      <ThemeBox />

      {/* Success overlay — centered floating bubble */}
      {state?.success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-800 border border-emerald-500/40 px-10 py-8 shadow-2xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircleIcon className="h-7 w-7 text-emerald-400" />
            </div>
            <p className="text-base font-semibold text-white">{state.message}</p>
            <div className="h-1 w-16 rounded-full bg-emerald-500/30 overflow-hidden">
              <div className="h-full w-full bg-emerald-400 animate-[shrink_2s_linear_forwards]" />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign up for a new account to get started
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="signup-username">
              Username
            </label>
            <input
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm outline-none placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 disabled:opacity-50"
              id="signup-username"
              type="text"
              name="username"
              placeholder="Choose a username"
              required
              disabled={state?.success}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="signup-password">
              Password
            </label>
            <input
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm outline-none placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 disabled:opacity-50"
              id="signup-password"
              type="password"
              name="password"
              placeholder="Create a password"
              required
              minLength={6}
              disabled={state?.success}
            />
          </div>

          {state?.message && !state?.success && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-950/50 p-3 border border-red-200 dark:border-red-800 rounded-lg" aria-live="polite">
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{state.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || state?.success}
            aria-disabled={isPending || state?.success}
            className="mt-6 w-full flex justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating account...' : state?.success ? '✓ Account Created' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

