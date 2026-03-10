'use client';

import { useState } from 'react';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import OwnerNavbar from '@/components/owner/OwnerNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function OwnerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <OwnerSidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[60] w-56 shadow-2xl lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-3 top-5 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>

                <OwnerSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar (fixed in layout, not scrolling) */}
        <div className="sticky top-0 z-40">
          <OwnerNavbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-7 no-scrollbar bg-slate-50/40">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}