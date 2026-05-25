'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTradeIdea(formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const direction = formData.get('direction') as string;
  const setup_type = formData.get('setup_type') as string;
  const image_url = formData.get('image_url') as string;

  const data = { ticker, direction, setup_type, image_url };

  await fetch('http://localhost:4000/api/trades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteTradeIdea(id: string | number) {
  await fetch(`http://localhost:4000/api/trades/${id}`, {
    method: 'DELETE',
  });
  revalidatePath('/dashboard/customers');
}

export async function updateTradeIdea(id: string, formData: FormData) {
  const ticker = formData.get('ticker') as string;
  const direction = formData.get('direction') as string;
  const setup_type = formData.get('setup_type') as string;
  const image_url = formData.get('image_url') as string;

  const data = { ticker, direction, setup_type, image_url };

  await fetch(`http://localhost:4000/api/trades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}
