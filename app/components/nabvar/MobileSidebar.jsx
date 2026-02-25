'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, MessageCircle, Heart, 
  ShoppingCart, LogOut 
} from 'lucide-react';
import { slugify } from './utils';

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
              <span className="text-xl font-black text-blue-600 uppercase tracking-tighter">TECHNOCORE</span>
              <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-2">
              {userProfile && (
                <div className="bg-blue-50/50 rounded-3xl p-4 mb-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 px-2">Account</p>
                  <MobileMenuItem icon={User} label="My Profile" href="/profile" onClick={onClose} />
                  <MobileMenuItem icon={MessageCircle} label="Messages" href="/chat" onClick={onClose} />
                  <MobileMenuItem icon={Heart} label="Favorites" href="/favorites" onClick={onClose} />
                  <MobileMenuItem icon={ShoppingCart} label="Cart" href="/shopping-cart" onClick={onClose} />
                </div>
              )}
              
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-2">Shop Categories</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {categories?.slice(0, 4).map(cat => (
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

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-2">Top Brands</p>
              <div className="grid grid-cols-3 gap-2">
                {brands?.slice(0, 6).map(brand => (
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

function MobileMenuItem({ icon: Icon, label, href, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white group transition-all border border-transparent hover:border-gray-100"
    >
      <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
    </Link>
  );
}