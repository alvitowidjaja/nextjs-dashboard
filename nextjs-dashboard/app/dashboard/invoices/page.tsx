"use client";

import { clsx } from 'clsx';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

type TradeStatus = 'Win' | 'Loss';
type TradeDirection = 'Long' | 'Short';

interface Trade {
  id: string;
  date: string;
  ticker: string;
  direction: TradeDirection;
  setupType: string;
  rrRatio: string;
  status: TradeStatus;
}

const mockTrades: Trade[] = [
  { id: 'TRD-1092', date: '2026-05-04', ticker: 'EUR/USD', direction: 'Long', setupType: 'Liquidity Sweep', rrRatio: '2.5:1', status: 'Win' },
  { id: 'TRD-1091', date: '2026-05-04', ticker: 'SPY', direction: 'Short', setupType: 'Algo Trap', rrRatio: '1.5:1', status: 'Win' },
  { id: 'TRD-1090', date: '2026-05-03', ticker: 'XAU/USD', direction: 'Long', setupType: 'Macro Divergence', rrRatio: '0.8:1', status: 'Loss' },
  { id: 'TRD-1089', date: '2026-05-03', ticker: 'GBP/JPY', direction: 'Short', setupType: 'Liquidity Sweep', rrRatio: '3.0:1', status: 'Win' },
  { id: 'TRD-1088', date: '2026-05-02', ticker: 'AAPL', direction: 'Long', setupType: 'Algo Trap', rrRatio: '1.0:1', status: 'Loss' },
  { id: 'TRD-1087', date: '2026-05-02', ticker: 'BTC/USD', direction: 'Long', setupType: 'Macro Divergence', rrRatio: '4.2:1', status: 'Win' },
  { id: 'TRD-1086', date: '2026-05-01', ticker: 'NQ1!', direction: 'Short', setupType: 'Liquidity Sweep', rrRatio: '1.2:1', status: 'Loss' },
  { id: 'TRD-1085', date: '2026-05-01', ticker: 'ES1!', direction: 'Long', setupType: 'Macro Divergence', rrRatio: '2.1:1', status: 'Win' },
];

export default function TradeExecutionLedger() {
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

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm dark:shadow-lg">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-100 dark:bg-gray-950/50 uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Trade ID</th>
              <th scope="col" className="px-6 py-4 font-medium">Date</th>
              <th scope="col" className="px-6 py-4 font-medium">Ticker</th>
              <th scope="col" className="px-6 py-4 font-medium">Direction</th>
              <th scope="col" className="px-6 py-4 font-medium">Setup Type</th>
              <th scope="col" className="px-6 py-4 font-medium">R:R Ratio</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {mockTrades.map((trade) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}