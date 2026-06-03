import { updateTradeIdea } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function EditTradeIdea({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let idea;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades/${id}`, { cache: 'no-store' });
    console.log(response);
    if (!response.ok) {
      if (response.status === 404) return notFound();
      throw new Error('Failed to fetch trade idea');
    }
    const json = await response.json();
    idea = json.data;
  } catch (error) {
    console.error(error);
    return <div className="text-red-500 p-4">Error loading trade idea.</div>;
  }

  if (!idea) {
    return notFound();
  }

  const updateIdeaWithId = updateTradeIdea.bind(null, id);

  return (
    <div className="w-full flex-col flex text-gray-100 p-2 sm:p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Edit Trade Idea
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-2xl">
          Update the details of your trade setup.
        </p>
      </div>

      <form action={updateIdeaWithId} className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl flex flex-col gap-6 shadow-lg">

        {/* Ticker */}
        <div className="flex flex-col gap-2">
          <label htmlFor="ticker" className="text-sm font-medium text-slate-300">Ticker</label>
          <input
            type="text"
            id="ticker"
            name="ticker"
            required
            defaultValue={idea.ticker}
            placeholder="e.g., XAUUSD"
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
          />
        </div>

        {/* Direction */}
        <div className="flex flex-col gap-2">
          <label htmlFor="direction" className="text-sm font-medium text-slate-300">Direction</label>
          <select
            id="direction"
            name="direction"
            required
            defaultValue={idea.direction}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>

        {/* Setup Type */}
        <div className="flex flex-col gap-2">
          <label htmlFor="setup_type" className="text-sm font-medium text-slate-300">Setup Type</label>
          <select
            id="setup_type"
            name="setup_type"
            required
            defaultValue={idea.setup_type}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" disabled>Select Setup Type</option>
            <option value="Liquidity Sweep">Liquidity Sweep</option>
            <option value="Algo Trap">Algo Trap</option>
            <option value="Macro Divergence">Macro Divergence</option>
            <option value="Order Block Mitigation">Order Block Mitigation</option>
            <option value="Fair Value Gap">Fair Value Gap</option>
            <option value="Change of Character">Change of Character</option>
            <option value="Macro Catalyst">Macro Catalyst</option>
          </select>
        </div>

        {/* Price Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="entry_price" className="text-sm font-medium text-slate-300">Entry Price</label>
            <input
              type="number"
              step="0.00001"
              id="entry_price"
              name="entry_price"
              defaultValue={idea.entry_price || ''}
              placeholder="0.00000"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="stop_loss" className="text-sm font-medium text-slate-300">Stop Loss</label>
            <input
              type="number"
              step="0.00001"
              id="stop_loss"
              name="stop_loss"
              defaultValue={idea.stop_loss || ''}
              placeholder="0.00000"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="take_profit" className="text-sm font-medium text-slate-300">Take Profit</label>
            <input
              type="number"
              step="0.00001"
              id="take_profit"
              name="take_profit"
              defaultValue={idea.take_profit || ''}
              placeholder="0.00000"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-2">
          <label htmlFor="image_url" className="text-sm font-medium text-slate-300">Image URL (Optional)</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            defaultValue={idea.image_url || ''}
            placeholder="https://..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md"
        >
          Update Idea
        </button>
      </form>
    </div>
  );
}
