import { clsx } from 'clsx';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { Trade } from '@/app/lib/trade-data';
import { createTrade, deleteTradeFromJSON } from './actions';
import { Search } from './search-input';

export default async function TradeExecutionLedger(props: { searchParams?: Promise<{ query?: string, direction?: string, setupType?: string, status?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query?.toLowerCase() || '';
  const filterDirection = searchParams?.direction || '';
  const filterSetupType = searchParams?.setupType || '';
  const filterStatus = searchParams?.status || '';

  let trades: Trade[] = [];
  try {
    const res = await fetch('http://localhost:4000/api/ledger', { cache: 'no-store' });
    if (res.ok) {
      const dbTrades = await res.json();
      trades = dbTrades.map((trade: any) => ({
        id: trade.id.toString(),
        date: trade.created_at ? new Date(trade.created_at).toISOString().split('T')[0] : '',
        ticker: trade.ticker,
        direction: trade.direction,
        setupType: trade.setupType,
        rrRatio: trade.rrRatio,
        status: trade.status,
        entry_price: trade.entry_price,
        stop_loss: trade.stop_loss,
        take_profit: trade.take_profit,
        exit_price: trade.exit_price,
      }));
    } else {
      console.error('Failed to fetch trades from API:', res.statusText);
    }
  } catch (error) {
    console.error('Failed to fetch trades from API:', error);
  }

  const filteredTrades = trades.filter((trade) => {
    const matchesQuery = !query ||
      trade.ticker.toLowerCase().includes(query) ||
      trade.setupType.toLowerCase().includes(query) ||
      trade.direction.toLowerCase().includes(query);

    const matchesDirection = !filterDirection || trade.direction === filterDirection;
    const matchesSetupType = !filterSetupType || trade.setupType === filterSetupType;
    const matchesStatus = !filterStatus || trade.status === filterStatus;

    return matchesQuery && matchesDirection && matchesSetupType && matchesStatus;
  });

  return (
    <div className="w-full flex-col flex bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Trade Execution Ledger
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Review your recent macro-technical executions and performance.
          </p>
        </div>
      </div>

      <Search />

      <form action={createTrade} className="mb-8 flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Row 1: Core Setup Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticker</label>
            <input type="text" name="ticker" id="ticker" required placeholder="e.g. SPY" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
          </div>
          <div>
            <label htmlFor="setupType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setup Type</label>
            <select name="setupType" id="setupType" required defaultValue="" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2">
              <option value="" disabled>Select Setup Type</option>
              <option value="Liquidity Sweep">Liquidity Sweep</option>
              <option value="Algo Trap">Algo Trap</option>
              <option value="Macro Divergence">Macro Divergence</option>
              <option value="Order Block Mitigation">Order Block Mitigation</option>
              <option value="Fair Value Gap">Fair Value Gap</option>
              <option value="Change of Character">Change of Character</option>
              <option value="Macro Catalyst">Macro Catalyst</option>
            </select>
          </div>
          <div>
            <label htmlFor="direction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Direction</label>
            <select name="direction" id="direction" required className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2">
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>
        </div>

        {/* Row 2: Price Metrics & Add Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label htmlFor="entry_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entry Price</label>
            <input type="number" step="0.00001" name="entry_price" id="entry_price" placeholder="0.00000" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
          </div>
          <div>
            <label htmlFor="stop_loss" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stop Loss</label>
            <input type="number" step="0.00001" name="stop_loss" id="stop_loss" placeholder="0.00000" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
          </div>
          <div>
            <label htmlFor="take_profit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Take Profit</label>
            <input type="number" step="0.00001" name="take_profit" id="take_profit" placeholder="0.00000" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
          </div>
          <div>
            <label htmlFor="exit_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exit Price</label>
            <input type="number" step="0.00001" name="exit_price" id="exit_price" placeholder="0.00000" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2" />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Add Trade
            </button>
          </div>
        </div>
      </form>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm dark:shadow-lg">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-100 dark:bg-gray-950/50 uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Trade ID</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Ticker</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Direction</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Setup Type</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Entry Price</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Stop Loss</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Take Profit</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Exit Price</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">R:R Ratio</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTrades.map((trade) => (
              <tr
                key={trade.id}
                className={clsx(
                  "hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200",
                  {
                    "bg-emerald-50 dark:bg-emerald-950/10": trade.status === 'Win',
                    "bg-rose-50 dark:bg-rose-950/10": trade.status === 'Loss',
                  }
                )}
              >
                <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{trade.id}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trade.date}</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">{trade.ticker}</td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
                    {
                      "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20": trade.direction === 'Long',
                      "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20": trade.direction === 'Short',
                    }
                  )}>
                    {trade.direction === 'Long' ? (
                      <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
                    )}
                    {trade.direction}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.setupType}</td>
                <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">
                  {trade.entry_price !== null && trade.entry_price !== undefined ? parseFloat(trade.entry_price as string).toFixed(5).replace(/\.?0+$/, '') : '—'}
                </td>
                <td className="px-6 py-4 font-mono text-rose-500 dark:text-rose-400">
                  {trade.stop_loss !== null && trade.stop_loss !== undefined ? parseFloat(trade.stop_loss as string).toFixed(5).replace(/\.?0+$/, '') : '—'}
                </td>
                <td className="px-6 py-4 font-mono text-emerald-500 dark:text-emerald-400">
                  {trade.take_profit !== null && trade.take_profit !== undefined ? parseFloat(trade.take_profit as string).toFixed(5).replace(/\.?0+$/, '') : '—'}
                </td>
                <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">
                  {trade.exit_price !== null && trade.exit_price !== undefined ? parseFloat(trade.exit_price as string).toFixed(5).replace(/\.?0+$/, '') : '—'}
                </td>
                <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{trade.rrRatio}</td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
                    {
                      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20": trade.status === 'Win',
                      "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20": trade.status === 'Loss',
                    }
                  )}>
                    {trade.status === 'Win' ? (
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                    ) : (
                      <XCircleIcon className="w-3.5 h-3.5" />
                    )}
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <form action={deleteTradeFromJSON.bind(null, trade.id)}>
                    <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10" aria-label="Delete trade">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}