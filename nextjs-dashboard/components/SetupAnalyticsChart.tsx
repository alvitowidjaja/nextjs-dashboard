'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface Trade {
  id?: string | number;
  setup_type?: string;
  setupType?: string; // fallback from database mapping
  status?: string; // 'Win' | 'Loss'
  [key: string]: any;
}

interface SetupAnalyticsChartProps {
  trades: Trade[];
}

interface GroupedSetupData {
  setupType: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// Utility function to transform raw trades list to grouped chart data
export function transformTradeData(trades: Trade[]): GroupedSetupData[] {
  if (!Array.isArray(trades)) return [];

  const groups: Record<string, { wins: number; losses: number; total: number }> = {};

  trades.forEach((trade) => {
    // Group by setupType (fallback to setup_type or Uncategorized)
    const rawType = trade.setupType || trade.setup_type;
    const typeKey = rawType && rawType.trim() !== '' ? rawType : 'Uncategorized';

    if (!groups[typeKey]) {
      groups[typeKey] = { wins: 0, losses: 0, total: 0 };
    }

    groups[typeKey].total += 1;

    // Match exact PostgreSQL strings ('Win' / 'Loss')
    if (trade.status === 'Win') {
      groups[typeKey].wins += 1;
    } else if (trade.status === 'Loss') {
      groups[typeKey].losses += 1;
    }
  });

  return Object.keys(groups).map((key) => {
    const { wins, losses, total } = groups[key];
    const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
    return {
      setupType: key,
      wins,
      losses,
      total,
      winRate,
    };
  });
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';
  if (active && payload && payload.length) {
    const data = payload[0].payload as GroupedSetupData;
    return (
      <div className="bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-xl shadow-2xl backdrop-blur-sm min-w-[200px]">
        <p className="text-sm font-semibold border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 tracking-wide text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <div className="space-y-1.5 text-xs font-medium">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Wins:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{data.wins}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Losses:</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">{data.losses}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-1.5 mt-1.5">
            <span className="text-slate-500 dark:text-slate-400">Total Trades:</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold font-mono">{data.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Win Rate:</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
              {data.winRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function SetupAnalyticsChart({ trades }: SetupAnalyticsChartProps) {
  const chartData = transformTradeData(trades);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme !== 'light';

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] bg-slate-50 dark:bg-[#111e2f]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
        <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">No setup data found</span>
        <p className="text-xs text-slate-600 dark:text-slate-500 max-w-xs">
          Add new trade executions with statuses of 'Win' or 'Loss' to generate metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#111e2f] border border-slate-200 dark:border-none rounded-2xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Institutional Setup Performance</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Win/Loss analytics grouped by setup type. Track performance based directly on real execution records.
        </p>
      </div>

      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#334155" : "#e2e8f0"}
              opacity={0.3}
            />
            <XAxis
              dataKey="setupType"
              stroke={isDark ? "#64748b" : "#475569"}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#475569"}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-5}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(51, 65, 85, 0.15)' : 'rgba(203, 213, 225, 0.25)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#475569' }}
            />
            <Bar
              name="Wins"
              dataKey="wins"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              name="Losses"
              dataKey="losses"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}