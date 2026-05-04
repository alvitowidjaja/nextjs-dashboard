"use client";

import { clsx } from 'clsx';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';

type DailyTrend = 'Bullish' | 'Bearish' | 'Ranging';

interface Asset {
  ticker: string;
  currentPrice: string;
  dailyTrend: DailyTrend;
}

interface MarketState {
  fxMajors: Asset[];
  equities: Asset[];
  yields: Asset[];
}

const mockData: MarketState = {
  fxMajors: [
    { ticker: 'DXY', currentPrice: '105.12', dailyTrend: 'Bullish' },
    { ticker: 'EUR/USD', currentPrice: '1.0745', dailyTrend: 'Bearish' },
    { ticker: 'GBP/USD', currentPrice: '1.2530', dailyTrend: 'Ranging' },
  ],
  equities: [
    { ticker: 'SPY', currentPrice: '512.45', dailyTrend: 'Bullish' },
    { ticker: 'QQQ', currentPrice: '438.20', dailyTrend: 'Bullish' },
    { ticker: 'AAPL', currentPrice: '174.10', dailyTrend: 'Bearish' },
  ],
  yields: [
    { ticker: 'US10Y', currentPrice: '4.48%', dailyTrend: 'Bullish' },
    { ticker: 'US02Y', currentPrice: '4.82%', dailyTrend: 'Ranging' },
  ],
};

function TrendIcon({ trend }: { trend: DailyTrend }) {
  if (trend === 'Bullish') {
    return <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  }
  if (trend === 'Bearish') {
    return <ArrowTrendingDownIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
  }
  return <MinusIcon className="w-5 h-5 text-gray-600 dark:text-gray-500" />;
}

function AssetList({ title, assets }: { title: string; assets: Asset[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-md dark:shadow-xl flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800 tracking-wide">
        {title}
      </h2>
      <ul className="flex-1 flex flex-col gap-4">
        {assets.map((asset) => (
          <li
            key={asset.ticker}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{asset.ticker}</span>
              <span className={clsx(
                "text-xs font-medium mt-1 uppercase tracking-wider",
                {
                  "text-emerald-600 dark:text-emerald-500": asset.dailyTrend === 'Bullish',
                  "text-rose-600 dark:text-rose-500": asset.dailyTrend === 'Bearish',
                  "text-gray-600 dark:text-gray-500": asset.dailyTrend === 'Ranging',
                }
              )}>
                {asset.dailyTrend}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-lg text-gray-700 dark:text-gray-300">
                {asset.currentPrice}
              </span>
              <div className={clsx(
                "p-2 rounded-lg",
                {
                  "bg-emerald-100 dark:bg-emerald-500/10": asset.dailyTrend === 'Bullish',
                  "bg-rose-100 dark:bg-rose-500/10": asset.dailyTrend === 'Bearish',
                  "bg-gray-100 dark:bg-gray-500/10": asset.dailyTrend === 'Ranging',
                }
              )}>
                <TrendIcon trend={asset.dailyTrend} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MacroDivergenceTracker() {
  return (
    <div className="w-full min-h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent inline-block">
          Macro Divergence Tracker
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-2xl">
          Real-time analysis of cross-asset divergences. Monitor FX majors, equities, and yields for macro-technical confluence and algorithmic traps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AssetList title="FX Majors" assets={mockData.fxMajors} />
        <AssetList title="Equities" assets={mockData.equities} />
        <AssetList title="Yields" assets={mockData.yields} />
      </div>
    </div>
  );
}