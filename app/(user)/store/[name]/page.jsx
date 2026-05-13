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
  (text || "").toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

export default function StoreProductsPage() {
  const { name: storeNameSlug } = useParams();
  const { stores, fetchStoreById, loading: storeLoading } = useStore();
  const { products, fetchProductsByStore, loading: productLoading } = useProductStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!storeNameSlug) return;
    const cachedStore = stores.find((s) => slugify(s.name) === storeNameSlug);
    if (cachedStore) {
      setStore(cachedStore);
      if (cachedStore.id) fetchProductsByStore(cachedStore.id);
    }
    try {
      const res = await fetchStoreById(storeNameSlug);
      const storeData = res?.data || res;
      if (!storeData) throw new Error("Store not found.");
      setStore(storeData);
      if (storeData.id && (!cachedStore || cachedStore.id !== storeData.id)) {
        await fetchProductsByStore(storeData.id);
      }
    } catch (err) {
      if (!cachedStore) setError("We couldn't find this store.");
    }
  };

  useEffect(() => { loadData(); }, [storeNameSlug]);

  if (storeLoading && !store) return <LoadingState message="Just a moment, gathering store details..." />;
  if (error || (!store && !storeLoading)) return <NotFoundState error={error} />;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. HEADER SECTION - Premium & Focused */}
      <section className="relative pt-10 pb-24 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-indigo-50/50 blur-[120px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link
            href="/store"
            className="mb-10 inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Store Directory
          </Link>

          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10 lg:gap-14">
            {/* Logo Frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="relative w-36 h-36 lg:w-48 lg:h-48 rounded-[40px] overflow-hidden bg-white p-5 shadow-2xl shadow-slate-200/50 shrink-0 flex items-center justify-center border border-slate-100"
            >
              {store?.store_image ? (
                  <img src={store.store_image} alt={store.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
              ) : (
                  <span className="text-5xl font-black text-slate-200">{store?.name?.charAt(0)}</span>
              )}
              <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
            </motion.div>

            {/* Store Branding */}
            <div className="text-center lg:text-left flex-1 pb-2">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-5">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" /> Verified Partner
                </span>
                <Link 
                  href={`/chat?receiverId=${store?.user_id}&name=${encodeURIComponent(store?.name || '')}`}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200/50"
                >
                  <MessageCircle className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" /> Direct Contact
                </Link>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-5">
                {store?.name}
              </h1>

              <p className="text-slate-400 text-[15px] max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium italic">
                "{store?.user?.company_info?.description || store?.description || "A premier destination for professional hardware and enterprise-grade tools."}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK INFO BAR - Minimalist Design */}
      <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-10">
        <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-slate-200/30 border border-slate-100/50 flex flex-col md:flex-row gap-2">
          <InfoItem 
            icon={MapPin} 
            label="Location" 
            value={(() => {
              const addr = store?.user?.company_info?.address;
              return addr ? `${addr.province || 'Global Node'}` : "Primary Hub";
            })()} 
          />
          <div className="hidden md:block w-px h-10 bg-slate-100 self-center" />
          <InfoItem 
            icon={Globe} 
            label="Digital Presence" 
            value={store?.user?.company_info?.website_url ? "Official Website" : "Marketplace Presence"} 
            href={store?.user?.company_info?.website_url} 
            isLink 
          />
          <div className="hidden md:block w-px h-10 bg-slate-100 self-center" />
          <InfoItem 
            icon={Clock} 
            label="Availability" 
            value={store?.user?.company_info?.open_time ? `${store.user.company_info.open_time} - ${store.user.company_info.close_time}` : "09:00 - 18:00"} 
          />
        </div>

        {/* 3. PRODUCTS SECTION */}
        <section className="mt-20 pb-32">
          <div className="flex items-center justify-between mb-12 px-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Catalog</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Full Collection</h2>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
               <div className="h-px w-20 bg-slate-100" />
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-xl">
                 {products.length} Items Listed
               </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {productLoading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-10 h-10 text-indigo-200 animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syncing Catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 bg-white rounded-[40px] border border-dashed border-slate-100 text-center shadow-inner">
                <ShoppingBag className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">No Active Inventory</h4>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
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
    <div className="flex-1 flex items-center gap-4 p-4 lg:p-5 hover:bg-slate-50 transition-colors rounded-2xl group">
      <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100/50">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-slate-900 text-xs truncate uppercase tracking-tight">{value}</p>
      </div>
    </div>
  );
  return isLink && href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function LoadingState({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">{message}</p>
    </div>
  );
}

function NotFoundState({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Store Not Found</h2>
        <p className="text-slate-500 mb-8 text-xs font-medium uppercase tracking-widest leading-relaxed">
          {error || "We couldn't find the page you're looking for."}
        </p>
        <Link href="/" className="inline-block w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}