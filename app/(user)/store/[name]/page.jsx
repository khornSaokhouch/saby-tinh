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
    <div className="min-h-screen">
      {/* 1. HEADER SECTION - Clean & Inviting */}
      <section className="relative pt-8 pb-20 overflow-hidden bg-slate-900">
        {store?.store_image && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
            style={{ backgroundImage: `url(${store.store_image})` }}
          />
        )}
        <div className="absolute inset-0 bg-slate-900/60 z-0" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,#6366f1_0%,transparent_70%)] z-0" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <Link
            href="/store"
            className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Logo Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-[32px] overflow-hidden bg-white p-4 shadow-2xl shrink-0 flex items-center justify-center border-4 border-slate-800"
            >
              {store?.store_image ? (
                  <img src={store.store_image} alt={store.name} className="object-contain w-full h-full" />
              ) : (
                  <span className="text-4xl font-black text-slate-900">{store?.name?.charAt(0)}</span>
              )}
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </motion.div>

            {/* Store Branding */}
            <div className="text-center lg:text-left flex-1">
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 inline mr-1" /> Verified Merchant
                </span>
                <Link 
                  href={`/chat?vendorId=${store?.id}`}
                  className="px-4 py-1 bg-white/5 hover:bg-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all"
                >
                  <MessageCircle className="w-3 h-3 inline mr-1 text-indigo-400" /> Send Message
                </Link>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                {store?.name}
              </h1>

              <p className="text-slate-400 text-sm max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                {store?.user?.company_info?.description || store?.description || "Welcome to our store. We are dedicated to providing you with the best hardware and service."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK INFO BAR - Replaces 'Telemetry' */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-20 -mt-8">
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem 
            icon={MapPin} 
            label="Visit Us" 
            value={(() => {
              const addr = store?.user?.company_info?.address;
              return addr ? `${addr.province || 'Main Office'}` : "Store Location";
            })()} 
          />
          <InfoItem 
            icon={Globe} 
            label="Website" 
            value={store?.user?.company_info?.website_url ? "Visit Official Site" : "Online Catalog Only"} 
            href={store?.user?.company_info?.website_url} 
            isLink 
          />
          <InfoItem 
            icon={Clock} 
            label="Store Hours" 
            value={store?.user?.company_info?.open_time ? `${store.user.company_info.open_time} - ${store.user.company_info.close_time}` : "9:00 AM - 6:00 PM"} 
          />
        </div>

        {/* 3. PRODUCTS SECTION */}
        <section className="mt-16 pb-20">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Our Collection</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Browse through {products.length} available items
              </p>
            </div>
            <div className="h-px flex-1 bg-slate-100 mx-8 hidden sm:block" />
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
              Partner #{store?.id || '00'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {productLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Updating catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                <Package className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">No products listed yet</h4>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
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
    <div className="flex items-center gap-4 p-2 group">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
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