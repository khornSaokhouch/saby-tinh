"use client";

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ isScrolled, showOnMobile = false }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`${showOnMobile ? 'flex' : 'hidden md:flex'} items-center transition-all duration-500 ${isScrolled ? 'flex-1 max-w-xs' : 'flex-1 max-w-md'}`}
    >
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick search..."
          className="w-full pl-9 pr-12 py-2 bg-slate-100/50 border border-transparent rounded-full text-[13px] hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all text-slate-900 placeholder:text-slate-400 font-medium outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-400">
          <span>⌘</span><span>K</span>
        </div>
      </div>
    </form>
  );
}