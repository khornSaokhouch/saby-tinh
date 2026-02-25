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
    <div className="max-w-7xl mx-auto space-y-10 pb-32 font-sans pt-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-[24px] text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-2xl transition-all group"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hardware Segment Audit</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{category?.name || 'Segment Index'}</h1>
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
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 translate-x-16 -translate-y-16 rounded-full bg-indigo-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-[40px] bg-slate-50 border-[6px] border-white shadow-2xl mx-auto flex items-center justify-center text-4xl font-black text-slate-200 relative z-10 overflow-hidden group-hover:rotate-3 transition-all duration-700 p-2">
                {category?.category_image ? (
                  <Image 
                    src={getCleanImageUrl(category.category_image)} 
                    alt={category.name} 
                    fill 
                    className="object-cover rounded-[32px] p-1" 
                  />
                ) : <Layers size={48} />}
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 relative z-10 mb-2">{category?.name}</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${category?.status === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
               {category?.status === 1 ? 'Active Segment' : 'Inactive Segment'}
            </div>

            <div className="grid grid-cols-1 gap-3 mt-10 relative z-10">
               <InfoRow icon={Package} label="Total Assets" value={products.length} />
               <InfoRow icon={Activity} label="Status" value={category?.status === 1 ? 'Operational' : 'Offline'} highlight={category?.status === 1} />
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <Box size={140} />
             </div>
             <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-4 text-indigo-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">Audit Intelligence</span>
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight">Segment Analysis</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-10">
                  This segment contains {products.length} registered hardware components. All data is synchronized with the master registry.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="block text-[9px] font-black text-slate-500 uppercase mb-1">Density</span>
                     <span className="text-xl font-black">{products.length} Nodes</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: PRODUCT REGISTRY --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Table Controls */}
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Filter segment assets..." 
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                 <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {filteredProducts.length} Results
                 </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto no-scrollbar flex-grow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Asset Detail</th>
                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Store</th>
                    <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {productsLoading ? (
                     <tr><td colSpan="4" className="px-10 py-20 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" size={32} /></td></tr>
                  ) : filteredProducts.length === 0 ? (
                     <tr>
                        <td colSpan="4" className="px-10 py-32 text-center">
                           <div className="flex flex-col items-center gap-4">
                              <Box size={40} className="text-slate-200" />
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No assets found in this segment</p>
                           </div>
                        </td>
                     </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden relative shrink-0">
                               {product.images?.[0]?.image ? (
                                  <Image 
                                    src={getCleanImageUrl(product.images[0].image)} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                  />
                               ) : (
                                  <Package size={20} className="text-slate-300" />
                               )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">ID: #{product.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2">
                              <ShoppingBag size={12} className="text-indigo-500" />
                              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{product.store?.name || 'Central Stock'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900">${parseFloat(product.price).toLocaleString()}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registry Value</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button 
                             onClick={() => router.push(`/admin/products`)}
                             className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                             title="Audit Asset"
                           >
                             <Eye size={18} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit compilation complete</span>
               <div className="flex gap-4">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors px-4 py-2 border border-transparent hover:border-slate-200 rounded-xl">Prev Node</button>
                  <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-6 py-2 bg-white border border-slate-200 rounded-xl shadow-sm active:scale-95 transition-all">Next Node</button>
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
    <div className={`flex items-center gap-4 p-4 rounded-[24px] transition-all ${highlight ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'bg-slate-50/50 border border-transparent'}`}>
       <div className={`p-2.5 rounded-xl bg-white shadow-sm shrink-0 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
         <Icon size={18} strokeWidth={2.5} />
       </div>
       <div className="flex flex-col text-left">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-tight mb-1">{label}</span>
          <span className={`text-sm font-black truncate max-w-[180px] ${highlight ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</span>
       </div>
    </div>
  );
}
