"use server";

import { revalidatePath } from 'next/cache';
import { Trade, TradeDirection, getTrades, saveTrades } from '@/app/lib/trade-data';

export async function createTrade(formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const setupType = formData.get('setupType') as string;
  const direction = formData.get('direction') as TradeDirection;

  console.log("🚨 INCOMING DATA:", { ticker, setupType, direction });

  const newTrade: Trade = {
    id: `TRD-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split('T')[0],
    ticker,
    direction,
    setupType,
    rrRatio: (Math.random() * 3 + 1).toFixed(1) + ':1',
    status: Math.random() > 0.5 ? 'Win' : 'Loss',
  };

  const trades = await getTrades();
  trades.unshift(newTrade);
  await saveTrades(trades);

  revalidatePath('/dashboard/invoices');
}

export async function deleteTradeFromJSON(tradeId: string) {
  const trades = await getTrades();
  const filteredTrades = trades.filter((trade) => trade.id !== tradeId);
  await saveTrades(filteredTrades);
  revalidatePath('/dashboard/invoices');
}