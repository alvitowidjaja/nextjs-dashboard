import React from 'react';

interface PricingData {
  session: string;
  ticker: string;
  price: string;
  spread: string;
}

export default async function PricingWidget() {
  let prices: PricingData[] = [];
  let isError = false;

  try {
    const response = await fetch('http://localhost:4000/api/prices', { cache: 'no-store' });
    if (!response.ok) throw new Error('API Error');
    const json = await response.json();
    prices = json.data;
  } catch (error) {
    isError = true;
    console.error(error);
  }

  if (isError) return (<div className="w-full bg-slate-900 border border-red-900 rounded-lg p-6 mb-8 text-center text-red-500 font-bold">⚠️ Live Pricing Engine is currently offline.</div>);

  return (
    <div className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-4 mb-8 shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-slate-200">Live Market Pricing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices?.map((item) => (
          <div key={item.ticker} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-lg tracking-tight">{item.ticker}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {item.session}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xl font-mono font-medium text-emerald-400">{item.price}</span>
              <span className="text-xs text-slate-400 font-medium">Spread: {item.spread}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
