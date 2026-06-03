import { redirect } from 'next/navigation';
import ThemeBox from '@/app/dashboard/ThemeBox';
import { authenticate } from '@/app/login/actions';
import Link from 'next/link';

export default function LoginPage() {
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

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Log in to your account to continue
          </p>
        </div>

        <form action={authenticate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
              Username
            </label>
            <input
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm outline-none placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30"
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm outline-none placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full flex justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
