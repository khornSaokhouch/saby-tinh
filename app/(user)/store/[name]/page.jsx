"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Globe,
  Clock,
  Package,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
  MessageCircle,
  Zap,
  Star,
  Rocket,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react";
import Link from "next/link";

// Stores
import { useStore } from "@/stores/useStore";
import { useProductStore } from "@/stores/useProductStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { useUserStore } from "@/stores/userStore";

// Components
import ProductCard from "@/components/card/ProductCard";

const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function StoreProductsPage() {
  const { name: storeNameSlug } = useParams();
  const { stores, fetchStoreById, loading: storeLoading } = useStore();
  const { products, fetchProductsByStore, loading: productLoading } = useProductStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const userId = useUserStore((state) => state.user?.id);

  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!storeNameSlug) return;

    // 1. Instant Cache Check (SWR)
    const cachedStore = stores.find((s) => slugify(s.name) === storeNameSlug);
    
    if (cachedStore) {
      setStore(cachedStore);
      // If we have the ID, start loading products immediately in parallel
      if (cachedStore.id) {
        fetchProductsByStore(cachedStore.id);
      }
    }

    try {
      // 2. Background Refresh
      const res = await fetchStoreById(storeNameSlug);
      const storeData = res?.data || res;
      
      if (!storeData) throw new Error("Store entry not found.");
      
      setStore(storeData);
      
      // 3. Load Products (if not already loading from cache or if ID changed)
      if (storeData.id && (!cachedStore || cachedStore.id !== storeData.id)) {
        await fetchProductsByStore(storeData.id);
      }
    } catch (err) {
      console.error("Failed to load store data:", err);
      if (!cachedStore) {
        setError("Store registry access failed.");
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [storeNameSlug]);
  

  if (storeLoading && !store) return <LoadingState message="Loading store details..." />;
  if (error || (!store && !storeLoading)) return <NotFoundState error={error} />;

  return (
    <div className="min-h-screen">
      {/* 1. HERO ENGINE - Immersive Glassmorphism */}
      <section className="relative pt-12 pb-32 lg:pt-10 lg:pb-28 overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Floating Geometric Flair */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <Link
            href={`/store`}
            className="mb-12 inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-widest group shadow-2xl"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Store 
          </Link>

          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16">
            {/* Logo Engine - Premium Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }} 
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="relative w-36 h-36 lg:w-48 lg:h-48 rounded-[40px] lg:rounded-[56px] p-[2px] bg-gradient-to-tr from-indigo-500 via-blue-400 to-emerald-400 shadow-[0_40px_80px_rgba(0,0,0,0.5)] shrink-0 group"
            >
              <div className="w-full h-full rounded-[38px] lg:rounded-[54px] overflow-hidden bg-white flex items-center justify-center border-4 border-slate-950 p-6 relative">
                {store?.store_image ? (
                    <img src={store.store_image} alt={store.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <span className="text-5xl lg:text-7xl font-black text-slate-900">{store?.name?.charAt(0)}</span>
                )}
                
                {/* Visual Ping */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
              </div>
            </motion.div>

            {/* Branding Core */}
            <div className="text-center lg:text-left flex-1 space-y-6">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 backdrop-blur-md text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authorized Dealer
                </div>
                
                <Link 
                  href={`/chat?vendorId=${store?.id}`}
                  className="group inline-flex items-center gap-2.5 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all backdrop-blur-xl shadow-2xl"
                >
                  <MessageCircle className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" /> 
                  Contact Store
                </Link>

                {/* Social Cluster */}
                <div className="flex items-center gap-3">
                  {store?.user?.company_info?.facebook_url && (
                    <a href={store.user.company_info.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all hover:scale-110">
                      <Facebook size={14} className="text-blue-400" />
                    </a>
                  )}
                  {store?.user?.company_info?.instagram_url && (
                    <a href={store.user.company_info.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all hover:scale-110">
                      <Instagram size={14} className="text-pink-400" />
                    </a>
                  )}
                  {store?.user?.company_info?.linkedin_url && (
                    <a href={store.user.company_info.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all hover:scale-110">
                      <Linkedin size={14} className="text-blue-500" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                  {store?.name}
                </h1>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6">
                   <div className="flex items-center gap-2 text-indigo-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">Refined Selection</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden lg:block" />
                   <div className="flex items-center gap-2 text-slate-400">
                      <Zap size={14} className="text-blue-400" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Global Ops</span>
                   </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0 font-medium italic opacity-80">
                "{store?.user?.company_info?.description || store?.description || "A curated destination for high-performance hardware solutions and enterprise-grade distribution services."}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TELEMETRY BAR - Modular Info */}
      <div className="container mx-auto px-6 relative z-20 -mt-12 lg:-mt-16 max-w-7xl">
        <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-10">
          <InfoItem 
            icon={MapPin} 
            label="Location" 
            value={(() => {
              const addr = store?.user?.company_info?.address;
              if (!addr) return store?.city || "Central Terminal";
              return `${addr.street ? addr.street + ', ' : ''}${addr.district ? addr.district + ', ' : ''}${addr.province || 'Central Sector'}`;
            })()} 
          />
          <InfoItem 
            icon={Globe} 
            label="Website" 
            value={store?.user?.company_info?.website_url || store?.website_url ? "Interface Active" : "Internal Sync Only"} 
            href={store?.user?.company_info?.website_url || store?.website_url} 
            isLink 
          />
          <InfoItem 
            icon={Clock} 
            label="Opening Hours" 
            value={store?.user?.company_info?.open_time ? `${store.user.company_info.open_time} - ${store.user.company_info.close_time}` : (store?.business_hours || "09:00 - 18:00")} 
          />
        </div>

        {/* 3. INVENTORY GRID - Catalog Discovery */}
        <section className="mt-24 pb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 px-4">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Product Collection</h2>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Rocket className="w-4 h-4 text-indigo-600" />
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  {products.length} Products Available
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="h-px w-20 bg-slate-100 hidden lg:block" />
                <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                 Store ID: #{store?.id || '000'}
                </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {productLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-32 text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
                  <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading products...</p>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="py-24 bg-white rounded-[40px] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 text-slate-200 border border-slate-100">
                  <Package className="w-10 h-10" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">No Products</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">This store hasn't listed any products yet.</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10"
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={() => toggleFavorite(product)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

/* ---------------- COMPONENT PARTS ---------------- */

function InfoItem({ icon: Icon, label, value, href, isLink }) {
  const content = (
    <div className="flex items-center gap-5 group cursor-pointer p-2">
      <div className="w-14 h-14 bg-slate-50 rounded-[22px] flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <div className="flex items-center gap-2">
          <p className="font-black text-slate-900 text-sm tracking-tight truncate">{value}</p>
          {isLink && <ArrowUpRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </div>
      </div>
    </div>
  );
  return isLink && href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function LoadingState({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
       <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 border-4 border-indigo-50 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <ShoppingBag className="absolute inset-0 m-auto w-8 h-8 text-indigo-600" />
       </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">{message}</p>
    </div>
  );
}

function NotFoundState({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] px-6">
      <div className="max-w-md w-full text-center bg-white p-14 rounded-[48px] shadow-2xl border border-slate-100">
        <div className="w-24 h-24 bg-rose-50 rounded-[36px] flex items-center justify-center mx-auto mb-10 border border-rose-100">
           <Zap size={40} className="text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Store Not Found</h2>
        <p className="text-slate-500 mb-12 text-sm font-medium leading-relaxed italic">
          {error || "The requested store could not be located in our database."}
        </p>
        <Link href="/" className="inline-block w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
