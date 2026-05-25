import { clsx } from 'clsx';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import PricingWidget from '@/app/ui/PricingWidget';
import { deleteTradeIdea } from '@/app/lib/actions';

type IdeaStatus = 'Active' | 'Played Out' | 'Invalidated';
type Direction = 'Long' | 'Short';

interface Idea {
  id: string;
  ticker: string;
  direction: Direction;
  title?: string;
  setup_type: string;
  status?: IdeaStatus;
  created_at: string;
  image_url?: string;
}

function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-colors duration-200 relative">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        <Link 
          href={`/dashboard/customers/${idea.id}/edit`}
          className="text-slate-500 hover:text-blue-500 text-sm transition-colors bg-slate-900/80 rounded-full w-6 h-6 flex items-center justify-center font-bold"
          title="Edit Idea"
        >
          ✎
        </Link>
        <form action={deleteTradeIdea.bind(null, idea.id)}>
          <button type="submit" className="text-slate-500 hover:text-red-500 text-sm transition-colors bg-slate-900/80 rounded-full w-6 h-6 flex items-center justify-center font-bold" title="Delete Idea">
            ✕
          </button>
        </form>
      </div>
      {/* Chart Placeholder Image Area */}
      <div className="w-full aspect-video bg-slate-800 flex flex-col items-center justify-center text-slate-500 relative group">
        {idea.image_url ? (
          <img src={idea.image_url} alt={idea.title || idea.ticker} className="w-full h-full object-cover" />
        ) : (
          <>
            <ChartBarIcon className="w-10 h-10 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm font-medium tracking-wide">Chart Placeholder</span>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header Row: Ticker & Direction */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-slate-100 tracking-tight">{idea.ticker}</span>
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider border",
              {
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20": idea.direction === 'Long',
                "bg-rose-500/10 text-rose-400 border-rose-500/20": idea.direction === 'Short',
              }
            )}
          >
            {idea.direction === 'Long' ? (
              <ArrowTrendingUpIcon className="w-3.5 h-3.5 stroke-2" />
            ) : (
              <ArrowTrendingDownIcon className="w-3.5 h-3.5 stroke-2" />
            )}
            {idea.direction}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-200 leading-snug">
          {idea.title || `${idea.direction} on ${idea.ticker}`}
        </h3>

        {/* Bottom Metadata */}
        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {idea.setup_type}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">
              {idea.created_at ? new Date(idea.created_at).toLocaleDateString() : 'Just now'}
            </span>
            <span
              className={clsx("w-2 h-2 rounded-full", {
                "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]": idea.status === 'Active' || !idea.status,
                "bg-emerald-500": idea.status === 'Played Out',
                "bg-rose-500": idea.status === 'Invalidated',
              })}
              title={`Status: ${idea.status || 'Active'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TradeIdeasFeed() {
  let ideas: any[] = [];
  let isIdeasError = false;

  try {
    const response = await fetch('http://localhost:4000/api/trades', { cache: 'no-store' });
    console.log(response);
    const json = await response.json();
    ideas = json.data;
  } catch (error) {
    isIdeasError = true;
    console.error(error);
  }

  return (
    <div className="w-full flex-col flex text-gray-100 p-2 sm:p-4">
      {/* Live Pricing Widget */}
      <PricingWidget />

      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Trade Ideas Feed
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Track and review potential setups, chart annotations, and ongoing market hypotheses.
          </p>
        </div>
        <Link
          href="/dashboard/customers/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">+ Add New Idea</span>
          <span className="md:hidden">+ Add</span>
        </Link>
      </div>

      {/* CSS Grid Layout */}
      {isIdeasError ? (
        <div className="text-red-500 bg-red-900/20 p-4 rounded-md">Trade Ideas feed is currently unavailable.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas?.map((idea: any) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}