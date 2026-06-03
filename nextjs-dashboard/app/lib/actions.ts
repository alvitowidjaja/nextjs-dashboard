'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTradeIdea(formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const direction = formData.get('direction') as string;
  const setup_type = formData.get('setup_type') as string;
  const image_url = formData.get('image_url') as string;
  const entry_price = formData.get('entry_price') as string;
  const stop_loss = formData.get('stop_loss') as string;
  const take_profit = formData.get('take_profit') as string;

  const data = { ticker, direction, setup_type, image_url, entry_price, stop_loss, take_profit };

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteTradeIdea(id: string | number) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades/${id}`, {
    method: 'DELETE',
  });
  revalidatePath('/dashboard/customers');
}

export async function updateTradeIdea(id: string, formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const direction = formData.get('direction') as string;
  const setup_type = formData.get('setup_type') as string;
  const image_url = formData.get('image_url') as string;
  const entry_price = formData.get('entry_price') as string;
  const stop_loss = formData.get('stop_loss') as string;
  const take_profit = formData.get('take_profit') as string;

  const data = { ticker, direction, setup_type, image_url, entry_price, stop_loss, take_profit };

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}
