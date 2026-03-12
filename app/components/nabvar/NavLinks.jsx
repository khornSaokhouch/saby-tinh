import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ShieldCheck, LayoutGrid, ArrowRight, ShoppingBag, Box } from 'lucide-react';
import { slugify } from './utils';

export default function NavLinks({ categories, brands, stores, isScrolled }) {
  const linkClass = "px-3 py-2 text-[13px] font-medium text-slate-600 hover:text-blue-600 transition-all relative group";
  
  // Shared style for all Mega Menu containers
  const megaMenuClass = "absolute top-full left-1/2 -translate-x-1/2 w-[650px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-5 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 translate-y-2 group-hover/menu:translate-y-0 z-[120]";

  return (
    <nav className="hidden lg:flex items-center gap-2 font-battambang">
      <Link href="/" className={linkClass}>
        Home
        <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>

      {/* --- SHOP MEGA MENU --- */}
      <div className="group/menu">
        <button className={linkClass + " flex items-center gap-1 outline-none group-hover/menu:text-blue-600"}>
          Shop <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/menu:rotate-180 transition-transform" />
          <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover/menu:scale-x-100 transition-transform origin-left" />
        </button>
        
        <div className={megaMenuClass}>
          <div className="grid grid-cols-4 gap-4">
            {/* Left Sidebar Info */}
            <div className="col-span-1 border-r border-slate-100 pr-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-[14px] flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Top Stores</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Explore our community of trusted local and official stores.</p>
              <Link href="/store" className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-5 hover:gap-2.5 transition-all">
                All Stores <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Right Grid Content - Showing Product Names */}
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {stores?.slice(0, 12).map(store => (
                <Link 
                  key={store.name} 
                   href={`/store/${slugify(store.name)}`}
                  className="group/item flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="w-7 h-7 rounded-[10px] bg-slate-100 flex items-center justify-center group-hover/item:bg-white transition-colors overflow-hidden relative shrink-0">
                    {store.store_image ? (
                      <Image 
                        src={store.store_image} 
                        alt={store.name} 
                        fill 
                        className="object-cover grayscale group-hover/item:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <Box className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover/item:text-blue-600 truncate">
                    {store.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CATEGORIES MEGA MENU --- */}
      <div className="group/menu">
        <button className={linkClass + " flex items-center gap-1 outline-none group-hover/menu:text-blue-600"}>
          Categories <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/menu:rotate-180 transition-transform" />
          <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover/menu:scale-x-100 transition-transform origin-left" />
        </button>
        
        <div className={megaMenuClass}>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 border-r border-slate-100 pr-4">
              <div className="w-10 h-10 bg-blue-50 rounded-[14px] flex items-center justify-center mb-3">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Shop by Category</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Find exactly what you are looking for with our curated categories.</p>
              <Link href="/category" className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest mt-5 hover:gap-2.5 transition-all">
                All Categories <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="col-span-3 grid grid-cols-3 gap-3">
              {categories?.slice(0, 9).map(cat => (
                <Link key={cat.id} href={`/category/${slugify(cat.name)}`} className="group/item flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    {cat.category_image ? (
                      <Image src={cat.category_image} alt={cat.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors leading-tight">{cat.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">View Collection</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- BRANDS MEGA MENU --- */}
      <div className="group/menu">
        <button className={linkClass + " flex items-center gap-1 outline-none group-hover/menu:text-blue-600"}>
          Brands <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/menu:rotate-180 transition-transform" />
          <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover/menu:scale-x-100 transition-transform origin-left" />
        </button>
        
        <div className={megaMenuClass}>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 border-r border-slate-100 pr-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-[14px] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Top Brands</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Buy directly from the world's most trusted manufacturers.</p>
              <Link href="/brands" className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-5 hover:gap-2.5 transition-all">
                All Brands <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-3">
              {brands?.slice(0, 9).map(brand => (
                <Link key={brand.id} href={`/brands/${slugify(brand.name)}`} className="group/item flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                    {brand.image ? (
                      <Image 
                        src={brand.image} 
                        alt={brand.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-2 group-hover/item:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="text-[10px] font-black text-slate-300">{brand.name[0]}</div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors leading-tight">{brand.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Official Partner</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link href="/products" className={linkClass}>
        Products
        <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>
    </nav>
  );
}