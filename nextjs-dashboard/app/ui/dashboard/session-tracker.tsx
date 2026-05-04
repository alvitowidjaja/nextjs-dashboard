'use client';

import { useEffect, useState } from 'react';

export default function SessionTracker() {
  const [session, setSession] = useState<string>('');

  useEffect(() => {
    const updateSession = () => {
      const now = new Date();
      // WIB is UTC+7
      const utcHour = now.getUTCHours();
      const wibHour = (utcHour + 7) % 24;

      // Simplistic Liquidity Session logic based on WIB
      // Asia: 06:00 - 14:00 WIB
      // London: 14:00 - 20:00 WIB
      // New York: 20:00 - 04:00 WIB
      // Sydney/Quiet: 04:00 - 06:00 WIB
      
      if (wibHour >= 6 && wibHour < 14) {
        setSession('Asia');
      } else if (wibHour >= 14 && wibHour < 20) {
        setSession('London');
      } else if (wibHour >= 20 || wibHour < 4) {
        setSession('New York');
      } else {
        setSession('Sydney');
      }
    };

    updateSession();
    // Re-check every minute
    const interval = setInterval(updateSession, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 rounded-full bg-slate-900 px-4 py-1.5 shadow-sm ring-1 ring-slate-800">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
      </span>
      <span className="text-xs font-medium text-slate-100 uppercase tracking-wider">
        {session ? `${session} Session` : 'Calculating...'}
      </span>
    </div>
  );
}
