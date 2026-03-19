"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/useProductStore";
import ProductCard from "./card/ProductCard";
import { useUserStore } from "@/stores/userStore";
// import { toast } from "react-hot-toast";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { ArrowLeft, Tag, ShoppingBag, Box } from "lucide-react";
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

// --- Category Promotion Banner ---
const CategoryPromotionBanner = ({ promotion }) => {
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
              {promotion.description || "Exclusive limited-time offer on this collection."}
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

export default function ProductsByCategoryPage({ categoryName }) {
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.id);
  const { products, loading, error, fetchProductsByCategory } = useProductStore();
  const { categories } = useCategoryStore();
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();

  const [categoryId, setCategoryId] = useState(null);
  const [resolvedCategoryName, setResolvedCategoryName] = useState("Accessing Registry...");
  const [isLoading, setIsLoading] = useState(false);

  // Load category by slug
  useEffect(() => {
    if (!categoryName || categories.length === 0) return;

    const matchedCategory = categories.find(cat => slugify(cat.name) === categoryName);

    if (!matchedCategory) {
      setResolvedCategoryName("Unknown Category");
      return;
    }

    setCategoryId(matchedCategory.id);
    setResolvedCategoryName(matchedCategory.name);

    fetchProductsByCategory(matchedCategory.id);
  }, [categoryName, categories, fetchProductsByCategory]);

  // Find category promotion
  const category = categories.find(cat => cat.id === Number(categoryId));
  const categoryPromotion = category?.promotion || null;

  const isPromotionActive = (promotion) => {
    if (!promotion) return false;
    const today = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return start <= today && today <= end;
  };

  const activeCategoryPromotion = isPromotionActive(categoryPromotion) ? categoryPromotion : null;

  // Apply category promotion to products without their own
  const productsWithPromotion = products.map(product => {
    if (product.promotion && isPromotionActive(product.promotion)) return product;
    if (activeCategoryPromotion) return { ...product, promotion: activeCategoryPromotion };
    return product;
  });

  // Add/Remove favourite handler
  const handleToggleFavourite = async (productId) => {
    if (!userId) {
      toast.error("You need to be logged in to manage favourites.");
      return;
    }

    setIsLoading(true);
    try {
      // Find existing favorite for this product
      const favRecord = favorites?.find(fav => fav?.product_id === productId);

      if (!favRecord) {
        // Add favorite
        await addFavorite({ user_id: userId, product_id: productId });
        toast.success("Added to favorites!");
      } else {
        // Remove favorite by DB ID
        await removeFavorite(favRecord.id);
        toast.success("Removed from favorites!");
      }
    } catch (err) {
      toast.error(`Failed to update favourite: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* PREMIUM HEADER */}
      {/* Standardized Header */}
      <header className="container mx-auto px-6 max-w-[1440px] pt-12 mb-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Categories
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <ShoppingBag size={14} className="stroke-[2.5]" /> Sector Catalog
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {resolvedCategoryName}
            </h1>
            <p className="text-sm text-slate-500 max-w-lg font-medium leading-relaxed">
              Explore our curated selection of high-performance hardware within the {resolvedCategoryName} sector.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm whitespace-nowrap">
              {products.length} Products Found
            </div>
            <Link 
              href="/category" 
              className="px-5 py-3 bg-indigo-600 text-white border border-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm"
            >
              All Categories
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 -mt-10 relative z-20 max-w-[1440px]">
         {/* Promotion Banner */}
         {activeCategoryPromotion && <CategoryPromotionBanner promotion={activeCategoryPromotion} />}

         {/* MAIN GRID SECTOR */}
         <div className="py-12">
           {loading && products.length === 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="aspect-square bg-slate-50 rounded-3xl animate-pulse" />
               ))}
             </div>
           ) : error ? (
             <div className="py-20 text-center bg-white rounded-[40px] border border-rose-100 shadow-xl shadow-rose-500/5">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-rose-500 text-3xl font-black">!</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Registry Access Failed</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">{error}</p>
             </div>
           ) : products.length === 0 ? (
             <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Box size={40} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Discovery Failed</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                   The **{resolvedCategoryName}** registry is currently offline or being restocked.
                </p>
                <Link href="/" className="inline-block mt-10 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                   Return to Fleet
                </Link>
             </div>
           ) : (
             <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
               {productsWithPromotion.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           )}
         </div>
      </div>
    </div>
  );
}
