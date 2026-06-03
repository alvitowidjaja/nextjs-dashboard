'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowDownTrayIcon, 
  DocumentArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import SetupAnalyticsChart from '@/components/SetupAnalyticsChart';
import ReactMarkdown from 'react-markdown';

export default function ReportPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Macro Report states
  const [macroReport, setMacroReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Restore AI Macro Report from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedReport = sessionStorage.getItem('macro_technical_report');
      if (savedReport) {
        setMacroReport(savedReport);
      }
    }
  }, []);

  const handleGenerateMacroReport = async () => {
    setGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/macro`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to generate AI macro report');
      }
      const json = await response.json();
      if (json && json.report) {
        setMacroReport(json.report);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('macro_technical_report', json.report);
        }
      } else {
        throw new Error('Invalid response structure from report API');
      }
    } catch (err: any) {
      console.error('Error generating AI Macro Report:', err);
      setGenerationError(err.message || 'Failed to generate Institutional AI Review. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/journal/export`, '_blank');
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ledger`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch ledger data');
      }
      const json = await response.json();
      const data = Array.isArray(json) ? json : (json?.data || []);

      const headers = ['Trade ID', 'Date', 'Ticker', 'Direction', 'Setup Type', 'Entry Price', 'Stop Loss', 'Take Profit', 'Exit Price', 'R:R Ratio', 'Status'];

      const escapeCSVField = (field: any) => {
        const str = field === null || field === undefined ? '' : String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = data.map((trade: any) => {
        const tradeId = trade.id || '';
        let dateVal = '';
        if (trade.created_at) {
          dateVal = new Date(trade.created_at).toISOString();
        }
        const ticker = trade.ticker || '';
        const direction = trade.direction || '';
        const setupType = trade.setupType || trade.setup_type || '';
        const entryPrice = trade.entry_price !== null && trade.entry_price !== undefined ? parseFloat(trade.entry_price).toFixed(5).replace(/\.?0+$/, '') : '';
        const stopLoss = trade.stop_loss !== null && trade.stop_loss !== undefined ? parseFloat(trade.stop_loss).toFixed(5).replace(/\.?0+$/, '') : '';
        const takeProfit = trade.take_profit !== null && trade.take_profit !== undefined ? parseFloat(trade.take_profit).toFixed(5).replace(/\.?0+$/, '') : '';
        const exitPrice = trade.exit_price !== null && trade.exit_price !== undefined ? parseFloat(trade.exit_price).toFixed(5).replace(/\.?0+$/, '') : '';
        const rrRatio = trade.rrRatio || '';
        const status = trade.status || '';

        return [
          escapeCSVField(tradeId),
          escapeCSVField(dateVal),
          escapeCSVField(ticker),
          escapeCSVField(direction),
          escapeCSVField(setupType),
          escapeCSVField(entryPrice),
          escapeCSVField(stopLoss),
          escapeCSVField(takeProfit),
          escapeCSVField(exitPrice),
          escapeCSVField(rrRatio),
          escapeCSVField(status)
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Execution_Ledger.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please try again.');
    }
  };

  useEffect(() => {
    async function fetchTrades() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ledger`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch ledger trades');
        }
        const json = await response.json();
        const data = Array.isArray(json) ? json : (json?.data || []);
        setTrades(data);
      } catch (err) {
        console.error('Error loading ledger data:', err);
        setError('Could not fetch active ledger setup data. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchTrades();
  }, []);

  // Calculate dynamic metrics from fetched trades
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.status === 'Win').length;
  const losses = trades.filter((t) => t.status === 'Loss').length;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

  // Calculate profit factor
  const totalRGained = trades
    .filter((t) => t.status === 'Win')
    .reduce((sum, t) => {
      // Parse RR ratio (e.g. "3.5:1" -> 3.5)
      const ratio = parseFloat(t.rrRatio) || 0;
      return sum + ratio;
    }, 0);

  const profitFactor = losses > 0 ? totalRGained / losses : totalRGained;

  return (
    <div className="flex w-full flex-col min-h-screen text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics & Reports</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Export performance logs, view setup analytics, and manage trading journals.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Weekly Trading Journal (Requested) */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-900/5 dark:ring-slate-700 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Trading Journal</h3>
            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-700/30">
              PDF
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Generate and export a comprehensive PDF document of all your saved trade setups, notes, and metrics from the past week.
          </p>
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Download Weekly PDF
          </button>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 dark:from-blue-900/20 to-transparent opacity-40 blur-2xl pointer-events-none"></div>
        </div>

        {/* Card 2: Performance Summary (Mock statistics for realism) */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-900/5 dark:ring-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance Metrics</h3>
            <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-700/10 dark:ring-emerald-700/30">
              Stats
            </span>
          </div>
          <div className="space-y-4 mb-2">
            <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Trades</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {loading ? '...' : totalTrades}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
              <span className="text-sm font-semibold text-emerald-500">
                {loading ? '...' : `${winRate.toFixed(1)}%`}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Profit Factor</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {loading ? '...' : profitFactor.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 dark:from-emerald-900/20 to-transparent opacity-40 blur-2xl pointer-events-none"></div>
        </div>

        {/* Card 3: Execution Logs (Mock action) */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-900/5 dark:ring-slate-700 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trade Execution Logs</h3>
            <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-900/30 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-700/10 dark:ring-amber-700/30">
              CSV
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Download raw CSV transaction logs containing execution times, slippage, and routing venue details.
          </p>
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export CSV Ledger
          </button>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 dark:from-amber-900/20 to-transparent opacity-40 blur-2xl pointer-events-none"></div>
        </div>

        {/* Card 4: Institutional AI Review */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-900/5 dark:ring-slate-700 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-indigo-500 animate-pulse" />
              Institutional AI Review
            </h3>
            <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-700/30">
              AI Powered
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Analyze recent trading behaviors, win/loss configurations, risk-to-reward ratios, and generate a customized technical optimization strategy.
          </p>
          <button
            onClick={handleGenerateMacroReport}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing executions...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>Generate Institutional AI Review</span>
              </>
            )}
          </button>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 dark:from-indigo-900/20 to-transparent opacity-40 blur-2xl pointer-events-none"></div>
        </div>
      </div>

      {/* AI Report Section */}
      {(macroReport || generating || generationError) && (
        <div className="mt-8 relative overflow-hidden rounded-2xl border border-indigo-500/20 dark:border-indigo-500/30 bg-white dark:bg-slate-900 shadow-[0_4px_25px_rgba(99,102,241,0.08)] transition-all">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-violet-500/10 dark:bg-violet-500/15 blur-3xl pointer-events-none"></div>

          <div className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <SparklesIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Institutional AI Review Report</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Generated in real-time from execution ledger telemetry</p>
              </div>
            </div>
            {macroReport && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(macroReport);
                  alert('Report copied to clipboard!');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-700"
              >
                Copy Report
              </button>
            )}
          </div>

          <div className="p-6 md:p-8">
            {generating && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50 border-t-indigo-600 animate-spin"></div>
                  <SparklesIcon className="w-5 h-5 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Analyzing executions...</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aggregating historical trade metrics, drawdown limits, and win rates</p>
                </div>
              </div>
            )}

            {generationError && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Analysis Generation Failed</h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">{generationError}</p>
                  </div>
                </div>
              </div>
            )}

            {macroReport && !generating && (
              <div className="prose dark:prose-invert max-w-none">
                <div className="space-y-4 text-gray-800 dark:text-gray-200">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b border-gray-150 dark:border-slate-800 pb-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />,
                      p: ({ node, ...props }) => <p className="text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300" {...props} />,
                      li: ({ node, ...props }) => <li className="text-sm pl-1" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-900 p-3 rounded-r-lg" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-slate-850 rounded px-1.5 py-0.5 font-mono text-xs text-red-500 dark:text-red-400" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-x-auto my-4 border border-gray-100 dark:border-slate-800" {...props} />,
                    }}
                  >
                    {macroReport}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Chart Section */}
      <div className="mt-8">
        {loading ? (
          <div className="w-full bg-white dark:bg-[#111e2f] border border-slate-200 dark:border-none rounded-2xl p-5 shadow-sm animate-pulse">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
            <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl"></div>
          </div>
        ) : error ? (
          <div className="w-full bg-red-50 dark:bg-slate-900 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center text-red-600 dark:text-red-400 font-semibold">
            {error}
          </div>
        ) : (
          <SetupAnalyticsChart trades={trades} />
        )}
      </div>
    </div>
  );
}
