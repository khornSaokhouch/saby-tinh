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
  const { favorites } = useFavoriteStore();
  const pathname = usePathname();
  
  const cartItemCount = cart?.items?.length || 0;
  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-1 pb-safe z-[150] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-14">
        <TabItem href="/" icon={Home} label="Home" active={pathname === "/"} />
      
        <TabItem href="/store" icon={Store} label="Shops" active={pathname === "/store"} />
          <TabItem href="/search" icon={Search} label="Search" active={pathname === "/search"} />
        
        {userProfile && (
          <>
            <TabItem 
              href="/shopping-cart" 
              icon={ShoppingBag} 
              label="Cart" 
              active={pathname === "/shopping-cart"} 
              count={cartItemCount} 
            />
          </>
        )}
        
        <TabItem 
          href={userProfile ? "/profile" : "/auth/login"}
          icon={!userProfile ? User : null}
          userImage={displayImageUrl}
          userName={userProfile?.name}
          label={userProfile ? "Profile" : "Login"}
          active={pathname === "/profile" || pathname === "/auth/login"}
        />
      </div>
    </div>
  );
}

// Sub-component for Mobile Tabs
function TabItem({ href, icon: Icon, label, active, count, userImage, userName }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center flex-1 min-w-0 transition-all active:scale-90">
      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full mb-0.5 ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}>
        {userImage ? (
          <div className={`w-6 h-6 rounded-full overflow-hidden border ${active ? 'border-indigo-500' : 'border-slate-200'}`}>
            <Image src={userImage} alt="Profile" width={24} height={24} className="object-cover" />
          </div>
        ) : Icon ? (
          <Icon size={19} />
        ) : (
           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
             {getUserInitial(userName)}
           </div>
        )}
        
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-1 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span className={`text-[9px] font-medium truncate w-full text-center px-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
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