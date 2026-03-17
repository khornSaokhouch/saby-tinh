"use client"
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useShoppingCartStore } from '@/stores/useShoppingCart';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { 
  Heart, 
  ShoppingBag, 
  Home, 
  Store, 
  LayoutGrid, 
  User,
  Search
} from 'lucide-react';
import { getCleanImageUrl, getUserInitial } from './utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function UserActions({ userProfile }) {
  const { cart, fetchCart } = useShoppingCartStore();
  const { favorites } = useFavoriteStore();
  const pathname = usePathname();

  useEffect(() => {
    if (userProfile && !cart) {
      fetchCart();
    }
  }, [userProfile, cart, fetchCart]);

  const cartItemCount = cart?.items?.length || 0;
  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;

  return (
    <div className="flex items-center gap-2">
      {/* Desktop-only secondary actions */}
      {userProfile && (
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          <NavIconButton icon={Heart} href="/favorites" count={favorites?.length} />
          <NavIconButton icon={ShoppingBag} href="/shopping-cart" count={cartItemCount} />
        </div>
      )}

      {/* Profile/Login (Always on top for desktop) */}
      {userProfile ? (
        <Link href="/profile" className="ml-1 group">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden group-hover:border-indigo-500 transition-all">
            {displayImageUrl ? (
              <Image src={displayImageUrl} alt="User" width={40} height={40} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-semibold text-indigo-600 text-sm bg-indigo-50">
                {getUserInitial(userProfile.name)}
              </div>
            )}
          </div>
        </Link>
      ) : (
        <Link href="/auth/login" className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all active:scale-95">
          Login
        </Link>
      )}
    </div>
  );
}

export function MobileBottomTabs({ userProfile }) {
  const { cart } = useShoppingCartStore();
  const pathname = usePathname();
  
  const cartItemCount = cart?.items?.length || 0;
  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/store", icon: Store, label: "Shops" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/shopping-cart", icon: ShoppingBag, label: "Cart", count: cartItemCount },
    { 
      href: userProfile ? "/profile" : "/auth/login", 
      icon: User, 
      label: userProfile ? "Profile" : "Login",
      isProfile: true 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-6 pb-2 pointer-events-none">
      {/* Main Container: White Background */}
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-full pointer-events-auto">
        <div className="flex justify-between items-center h-16 px-1.5 relative">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            
            return (
              <Link 
                key={tab.href} 
                href={tab.href} 
                className="relative flex flex-col items-center justify-center flex-1 h-full"
              >
                {/* 
                   THE SLIDING PILL 
                   This wraps both icon and text smoothly
                */}
                {isActive && (
                  <motion.div 
                    layoutId="activePillIndicator"
                    className="absolute inset-y-2 inset-x-1 bg-indigo-600 rounded-full -z-10"
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30,
                      mass: 0.8
                    }}
                  />
                )}

                <div className="flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1 : 0.9,
                      y: isActive ? 0 : 0 
                    }}
                    className="relative"
                  >
                    {tab.isProfile && userProfile ? (
                      <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-white shadow-sm' : 'border-slate-200'}`}>
                        {displayImageUrl ? (
                          <Image src={displayImageUrl} alt="Profile" width={24} height={24} className="object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {getUserInitial(userProfile.name)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <tab.icon 
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`} 
                      />
                    )}
                    
                    {/* Notification Badge */}
                    {tab.count > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-2 -right-2 min-w-[15px] h-[15px] px-1 text-[8px] font-black rounded-full flex items-center justify-center ring-2 ${isActive ? 'bg-white text-indigo-600 ring-indigo-600' : 'bg-rose-500 text-white ring-white'}`}
                      >
                        {tab.count > 9 ? '9+' : tab.count}
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.span 
                    className={`text-[9px] mt-0.5 font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}
                  >
                    {tab.label}
                  </motion.span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// Sub-component for Desktop
function NavIconButton({ icon: Icon, href, count }) {
  return (
    <Link href={href} className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all group">
      <Icon size={20} />
      {count > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  );
}