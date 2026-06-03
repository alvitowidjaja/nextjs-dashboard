'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, IChartApi, UTCTimestamp } from 'lightweight-charts';
import { Clock, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';

export function TradingTerminal() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const lastCandleRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { resolvedTheme } = useTheme();

  // State for Institutional Data
  const [marketData, setMarketData] = useState({
    symbol: "XAUUSD",
    price: 4814.45,
    proximity: "83.3%",
    sentiment: "Neutral-Bearish",
    zone: "SUPPLY"
  });

  // 1. Live Clock Logic (Jakarta/WIB)
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Charting Engine and WebSocket Connection (v5 Standard)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // We start with dark mode as default for initial render if resolvedTheme is not yet available
    const isDark = resolvedTheme !== 'light';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#94a3b8' : '#475569',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)' },
        horzLines: { color: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      timeScale: { borderColor: isDark ? '#334155' : '#cbd5e1' },
    });

    chartRef.current = chart;

    // Modular v5 Series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00b894',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#00b894',
      wickDownColor: '#ef4444',
    });

    seriesRef.current = candlestickSeries;

    let socket: WebSocket | null = null;

    const loadHistoryAndConnect = async () => {
      try {
        // Fetch real historical data from local Express API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history`);
        if (!response.ok) {
          throw new Error(`Failed to fetch history: ${response.status}`);
        }
        const historicalData = await response.json();

        if (Array.isArray(historicalData) && historicalData.length > 0) {
          // Pass the real historical array directly into candlestickSeries.setData()
          candlestickSeries.setData(historicalData);

          // Adjust initial zoom level and scroll to real time
          chart.timeScale().setVisibleLogicalRange({
            from: historicalData.length - 40,
            to: historicalData.length,
          });
          chart.timeScale().scrollToRealTime();

          // Extract the very last object from the fetched array to initialize useRef memory block
          const lastItem = historicalData[historicalData.length - 1];
          lastCandleRef.current = { ...lastItem };

          // Only after historical data is loaded and memory is initialized, open the WebSocket connection
          socket = new WebSocket('ws://localhost:4000');

          socket.onmessage = (event) => {
            try {
              const tick = JSON.parse(event.data);
              if (tick.symbol === 'XAU/USD' && tick.price) {
                const price = parseFloat(tick.price);
                if (isNaN(price)) return;

                // Update header price
                setMarketData((prev) => ({
                  ...prev,
                  price: price,
                }));

                // Calculate current UNIX time in seconds
                const currentUnixSeconds = Math.floor(Date.now() / 1000);

                // Calculate Current Interval Boundary (nearest 15-minute block)
                const intervalBoundary = Math.floor(currentUnixSeconds / 900) * 900 as UTCTimestamp;

                // Debugging console.log for 15-minute intervals
                if (lastCandleRef.current) {
                  console.log(`[15M] Boundary: ${intervalBoundary} | Memory: ${lastCandleRef.current.time} | Difference: ${intervalBoundary - lastCandleRef.current.time}`);

                  // Compare against the time property of the lastCandleRef
                  if (intervalBoundary === lastCandleRef.current.time) {
                    // Mutation Path (Same Interval)
                    lastCandleRef.current.close = price;
                    if (price > lastCandleRef.current.high) {
                      lastCandleRef.current.high = price;
                    }
                    if (price < lastCandleRef.current.low) {
                      lastCandleRef.current.low = price;
                    }
                  } else if (intervalBoundary > lastCandleRef.current.time) {
                    // Generation Path (New Interval)
                    const newCandle = {
                      time: intervalBoundary,
                      open: price,
                      high: price,
                      low: price,
                      close: price,
                    };
                    lastCandleRef.current = newCandle;
                  }

                  // Use the charting library's native .update() method to modify/append the right-most candle
                  candlestickSeries.update(lastCandleRef.current);
                }
              }
            } catch (error) {
              console.error('Error handling WebSocket tick:', error);
            }
          };

          socket.onerror = (err) => {
            console.error('Terminal WebSocket Error:', err);
          };
        }
      } catch (error) {
        console.error('Error loading history or starting stream:', error);
      }
    };

    loadHistoryAndConnect();

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 0 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // 3. Update Chart Theme Dynamically
  useEffect(() => {
    if (chartRef.current) {
      const isDark = resolvedTheme !== 'light';
      chartRef.current.applyOptions({
        layout: {
          textColor: isDark ? '#94a3b8' : '#475569',
        },
        grid: {
          vertLines: { color: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)' },
          horzLines: { color: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)' },
        },
        timeScale: {
          borderColor: isDark ? '#334155' : '#cbd5e1'
        },
      });
    }
  }, [resolvedTheme]);

  const timeString = currentTime
    ? currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: true }) + ' WIB'
    : '--:--:-- -- WIB';

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl transition-colors">
      {/* Header Section */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Execution Terminal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional Proximity: <span className="text-blue-600 dark:text-blue-400 font-mono">{marketData.proximity}</span> |
            Sentiment: <span className="text-red-600 dark:text-red-400 font-mono">{marketData.sentiment}</span>
          </p>
        </div>

        <div className="flex gap-8 text-right font-mono">
          <div>
            <p className="text-[10px] uppercase text-slate-500">Symbol</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{marketData.symbol}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">Price</p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">${marketData.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">Zone</p>
            <p className="text-sm font-bold text-red-600 dark:text-red-500">{marketData.zone}</p>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 p-4 transition-colors">
        {/* Session / Clock Row */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-inner transition-colors">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{timeString}</span>
            </div>
            {/* Session Visualizer */}
            <div className="hidden sm:flex h-1.5 w-48 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="w-1/3 bg-blue-500/50" title="Asia" />
              <div className="w-1/3 bg-green-500" title="London" />
              <div className="w-1/3 bg-slate-300 dark:bg-slate-700" title="NY" />
            </div>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 uppercase transition-colors">LDN (Open)</span>
          </div>
        </div>

        {/* The Chart Container */}
        <div ref={chartContainerRef} className="w-full" />
      </div>
    </div>
  );
}