'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, ShoppingBag, Settings, 
  LogOut, Sparkles, ChevronRight, BarChart3, Package, ShieldCheck, LayoutGrid, Boxes, Tag, Palette, Ruler, CreditCard, Truck, Store, Building,
  Ticket , FileText, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSellerStore } from '@/stores/useSellerStore';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { useAuthStore } from '@/stores/authStore';
import LogoutConfirmModal from './modeldeleted/LogoutConfirmModal';
// Defined menu structure
const menuGroups = [
  {
  title: "Main",
  items: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Invoices', href: '/admin/invoices', icon: CreditCard }
  ]
},
  {
    title: "Notifications",
    items: [
      { name: 'Seller Requests', href: '/admin/seller-requests', icon: Store },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    ]
  },
  {
    title: "Marketing",
    items: [
      { name: 'Events', href: '/admin/events', icon: Sparkles },
      { name: 'Product Promotions', href: '/admin/product-promotions', icon: Tag },
      { name: 'Promotions', href: '/admin/promotions', icon: Tag },
      { name: 'Promo Codes', href: '/admin/promo-codes', icon: Ticket },
      { name: 'Promo Usages', href: '/admin/promo-code-usages', icon: FileText },
    ]
  },
  {
    title: "Library",
    items: [
      { name: 'Stores', href: '/admin/stores', icon: Store },
      { name: 'Products', href: '/admin/products', icon: Package },
       { name: 'Customers', href: '/admin/users', icon: Users },
      { name: 'Company', href: '/admin/company', icon: Building },
      { name: 'Categories', href: '/admin/categories', icon: LayoutGrid },
      { name: 'Brands', href: '/admin/brands', icon: Tag },
      { name: 'Types', href: '/admin/types', icon: Boxes },
      { name: 'Colors', href: '/admin/colors', icon: Palette },
      { name: 'Sizes', href: '/admin/sizes', icon: Ruler },
    ]
  },
  {
    title: "Delivery",
    items: [
      { name: 'Shipping Methods', href: '/admin/shipping-methods', icon: Truck },
      { name: 'Order Status', href: '/admin/order-status', icon: Boxes },
      { name: 'Payment Status', href: '/admin/payment_statuses', icon: CreditCard },
    ]
  },
  {
    title: "Regions",
    items: [
        { name: 'Addresses', href: '/admin/addresses', icon: MapPin },
        { name: 'Countries', href: '/admin/countries', icon: MapPin },
    ]
  },
  {
    title: "Finance",
    items: [
      { name: 'Payments', href: '/admin/payment-account', icon: CreditCard },
    ]
  },
  {
    title: "System",
    items: [
      { name: 'Security', href: '/admin/security', icon: ShieldCheck },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

export default function AdminSidebar({ onClose }) {
  const { language } = useLanguageStore();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { pendingCount } = useSellerStore();
  const { orders, fetchOrders } = useShopOrderStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutCancel = () => setShowLogoutModal(false);
  
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <aside className="h-full bg-white flex flex-col border-r border-slate-100 w-56 font-sans overflow-hidden">
        {/* --- BRANDING --- */}
        <div className="px-5 py-6 border-b border-slate-50 flex justify-center">
          <Link href="/admin/dashboard" className="flex flex-col items-center group">
            <span className="text-[15px] font-black text-slate-900 tracking-tighter uppercase leading-none">
              Saby-Tinh
            </span>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1.5">
              {t('Admin Panel', language)}
            </span>
          </Link>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto custom-scrollbar pb-6">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5">
                {t(group.title, language)}
              </h3>

              <div className="space-y-1">
                {group.items.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`relative flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group
                        ${isActive ? "text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarItem"
                          className="absolute inset-0 bg-indigo-50/80 rounded-xl border border-indigo-100/50"
                          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        />
                      )}

                      <div className="flex items-center gap-2.5 z-10 relative">
                        <link.icon
                          size={15}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
                        />
                        <span className={`text-[12px] ${isActive ? "font-bold" : "font-medium"}`}>
                          {t(link.name, language)}
                        </span>
                      </div>

                      {/* 🔴 Seller Requests badge */}
                      {link.name === 'Seller Requests' && pendingCount > 0 && (
                        <span className="z-10 ml-auto min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                      )}

                      {/* 📦 Orders count badge (Admin sees all) */}
                      {link.name === 'Orders' && orders.length > 0 && (
                        <span className="z-10 ml-auto min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-rose-100">
                          {orders.length > 99 ? '99+' : orders.length}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight size={12} className="z-10 text-indigo-400" strokeWidth={2.5} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* --- FOOTER --- */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/30">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={15} className="group-hover:text-rose-500 transition-colors" />
            <span className="text-[12px] font-semibold">{t('Sign Out', language)}</span>
          </button>
        </div>
      </aside>

      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </>

  );
}
