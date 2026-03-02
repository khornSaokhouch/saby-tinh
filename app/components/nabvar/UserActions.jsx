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
  MessageSquare 
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
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Desktop-only secondary actions */}
      <div className="hidden md:flex items-center gap-1 sm:gap-2">
        <NavIconButton icon={Heart} href="/favorites" count={favorites?.length} />
        <NavIconButton icon={ShoppingBag} href="/shopping-cart" count={cartItemCount} />
      </div>

      {/* Profile/Login (Always on top) */}
      {userProfile ? (
        <Link href="/profile" className="ml-1 group">
          <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden group-hover:border-blue-500 transition-all">
            {displayImageUrl ? (
              <Image src={displayImageUrl} alt="User" width={40} height={40} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-blue-600 text-sm bg-blue-50">
                {getUserInitial(userProfile.name)}
              </div>
            )}
          </div>
        </Link>
      ) : (
        <Link href="/auth/login" className="px-5 py-2.5 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95">
          Login
        </Link>
      )}
    </div>
  );
}

// Separated Mobile Bottom Bar for independent positioning
export function MobileBottomTabs({ userProfile }) {
  const { cart } = useShoppingCartStore();
  const { favorites } = useFavoriteStore();
  const pathname = usePathname();
  
  const cartItemCount = cart?.items?.length || 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 pb-safe-area-inset-bottom z-[150] shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        <TabItem href="/" icon={Home} label="Home" active={pathname === "/"} />
        <TabItem href="/store" icon={Store} label="Shop" active={pathname === "/shop"} />
        <TabItem 
          href="/shopping-cart" 
          icon={ShoppingBag} 
          label="Cart" 
          active={pathname === "/shopping-cart"} 
          count={cartItemCount} 
        />
        <TabItem href="/products" icon={LayoutGrid} label="Category" active={pathname === "/category"} />
        
        <TabItem 
          href="/favorites" 
          icon={Heart} 
          label="Wishlist" 
          active={pathname === "/favorites"} 
          count={favorites?.length} 
        />
      </div>
    </div>
  );
}

// Helper for Desktop Icons
function NavIconButton({ icon: Icon, href, count }) {
  return (
    <Link href={href} className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
      <Icon className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  );
}

// Helper for Mobile Tabs
function TabItem({ href, icon: Icon, label, active, count, userImage, userName }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center flex-1 min-w-0 gap-1 relative">
      <div className={`relative p-1 rounded-xl transition-colors ${active ? 'text-blue-600' : 'text-slate-500'}`}>
        {userImage ? (
          <div className={`w-6 h-6 rounded-full overflow-hidden border-2 ${active ? 'border-blue-600' : 'border-transparent'}`}>
            <Image src={userImage} alt="Profile" width={24} height={24} className="object-cover" />
          </div>
        ) : Icon ? (
          <Icon className={`w-6 h-6 ${active ? 'fill-blue-50' : ''}`} />
        ) : (
           <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
             {getUserInitial(userName)}
           </div>
        )}
        
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {count}
          </span>
        )}
      </div>
      <span className={`text-[10px] font-medium truncate ${active ? 'text-blue-600' : 'text-slate-500'}`}>
        {label}
      </span>
    </Link>
  );
}