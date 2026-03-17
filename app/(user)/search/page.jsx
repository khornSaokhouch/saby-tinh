"use client"
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Sparkles, Store, LayoutGrid, ArrowRight, Loader2, Package, Inbox, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/app/stores/useSearchStore';
import ProductCard from '@/app/components/card/ProductCard';
import Link from 'next/link';

const slugify = (text) => text?.toString().toLowerCase().trim()
  .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') || "";

// Compact Header Helper
function CompactSectionHeader({ title, subtitle, icon: Icon, color, count }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${color} shadow-sm`}>
                    <Icon size={16} strokeWidth={2.5} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h2>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{count}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryParam = searchParams.get('q') || '';
    
    const { results, loading, performSearch, query } = useSearchStore();
    const [localQuery, setLocalQuery] = useState(queryParam);

    useEffect(() => {
        if (queryParam) {
            setLocalQuery(queryParam);
            performSearch(queryParam);
        }
    }, [queryParam, performSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(localQuery)}`);
            performSearch(localQuery);
        }
    };

    const hasResults = results.products.length > 0 || results.stores.length > 0 || results.categories.length > 0;

    return (
        <div className="min-h-screen">
            {/* COMPACT SEARCH CONSOLE */}
            <div className="max-w-[1400px] mx-auto px-4 mb-10">
                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="max-w-md">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Search Results</span>
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl font-[1000] text-slate-900 tracking-tight leading-none uppercase">
                                Global <span className="text-indigo-600">Search</span>
                            </h1>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="w-full max-w-lg relative group">
                            <input 
                                type="text" 
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                placeholder="Search products, stores, categories..."
                                className="w-full h-12 pl-12 pr-28 bg-slate-50 border border-slate-200 focus:border-indigo-500/30 focus:bg-white rounded-xl text-xs font-bold text-slate-900 transition-all outline-none"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Explore"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* RESULTS SECTION - Condensed Spacing */}
            <div className="max-w-[1400px] mx-auto px-4 pb-20 space-y-12">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <p className="mt-4 text-slate-400 font-bold tracking-widest uppercase text-[9px]">Searching for results...</p>
                        </div>
                    ) : !query && !queryParam ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Search className="w-8 h-8 text-slate-200 mb-4" />
                            <h2 className="text-lg font-black text-slate-400 uppercase tracking-tight">Enter a keyword to begin</h2>
                        </div>
                    ) : !hasResults ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Inbox className="w-8 h-8 text-rose-300 mb-4" />
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Matches</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Try a different search term</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            
                            {/* COMPACT CATEGORIES */}
                            {results.categories.length > 0 && (
                                <section>
                                    <CompactSectionHeader title="Categories" subtitle="Matched categories" icon={LayoutGrid} color="text-indigo-600 bg-indigo-50" count={results.categories.length} />
                                    <div className="flex flex-wrap gap-2">
                                        {results.categories.map(cat => (
                                            <Link 
                                                key={cat.id} 
                                                href={`/category/${slugify(cat.name)}`}
                                                className="group flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all shadow-sm"
                                            >
                                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                    {cat.category_image && <img src={cat.category_image} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{cat.name}</span>
                                                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* COMPACT STORES */}
                            {results.stores.length > 0 && (
                                <section>
                                    <CompactSectionHeader title="Verified Stores" subtitle="Matched stores" icon={Store} color="text-cyan-500 bg-cyan-50" count={results.stores.length} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {results.stores.map(store => (
                                            <Link 
                                                key={store.id} 
                                                href={`/store/${slugify(store.name)}`}
                                                className="group bg-white border border-slate-200 p-3 rounded-2xl hover:border-cyan-500 transition-all flex items-center gap-3 shadow-sm"
                                            >
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                                    {store.store_image ? <img src={store.store_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-cyan-600 bg-cyan-50 font-black text-sm">{store.name[0]}</div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[12px] font-black text-slate-900 truncate uppercase tracking-tight">{store.name}</h3>
                                                    <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Official Store</span>
                                                </div>
                                                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* COMPACT PRODUCTS */}
                            {results.products.length > 0 && (
                                <section>
                                    <CompactSectionHeader title="Products" subtitle="Top matched items" icon={Package} color="text-slate-900 bg-slate-100" count={results.products.length} />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
                                        {results.products.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
