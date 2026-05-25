import { createTradeIdea } from '@/app/lib/actions';

export default function CreateTradeIdea() {
  return (
    <div className="w-full flex-col flex text-gray-100 p-2 sm:p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Create New Trade Idea
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-2xl">
          Submit a new setup to your database.
        </p>
      </div>

      <form action={createTradeIdea} className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl flex flex-col gap-6 shadow-lg">
        
        {/* Ticker */}
        <div className="flex flex-col gap-2">
          <label htmlFor="ticker" className="text-sm font-medium text-slate-300">Ticker</label>
          <input 
            type="text" 
            id="ticker" 
            name="ticker" 
            required 
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
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>

        {/* Setup Type */}
        <div className="flex flex-col gap-2">
          <label htmlFor="setup_type" className="text-sm font-medium text-slate-300">Setup Type</label>
          <input 
            type="text" 
            id="setup_type" 
            name="setup_type" 
            required 
            placeholder="e.g., Liquidity Sweep"
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-2">
          <label htmlFor="image_url" className="text-sm font-medium text-slate-300">Image URL (Optional)</label>
          <input 
            type="url" 
            id="image_url" 
            name="image_url" 
            placeholder="https://..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500"
          />
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md"
        >
          Save Trade Idea
        </button>
      </form>
    </div>
  );
}
