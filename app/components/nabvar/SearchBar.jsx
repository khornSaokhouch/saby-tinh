import { Search } from 'lucide-react';

export default function SearchBar({ isScrolled }) {
  return (
    <div className={`hidden md:flex items-center transition-all duration-500 ${isScrolled ? 'flex-1 max-w-xs' : 'flex-1 max-w-md'}`}>
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Quick registry search..."
          className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-full text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all outline-none text-slate-600"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-400">
          <span>⌘</span><span>K</span>
        </div>
      </div>
    </div>
  );
}