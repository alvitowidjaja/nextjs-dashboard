"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParam('query', term);
  }, 300);

  const selectClasses = "block w-full sm:w-auto rounded-md border border-gray-200 py-[9px] pl-4 pr-8 text-sm outline-2 bg-white text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors";

  return (
    <div className="mb-6 flex flex-col xl:flex-row gap-4">
      <div className="relative w-full max-w-md flex-1">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500 bg-white text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          placeholder="Search trades..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <select
          className={selectClasses}
          onChange={(e) => updateParam('direction', e.target.value)}
          defaultValue={searchParams.get('direction')?.toString() || ''}
        >
          <option value="">All Directions</option>
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </select>

        <select
          className={selectClasses}
          onChange={(e) => updateParam('setupType', e.target.value)}
          defaultValue={searchParams.get('setupType')?.toString() || ''}
        >
          <option value="">All Setups</option>
          <option value="Liquidity Sweep">Liquidity Sweep</option>
          <option value="Algo Trap">Algo Trap</option>
          <option value="Macro Divergence">Macro Divergence</option>
          <option value="Order Block Mitigation">Order Block Mitigation</option>
          <option value="Fair Value Gap">Fair Value Gap</option>
          <option value="Change of Character">Change of Character</option>
          <option value="Macro Catalyst">Macro Catalyst</option>
        </select>

        <select
          className={selectClasses}
          onChange={(e) => updateParam('status', e.target.value)}
          defaultValue={searchParams.get('status')?.toString() || ''}
        >
          <option value="">All Statuses</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
        </select>
      </div>
    </div>
  );
}
