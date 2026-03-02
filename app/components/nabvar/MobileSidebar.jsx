'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, LogOut 
} from 'lucide-react';
import { slugify } from './utils';
import SearchBar from './SearchBar';

export default function MobileSidebar({ isOpen, onClose, userProfile, categories, brands }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[150]" 
          />

          {/* Sidebar Panel */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[160] shadow-2xl p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">S</span>
                </div>
                <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">SABY-TINH</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

              {/* Content Scroll Area */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2">
              <div className="px-2">
                <SearchBar showOnMobile={true} />
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Shop Categories</p>
                <div className="grid grid-cols-2 gap-2 mb-6 overscroll-contain">
                  {categories?.map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/category/${slugify(cat.name)}`} 
                      onClick={onClose} 
                      className="p-4 text-[11px] font-bold bg-gray-50 rounded-2xl text-gray-600 text-center active:bg-blue-600 active:text-white transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-2">Top Brands</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-6">
                {brands?.map(brand => (
                  <Link 
                    key={brand.id} 
                    href={`/brand/${slugify(brand.name)}`} 
                    onClick={onClose} 
                    className="p-2 text-[10px] font-bold bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-center"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer / Auth */}
            <div className="mt-auto pt-6">
              {!userProfile ? (
                <Link 
                  href="/auth/login" 
                  onClick={onClose}
                  className="block w-full text-center py-4 bg-blue-600 text-white font-medium rounded-2xl shadow-xl"
                >
                  Get Started
                </Link>
              ) : (
                <button className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

