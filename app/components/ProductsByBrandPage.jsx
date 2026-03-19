"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/useProductStore";
import { useBrandStore } from "@/stores/useBrandStore";
import ProductCard from "./card/ProductCard";
import { ArrowLeft, ShieldCheck, Box, ShoppingBag, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- Slugify function ---
const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

// --- Brand Promotion Banner ---
const BrandPromotionBanner = ({ promotion }) => {
  if (!promotion || !promotion.name) return null;

  const endDate = new Date(promotion.end_date).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden bg-slate-900 rounded-[32px] p-8 mb-12 shadow-2xl shadow-indigo-100 border border-slate-800"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <Tag className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">
              {promotion.name}
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
              {promotion.description || "Official brand partnership promotion."}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Offer expires</span>
           <span className="text-xl font-black text-white uppercase tracking-tighter">{endDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductsByBrandPage({ brandSlug }) {
  const router = useRouter();
  const { products, loading, error, fetchProductsByFilters } = useProductStore();
  const { brands, fetchBrands } = useBrandStore();

  const [resolvedBrandName, setResolvedBrandName] = useState("Accessing Registry...");
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial data
  useEffect(() => {
    fetchBrands();
  }, []);

  // Load brand by slug and initial products
  useEffect(() => {
    const loadData = async () => {
      if (brands.length === 0) await fetchBrands();
      
      const matchedBrand = brands.find(b => slugify(b.name) === brandSlug);

      if (!matchedBrand) {
        setResolvedBrandName("Unknown Manufacturer");
        return;
      }

      setResolvedBrandName(matchedBrand.name);
      
      // Initial fetch for this brand
      fetchProductsByFilters({ 
        brandId: matchedBrand.id,
        search: searchTerm
      });
    };
    
    loadData();
  }, [brandSlug, brands, searchTerm]);

  // Find brand promotion
  const currentBrand = brands.find(b => slugify(b.name) === brandSlug);
  const brandPromotion = currentBrand?.promotion || null;

  const isPromotionActive = (promotion) => {
    if (!promotion) return false;
    const today = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return start <= today && today <= end;
  };

  const activeBrandPromotion = isPromotionActive(brandPromotion) ? brandPromotion : null;

  // Apply brand promotion to products without their own
  const productsWithPromotion = products.map(product => {
    if (product.promotion && isPromotionActive(product.promotion)) return product;
    if (activeBrandPromotion) return { ...product, promotion: activeBrandPromotion };
    return product;
  });

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* PREMIUM HEADER */}
      {/* Standardized Header */}
      <header className="container mx-auto px-6 max-w-[1440px] pt-12 mb-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Manufacturers
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <ShieldCheck size={14} className="stroke-[2.5]" /> Official Partner
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {resolvedBrandName}
            </h1>
            <p className="text-sm text-slate-500 max-w-lg font-medium leading-relaxed">
              Explore industrial-grade solutions from {resolvedBrandName}, our premier technology manufacturing partner.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm whitespace-nowrap">
              {products.length} Results
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-10 relative z-20 max-w-[1440px]">
         {/* Promotion Banner */}
         {activeBrandPromotion && <BrandPromotionBanner promotion={activeBrandPromotion} />}

         {/* MAIN GRID SECTOR */}
         <div className="py-12">
            <AnimatePresence mode="popLayout">
              {loading && products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="aspect-square bg-white rounded-3xl border border-dashed border-slate-100 animate-pulse" />
                  ))}
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {productsWithPromotion.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200"
                >
                   <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                      <ShoppingBag size={40} className="text-slate-200" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase">Discovery Failed</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">No hardware modules match the selected parameters</p>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
