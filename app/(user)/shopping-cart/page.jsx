"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
  CreditCard,
  Lock
} from "lucide-react";

// --- REUSABLE CONFIRMATION MODAL ---
const ClearCartModal = ({ isOpen, onClose, onConfirm, isClearing }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 mx-auto">
            <Trash2 className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Clear Shopping Cart?
          </h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            This will permanently remove all items from your current cart. This action cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-3 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isClearing}
              className="py-3 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isClearing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Clear Cart"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ShoppingCartPage() {
  const userId = useUserStore((state) => state.user?.id);
  const {
    cart,
    loading,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useShoppingCartStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  const items = cart?.items || [];
  const hasItems = items.length > 0;

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = Number(item.variant?.product_item?.product?.price || 0);
      return total + price * item.quantity;
    }, 0);
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      toast.error("Failed to update quantity.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    toast.promise(
      removeItem(itemId),
      {
        loading: "Removing item...",
        success: "Item removed from cart.",
        error: "Failed to remove item.",
      }
    );
  };

  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      toast.success("Cart cleared successfully.");
    } catch (e) {
      toast.error("Failed to clear cart.");
    } finally {
      setIsClearing(false);
      setIsModalOpen(false);
    }
  };

  // --- LOADING STATE ---
  if (loading && !cart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading your cart...</p>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (!hasItems) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 pb-20">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">
          Looks like you haven't added any products to your cart yet. Explore our catalog to find top-tier hardware.
        </p>
        <Link
          href="/"
          className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // --- MAIN CART UI ---
  const subtotal = calculateTotal();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 pb-24">
      
      <ClearCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClear}
        isClearing={isClearing}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm font-medium text-slate-500">
              You have {items.length} {items.length === 1 ? 'item' : 'items'} in your cart.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50 w-fit"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* ========================================== */}
          {/* LEFT: CART ITEMS LIST                      */}
          {/* ========================================== */}
          <div className="w-full lg:flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQtyChange={handleQuantityChange}
                  onDelete={handleDeleteItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* ========================================== */}
          {/* RIGHT: ORDER SUMMARY                       */}
          {/* ========================================== */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-semibold">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Estimated Tax</span>
                  <span className="text-slate-900 font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                
                <div className="h-px bg-slate-100 w-full my-4" />
                
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <Link
                href="/checkout"
                className="w-full bg-indigo-600 text-white rounded-xl transition-all duration-300 hover:bg-indigo-700 shadow-sm flex items-center justify-center py-4 mb-6 group"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold">Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
              
              {/* Trust Badges */}
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 border border-slate-100">
                 <div className="flex items-center gap-3">
                   <Lock className="w-5 h-5 text-slate-400" />
                   <p className="text-xs font-medium text-slate-500">
                     <strong className="text-slate-700">Secure Checkout</strong><br/>
                     256-bit SSL encryption.
                   </p>
                 </div>
              </div>

            </div>

            <Link
              href="/"
              className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CART ITEM ROW COMPONENT ---
function CartItemRow({ item, onQtyChange, onDelete }) {
  const variant = item.variant || {};
  const product = variant.product_item?.product || {};
  const itemPrice = Number(product.price || 0);
  const itemTotal = itemPrice * item.quantity;

  const primaryImage = product.images?.find(img => img.is_primary)?.image || product.images?.[0]?.image || "/placeholder.svg";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 shadow-sm hover:border-indigo-200 transition-colors relative"
    >
      {/* 1. Image */}
      <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden relative p-2">
         <Image
            src={primaryImage}
            alt={product.name || "Product"}
            fill
            className="object-contain p-1"
         />
      </div>

      {/* 2. Product Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
          <span className="text-xs font-semibold text-indigo-600">
            {product.category?.name || 'Category'}
          </span>
        </div>
        
        <h4 className="text-base font-bold text-slate-900 truncate mb-2">
          {product.name}
        </h4>
        
        {/* Variants (Color/Size) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
           {variant.color && (
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
               Color: {variant.color.name}
             </span>
           )}
           {variant.size && (
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
               Size: {variant.size.name}
             </span>
           )}
        </div>
        
        {/* Mobile-only Price (Hidden on desktop) */}
        <div className="sm:hidden text-lg font-bold text-slate-900 mt-2">
          ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* 3. Actions & Price (Desktop Layout) */}
      <div className="flex flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
        
        {/* Quantity Selector */}
        <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-10">
          <button
            onClick={() => onQtyChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-slate-900 border-x border-slate-100 h-full flex items-center justify-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onQtyChange(item.id, item.quantity + 1)}
            className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Total Price */}
        <div className="hidden sm:block text-right min-w-[100px]">
          <p className="text-lg font-extrabold text-slate-900">
            ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        {/* Delete Button */}
        <button 
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="Remove item"
        >
           <Trash2 size={18} />
        </button>

      </div>
    </motion.div>
  );
}