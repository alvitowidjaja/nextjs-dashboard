import SessionTracker from '@/app/ui/dashboard/session-tracker';
import Link from 'next/link';
import { TradingTerminal } from '@/app/ui/TradingTerminal';

async function getAAPLData() {
  const apiKey = process.env.POLYGON_API_KEY;

  if (!apiKey || apiKey === 'insert_your_key_here') {
    return { close: null, volume: null };
  }

  try {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true`,
      {
        next: { revalidate: 60 },
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!res.ok) {
      console.error(`Polygon API Error: ${res.status} ${res.statusText}`);
      return { close: null, volume: null };
    }

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return {
        close: data.results[0].c,
        volume: data.results[0].v,
      };
    }

    return { close: null, volume: null };
  } catch (error) {
    console.error('Failed to fetch AAPL data:', error);
    return { close: null, volume: null };
  }
}

export default async function Page() {
  const aaplData = await getAAPLData();

  return (
    <main className="flex w-full flex-col">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Trading Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Institutional Macro-Technical Tracking</p>
        </div>
        <SessionTracker />
      </div>


      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <Link href="/dashboard/AAPL" className="block transition-transform hover:scale-[1.02]">
          <div className="relative h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-900/5 dark:ring-slate-700 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">AAPL</h3>
              <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-700/30">
                Equities
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {aaplData.close ? `$${aaplData.close.toFixed(2)}` : '---'}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prev Close</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Vol: {aaplData.volume ? aaplData.volume.toLocaleString() : '---'}</span>
            </div>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 dark:from-blue-900/20 to-transparent opacity-50 blur-2xl"></div>
          </div>
        </Link>

        <Link href="/dashboard/TSLA" className="block transition-transform hover:scale-[1.02]">
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 p-6 text-center hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500">TSLA</h3>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Placeholder</p>
          </div>
        </Link>

        <Link href="/dashboard/GBP-JPY" className="block transition-transform hover:scale-[1.02]">
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 p-6 text-center hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500">GBP/JPY</h3>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Placeholder</p>
          </div>
        </Link>

        <Link href="/dashboard/EUR-AUD" className="block transition-transform hover:scale-[1.02]">
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 p-6 text-center hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500">EUR/AUD</h3>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Placeholder</p>
          </div>
        </Link>

      </div>
      <div className="mt-8">
        <TradingTerminal />
      </div>
    </main>
  );
}