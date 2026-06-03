"use server";

import { revalidatePath } from 'next/cache';
import { TradeDirection } from '@/app/lib/trade-data';

export async function createTrade(formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const setupType = formData.get('setupType') as string;
  const direction = formData.get('direction') as TradeDirection;
  const entry_price = formData.get('entry_price') as string;
  const stop_loss = formData.get('stop_loss') as string;
  const take_profit = formData.get('take_profit') as string;
  const exit_price = formData.get('exit_price') as string;

  console.log("🚨 INCOMING DATA FOR DB:", { 
    ticker, 
    setupType, 
    direction, 
    entry_price, 
    stop_loss, 
    take_profit, 
    exit_price 
  });

  try {
    const res = await fetch('http://localhost:4000/api/ledger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker,
        setupType,
        direction,
        entry_price,
        stop_loss,
        take_profit,
        exit_price,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create trade: ${res.statusText}`);
    }
  } catch (error) {
    console.error('Error creating trade in database:', error);
  }

  revalidatePath('/dashboard/invoices');
}

export async function deleteTradeFromJSON(tradeId: string) {
  console.log("🚨 DELETING DATA FROM DB:", tradeId);

  try {
    const res = await fetch(`http://localhost:4000/api/ledger/${tradeId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Failed to delete trade: ${res.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting trade in database:', error);
  }

  revalidatePath('/dashboard/invoices');
}