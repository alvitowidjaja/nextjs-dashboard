import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = await params;
  // Decode in case of special characters
  const symbol = decodeURIComponent(resolvedParams.symbol).toUpperCase();

  return (
    <main className="flex w-full flex-col">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Asset Details: {symbol}
        </h1>
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <svg className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Metrics for {symbol}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Advanced charts and institutional flow data will appear here.
        </p>
      </div>
    </main>
  );
}
