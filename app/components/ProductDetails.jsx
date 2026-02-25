"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Added missing import
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Share2,
  ChevronLeft,
  Star,
  Tag,
  Store,
  Box
} from "lucide-react";

// Stores
import { useProductStore } from "@/stores/useProductStore";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";

// Supplementary Components
import UserReviews from "./UserReviews";
import ProductDiscountSection from "./ProductDiscountSection";

const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function ProductDetails({ productSlug }) {
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.id);
  const { products, fetchProductBySlug } = useProductStore();
  const { addToCart } = useShoppingCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  const favorited = product ? isFavorite(product.id) : false;

  const fetchProduct = async () => {
    // 1. Instant Cache Check (SWR)
    const cachedProduct = products.find((p) => slugify(p.name) === slugify(productSlug));

    if (cachedProduct) {
      setProduct(cachedProduct);
      setLoading(false); 
    } else {
      setLoading(true);
    }

    try {
      // 2. Background Refresh
      const data = await fetchProductBySlug(productSlug);
      if (!data) throw new Error("Product not found in the registry.");
      setProduct(data);
    } catch (err) {
      if (!cachedProduct) {
        setError(err.message || "Failed to fetch product details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productSlug) fetchProduct();
  }, [productSlug]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      const primary = product.images.find(img => img.is_primary) || product.images[0];
      setActiveImage(primary.image);
    }
  }, [product]);

  // --- LOGIC ---
  const promotions = product?.category?.promotions || [];
  const activePromotion = promotions[0];
  const hasPromotion = activePromotion && (activePromotion.discount_percentage > 0);
  const discount = activePromotion?.discount_percentage || 0;
  
  const originalPrice = Number(product?.price || 0);
  const discountedPrice = hasPromotion 
    ? originalPrice - (originalPrice * discount) / 100 
    : originalPrice;

  // Extract all unique colors and sizes from variants
  const variantsData = product?.items?.flatMap(item => item.variants) || [];
  const uniqueColors = Array.from(new Set(variantsData.map(v => v.color?.name).filter(Boolean)));
  const uniqueSizes = Array.from(new Set(variantsData.map(v => v.size?.name).filter(Boolean)));

  // Resolve matching product item based on selection
  const selectedItem = product?.items?.find(item => {
    const itemColor = item.variants?.[0]?.color?.name;
    const itemSize = item.variants?.[0]?.size?.name;
    const colorMatch = !selectedColor || itemColor === selectedColor;
    const sizeMatch = !selectedSize || itemSize === selectedSize;
    return colorMatch && sizeMatch;
  }) || product?.items?.[0];

  const sku = selectedItem?.sku || "N/A";
  const currentStock = selectedItem?.quantity_in_stock || 0;

  const now = new Date();
  const createdAt = new Date(product?.created_at || now.toISOString());
  const diffDays = Math.ceil(Math.abs(now - createdAt) / (1000 * 60 * 60 * 24));
  const isNew = diffDays <= 7;

  // --- HANDLERS ---
  const handleAddToCart = async () => {
    if (!userId) return toast.error("Please log in to add items to your cart.");
    if (!selectedItem) return toast.error("Please select a valid configuration.");
    if (selectedItem.quantity_in_stock <= 0) return toast.error("This configuration is out of stock.");
    
    const variantId = selectedItem.variants?.[0]?.id;
    
    if (!variantId) {
      return toast.error("This configuration is currently unavailable.");
    }

    try {
      await addToCart({ 
        product_item_variant_id: variantId, 
        quantity: quantity 
      });
      toast.success("Product added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    }
  };

  const shareProduct = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <LoadingState />;
  if (error || !product) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* --- Top Navigation Bar --- */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Catalog
          </button>
          
          <button 
            onClick={shareProduct}
            className="p-2.5 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
            title="Share Product"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* --- Main Product Container --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            
            {/* ======================================= */}
            {/* LEFT: IMAGE GALLERY (Visual Engine)     */}
            {/* ======================================= */}
            <div className="w-full lg:w-1/2 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
               <div className="lg:sticky lg:top-10">
                  
                  {/* Primary Image Viewport */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 p-8 mb-6 flex items-center justify-center group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={activeImage || "/placeholder.svg"}
                        alt={product?.name || "Product Image"}
                        className="w-full h-full object-contain"
                      />
                    </AnimatePresence>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {isNew && (
                        <div className="bg-emerald-500 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <Star size={12} className="text-white fill-white" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">New</span>
                        </div>
                      )}
                      {hasPromotion && (
                        <div className="bg-rose-500 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <Tag size={12} className="text-white fill-white" />
                          <span className="text-xs font-bold text-white">-{discount}% OFF</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {product?.images?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img.image)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all p-1.5 flex-shrink-0 ${
                          activeImage === img.image 
                            ? "border-indigo-600 ring-2 ring-indigo-600/20" 
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img src={img.image} className="w-full h-full object-contain" alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* ======================================= */}
            {/* RIGHT: PRODUCT DETAILS & CONFIGURATION  */}
            {/* ======================================= */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col">
              
              {/* --- 1. Product Header & Meta --- */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
                    {product.category?.name || "Hardware"}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-500 px-2.5 py-1 bg-amber-50 rounded-md">
                    <Star size={14} fill="currentColor" stroke="none" />
                    <span className="text-xs font-bold">
                      {product.reviews_avg_rating ? Number(product.reviews_avg_rating).toFixed(1) : "0.0"}
                    </span>
                    <span className="text-[10px] text-amber-600/60 font-medium">
                      ({product.reviews_count || 0})
                    </span>
                  </div>
                  {currentStock > 0 ? (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-md">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product?.name}
                </h1>
                
                {/* Brand & Authorization Row */}
                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
                  {product?.brand && (
                    <div className="flex items-center gap-2">
                       <span className="font-semibold text-slate-700">Brand:</span>
                       <span className="font-medium">{product.brand.name}</span>
                    </div>
                  )}
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Authorized Dealer</span>
                  </div>
                </div>
              </div>

              {/* --- 2. Price Section --- */}
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-end gap-3">
                  <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                    ${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  {hasPromotion && (
                    <span className="text-xl text-slate-400 line-through font-semibold mb-1 decoration-rose-400/50">
                      ${originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>

              {/* --- 3. Variants (Colors & Sizes) --- */}
              {(uniqueColors.length > 0 || uniqueSizes.length > 0) && (
                <div className="space-y-6 mb-8 pb-8 border-b border-slate-100">
                  
                  {uniqueColors.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-900">Color</span>
                        <span className="text-sm font-medium text-slate-500">{selectedColor || 'Select'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((color, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                              selectedColor === color 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {uniqueSizes.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-900">Size</span>
                        <span className="text-sm font-medium text-slate-500">{selectedSize || 'Select'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map((size, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                              selectedSize === size 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- 4. Description & Tech Specs --- */}
              <div className="mb-10 space-y-3 flex-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product Details</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product?.description || "High-performance hardware engineered for reliability. Detailed technical specifications are verified by our internal hardware registry."}
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                   <div className="flex items-center gap-2 text-sm">
                      <Box className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">SKU:</span>
                      <span className="font-mono font-semibold text-slate-900">{sku}</span>
                   </div>
                </div>
              </div>

                 <div className="mt-auto space-y-4">
                 
                 <div className="flex flex-col gap-4">
                    {/* Primary Actions Row */}
                    <div className="flex items-center gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl flex-1 sm:flex-none sm:w-32 h-14">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="font-bold text-slate-900">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* Favorite Button (Visible beside quantity on mobile) */}
                        <button 
                            onClick={() => toggleFavorite(product)}
                            className={`h-14 w-14 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all ${
                                favorited 
                                ? "bg-rose-50 border-rose-200 text-rose-500" 
                                : "bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500"
                            }`}
                        >
                            <Heart className={`w-6 h-6 ${favorited ? "fill-current" : ""}`} />
                        </button>
                    </div>

                    {/* Add to Cart Button (Primary CTA) */}
                    <button 
                      onClick={handleAddToCart}
                      disabled={currentStock <= 0}
                      className="w-full h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                    >
                       <ShoppingCart size={18} />
                       <span className="font-bold text-sm">
                         {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                       </span>
                    </button>
                 </div>
                 
                 {/* Shipping / Seller Info */}
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                       <Truck size={16} className="text-slate-400" />
                       <span>Free shipping on orders over $500</span>
                    </div>
                    {product?.store?.name && (
                      <Link 
                        href={`/store/${slugify(product.store.name)}`} 
                        className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                      >
                         <Store size={16} className="text-slate-400" />
                         <span>Sold by <strong className="text-slate-700">{product.store.name}</strong></span>
                      </Link>
                    )}
                 </div>

              </div>

            </div>
          </div>
        </div>

        {/* --- 6. Supplementary Sections --- */}
        <div className="space-y-12">
           <UserReviews userId={userId} orderProductId={product?.id} />
           <ProductDiscountSection />
        </div>

      </main>

      {/* Internal Scrollbar Styling for Thumbnails */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #CBD5E1; }
      `}} />
    </div>
  );
}

// --- SKELETON LOADING STATE ---
function LoadingState() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-10 flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2 aspect-square bg-slate-100 animate-pulse rounded-2xl" />
          <div className="w-full lg:w-1/2 space-y-6 pt-4">
            <div className="h-4 bg-slate-100 animate-pulse rounded w-1/4" />
            <div className="h-10 bg-slate-100 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-1/2 mb-8" />
            <div className="h-12 bg-slate-100 animate-pulse rounded w-1/3 mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4" />
            </div>
            <div className="h-14 bg-slate-100 animate-pulse rounded-xl w-full mt-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ERROR STATE ---
function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <Box size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Product Not Found</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          {error || "We couldn't locate this product. It may have been removed or is currently unavailable."}
        </p>
        <Link 
          href="/" 
          className="inline-flex w-full justify-center items-center py-3.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    </div>
  );
}