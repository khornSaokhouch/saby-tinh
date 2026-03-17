"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Minus, Plus, Heart, ShoppingCart, ShieldCheck,
  Truck, Share2, ChevronLeft, Star, Tag, Store, Box
} from "lucide-react";

import { useProductStore } from "@/stores/useProductStore";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import UserReviews from "./UserReviews";
import ProductDiscountSection from "./ProductDiscountSection";

const slugify = (text) => (text || "").toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

export default function ProductDetails({ productSlug }) {
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.id);
  const { products, fetchProductBySlug } = useProductStore();
  const { addToCart } = useShoppingCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const cached = products.find((p) => slugify(p.name) === slugify(productSlug));
      if (cached) { setProduct(cached); setLoading(false); }
      try {
        const data = await fetchProductBySlug(productSlug);
        if (data) setProduct(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (productSlug) fetchProduct();
  }, [productSlug, products, fetchProductBySlug]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      const primary = product.images.find(img => img.is_primary) || product.images[0];
      setActiveImage(primary.image);
    }
  }, [product]);

  if (loading) return <LoadingState />;
  if (!product) return <ErrorState />;

  const favorited = isFavorite(product.id);
  const activePromotion = (product?.category?.promotions || []).find(p => p.status === 1);
  const discountType = activePromotion?.discount_type || 'none';
  const discountValue = parseFloat(activePromotion?.discount_value || 0);
  const hasPromotion = activePromotion && discountType !== 'none' && discountValue > 0;
  
  const originalPrice = Number(product?.price || 0);
  let discountedPrice = originalPrice;
  let discountBadge = "";

  if (hasPromotion) {
    if (discountType === 'percentage') {
      discountedPrice = originalPrice - (originalPrice * discountValue) / 100;
      discountBadge = `-${discountValue}%`;
    } else if (discountType === 'fixed') {
      discountedPrice = Math.max(0, originalPrice - discountValue);
      discountBadge = `-$${discountValue}`;
    }
  }

  const uniqueColors = Array.from(new Set(product?.items?.flatMap(item => item.variants).map(v => v.color?.name).filter(Boolean)));
  const uniqueSizes = Array.from(new Set(product?.items?.flatMap(item => item.variants).map(v => v.size?.name).filter(Boolean)));
  const currentStock = product?.items?.[0]?.quantity_in_stock || 0;

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4">
        
        {/* Top Nav - Slim */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-tight">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Copied!"); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Gallery - Compact */}
          <div className="lg:col-span-7">
            <div className="sticky top-6 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-6">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    src={activeImage || "/placeholder.svg"}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </AnimatePresence>
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {hasPromotion && <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase leading-none">{discountBadge}</span>}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product?.images?.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(img.image)} className={`w-14 h-14 rounded-lg border-2 flex-shrink-0 p-1 bg-white transition-all ${activeImage === img.image ? 'border-black' : 'border-transparent bg-gray-50'}`}>
                    <img src={img.image} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details - Compact & Dense */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {product.category?.name}
                </span>
                <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  <Star size={10} fill="currentColor" /> {Number(product.reviews_avg_rating || 0).toFixed(1)}
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-gray-900">
                  ${discountedPrice.toLocaleString()}
                </span>
                {hasPromotion && (
                  <span className="text-sm text-gray-400 line-through">${originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-y-2 py-4 border-y border-gray-50">
                <MetaItem label="Brand" value={product.brand?.name} />
                <MetaItem label="SKU" value={product?.items?.[0]?.sku || "N/A"} />
                <MetaItem label="Availability" value={currentStock > 0 ? "In Stock" : "Out of Stock"} isStock />
              </div>

              {/* Variants */}
              {uniqueColors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-gray-400">Color</span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(c => (
                      <button key={c} onClick={() => setSelectedColor(c)} className={`px-3 py-1.5 rounded-md text-[12px] font-semibold border transition-all ${selectedColor === c ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase text-gray-400">Description</span>
                <p className="text-[13px] text-gray-600 leading-relaxed mt-1">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Actions Area */}
              <div className="pt-6 space-y-3 mt-auto">
                <div className="flex gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg h-10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 flex justify-center text-gray-400 hover:text-black"><Minus size={14}/></button>
                    <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 flex justify-center text-gray-400 hover:text-black"><Plus size={14}/></button>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(product)}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-all ${favorited ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                  >
                    <Heart size={18} className={favorited ? "fill-current" : ""} />
                  </button>
                </div>

                <button 
                  onClick={async () => {
                    try {
                      await addToCart({ product_item_variant_id: product?.items?.[0]?.variants?.[0]?.id, quantity });
                      toast.success("Added to cart");
                    } catch (error) {
                      toast.error("Failed to add to cart");
                    }
                  }}
                  disabled={currentStock <= 0}
                  className="w-full h-12 bg-black text-white rounded-lg flex items-center justify-center gap-2 font-bold text-sm hover:opacity-90 transition-all disabled:opacity-30 active:scale-[0.99]"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Truck size={12} /> Free Shipping
                  </div>
                  {product.store && (
                    <Link href={`/store/${slugify(product.store.name)}`} className="text-[11px] text-gray-400 flex items-center gap-1 hover:text-black">
                      <Store size={12} /> Sold by <span className="font-bold text-gray-900 underline">{product.store.name}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplementary */}
        <div className="mt-12 space-y-12">
           <UserReviews userId={userId} orderProductId={product?.id} />
           <ProductDiscountSection />
        </div>
      </main>
    </div>
  );
}

function MetaItem({ label, value, isStock }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">{label}</span>
      <span className={`text-[12px] font-bold mt-1 ${isStock ? 'text-emerald-600' : 'text-gray-900'}`}>{value || "—"}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Loading</span>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Box className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h2 className="text-lg font-bold">Product not found</h2>
        <Link href="/" className="text-xs font-bold text-indigo-600 underline mt-2 block">Back to Home</Link>
      </div>
    </div>
  );
}