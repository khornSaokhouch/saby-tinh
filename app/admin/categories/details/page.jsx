'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Layers, Package, Info, Search, Filter, 
  ArrowLeft, ExternalLink, Tag, Activity,
  ChevronRight, ArrowUpRight, ShieldCheck,
  ShoppingBag, Globe, Loader2, Box, Eye
} from 'lucide-react';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { getCleanImageUrl } from '@/components/nabvar/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

function CategoryDetailsContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const router = useRouter();
  
  const { products, fetchProductsByCategory, loading: productsLoading } = useProductStore();
  const { categories, fetchCategories, loading: categoryLoading } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId);
      if (categories.length === 0) {
        fetchCategories();
      }
    }
  }, [categoryId, fetchProductsByCategory, fetchCategories, categories.length]);

  const category = useMemo(() => 
    categories.find(c => String(c.id) === categoryId), 
    [categories, categoryId]
  );

  const filteredProducts = useMemo(() => 
    products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id).includes(searchTerm)
    ),
    [products, searchTerm]
  );

  if (categoryLoading && categories.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Accessing Data Stream</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compiling category index...</p>
        </div>
      </div>
    );
  }

  if (!category && !categoryLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-20 font-sans">
        <div className="bg-white p-12 rounded-[48px] border border-slate-100 text-center shadow-sm">
          <Layers className="mx-auto text-slate-100 mb-8" size={80} />
          <h2 className="text-3xl font-black text-slate-900 mb-3">Void Detected</h2>
          <p className="text-slate-500 font-medium mb-12 text-balance">The category identifier requested does not correspond to an active hardware segment.</p>
          <button onClick={() => router.push('/admin/categories')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto shadow-xl hover:bg-indigo-600 transition-all">
            <ArrowLeft size={16} /> Return to Architecture
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Hardware Segment Audit</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {category?.name?.split(' ').map((word, i) => (
                <span key={i} className={i === (category?.name?.split(' ').length || 0) - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-2 pr-6 border border-white rounded-[28px] shadow-sm">
           <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <Layers size={18} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Segment ID</span>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-0.5">#{categoryId?.padStart(4, '0')}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- SIDEBAR --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-blue-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-4 border-white shadow-xl mx-auto flex items-center justify-center text-3xl font-black text-slate-200 relative z-10 overflow-hidden group-hover:rotate-2 transition-all p-1">
                {category?.category_image ? (
                  <Image 
                    src={getCleanImageUrl(category.category_image)} 
                    alt={category.name} 
                    fill 
                    className="object-cover rounded-[24px]" 
                  />
                ) : <Layers size={32} />}
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 relative z-10 tracking-tight">{category?.name}</h3>
            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${category?.status === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
               {category?.status === 1 ? 'Operational Node' : 'Suspended Node'}
            </div>

            <div className="grid grid-cols-1 gap-2 mt-8 relative z-10">
               <InfoRow icon={Package} label="Node Assets" value={products.length} highlight />
               <InfoRow icon={Activity} label="Stream Status" value={category?.status === 1 ? 'Active Link' : 'Offline'} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <ShieldCheck size={100} />
             </div>
             <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-3 text-blue-200/80">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Audit Intelligence</span>
                </div>
                <h3 className="text-lg font-black mb-3 leading-tight tracking-tight text-white/95">Segment Analysis</h3>
                <p className="text-[10px] text-blue-100/60 leading-relaxed font-bold mb-8">
                  This segment contains {products.length} registered hardware components. All data is synchronized with the master registry.
                </p>
                <div className="space-y-3">
                   <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                      <span className="block text-[8px] font-black text-blue-300 uppercase tracking-widest mb-1.5 leading-none">Node Density</span>
                      <span className="text-2xl font-black tracking-tighter leading-none">{products.length} Nodes</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: PRODUCT REGISTRY --- */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            
            {/* Table Controls */}
            <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
              <div className="relative w-full sm:max-w-xs group text-left">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter segment assets..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-bold focus:border-blue-100 transition-all outline-none placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                 <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100/50">
                    {filteredProducts.length} Results Found
                 </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto no-scrollbar flex-grow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Identity</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Store Node</th>
                    <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {productsLoading ? (
                     <tr>
                       <td colSpan="4" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scanning Catalog...</p>
                          </div>
                       </td>
                     </tr>
                  ) : filteredProducts.length === 0 ? (
                     <tr>
                        <td colSpan="4" className="px-6 py-20 text-center">
                           <div className="flex flex-col items-center gap-3 text-slate-200">
                              <Box size={32} />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No nodes match your filter</p>
                           </div>
                        </td>
                     </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-slate-50/20 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-white shadow-sm overflow-hidden relative shrink-0">
                               {product.images?.[0]?.image ? (
                                  <Image 
                                    src={getCleanImageUrl(product.images[0].image)} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                  />
                               ) : (
                                  <Package size={16} className="text-slate-300" />
                               )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight uppercase leading-none mb-1">{product.name}</span>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">Node ID: #{product.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                           <div className="flex items-center gap-2">
                              <ShoppingBag size={10} className="text-blue-500" />
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">{product.store?.name || 'Global Stock'}</span>
                           </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-900 leading-none mb-0.5">${parseFloat(product.price).toLocaleString()}</span>
                             <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Unit Credit</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                           <button 
                             onClick={() => router.push(`/admin/products`)}
                             className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-100 transition-all hover:bg-blue-50"
                             title="Audit Asset"
                           >
                             <ArrowUpRight size={14} strokeWidth={2.5} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
               <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-2">Node scan complete</span>
               <div className="flex gap-1.5">
                  <button className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white transition-all hover:text-slate-900">Prev</button>
                  <button className="text-[8px] font-black text-slate-900 uppercase tracking-widest px-4 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm active:scale-95 transition-all hover:border-slate-300">Next</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailsPage() {
  return (
    <Suspense fallback={
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Category</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preparing data stream...</p>
        </div>
      </div>
    }>
      <CategoryDetailsContent />
    </Suspense>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${highlight ? 'bg-blue-50/50 border border-blue-100 shadow-sm' : 'border border-transparent bg-slate-50/50'}`}>
       <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${highlight ? 'text-blue-600' : 'text-slate-400'}`}>
         <Icon size={12} strokeWidth={3} />
       </div>
       <div className="flex flex-col text-left overflow-hidden min-w-0">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{label}</span>
          <span className={`text-[10px] font-black truncate ${highlight ? 'text-blue-600' : 'text-slate-700'}`}>{value}</span>
       </div>
    </div>
  );
}
