'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, ShoppingBag, Settings, 
  LogOut, Sparkles, ChevronRight, BarChart3, Package, Building2, MapPin, Boxes, Tag, Palette, Ruler, CreditCard, Truck, Store, Building,
  NotebookIcon, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useMemo, useEffect } from 'react';

const menuGroups = [
  {
    title: "Overview",
    items: [
      { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/owner/analytics', icon: BarChart3 },
    ]
  },
  {
    title: "Notification",
    items: [
      { name: 'Orders', href: '/owner/orders', icon: ShoppingBag },
    ]
  },
  {
    title: "Management",
    items: [
      { name: 'My Store', href: '/owner/stores', icon: Store },
      { name: 'My Company', href: '/owner/company', icon: Building2 },
      { name: 'Products', href: '/owner/products', icon: Package },
      { name: 'Stock', href: '/owner/stocks', icon: Boxes },
      { name: 'Addresses', href: '/owner/addresses', icon: MapPin },
    ]
  },
  {
    title: "Finance",
    items: [
      { name: 'Payment Accounts', href: '/owner/payment-account', icon: CreditCard },
    ]
  },
  {
    title: "System",
    items: [
      { name: 'Settings', href: '/owner/settings', icon: Settings },
    ]
  }
];

export default function OwnerSidebar({ onClose }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { orders, fetchOrders } = useShopOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => ['Pending', 'Processing'].includes(o.order_status?.status)).length
    };
  }, [orders]);

  return (
    <aside className="h-full bg-white flex flex-col border-r border-slate-200 w-72 font-sans overflow-hidden">
      {/* --- BRANDING --- */}
      <div className="p-8 pb-6">
        <Link href="/owner/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles size={20} className="text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">
              Saby-Tinh
            </span>
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mt-1">
              Owner Panel
            </span>
          </div>
        </Link>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-6">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>

            <div className="space-y-1">
              {group.items.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive ? "text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarItem"
                        className="absolute inset-0 bg-indigo-50/80 rounded-xl border border-indigo-100/50"
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                      />
                    )}

                    <div className="flex items-center gap-3 z-10 relative">
                      <link.icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
                      />
                      <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>
                        {link.name}
                      </span>
                    </div>

                    {link.name === 'Orders' && counts.pending > 0 && (
                      <span className="z-10 ml-auto min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-rose-100">
                        {counts.pending > 9 ? '9+' : counts.pending}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight size={14} className="z-10 text-indigo-400" strokeWidth={2.5} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:text-red-500 transition-colors" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
