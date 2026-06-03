import fs from 'fs/promises';
import path from 'path';

export type TradeStatus = 'Win' | 'Loss';
export type TradeDirection = 'Long' | 'Short' | 'Hedge' | 'Scale In' | 'Partial Exit' | 'Flat / Cash';

export interface Trade {
  id: string;
  date: string;
  ticker: string;
  direction: TradeDirection;
  setupType: string;
  rrRatio: string;
  status: TradeStatus;
  entry_price?: number | string | null;
  stop_loss?: number | string | null;
  take_profit?: number | string | null;
  exit_price?: number | string | null;
}

export async function getTrades(): Promise<Trade[]> {
  const filePath = path.join(process.cwd(), 'app', 'lib', 'trade-data.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as Trade[];
  } catch (error) {
    console.error("Failed to read trade data:", error);
    return [];
  }
}

export async function saveTrades(trades: Trade[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'app', 'lib', 'trade-data.json');
  await fs.writeFile(filePath, JSON.stringify(trades, null, 2), 'utf8');
}
