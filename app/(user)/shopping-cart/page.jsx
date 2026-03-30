"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";

export default function CompactCart() {
  const userId = useUserStore((state) => state.user?.id);
  const { cart, loading, fetchCart, updateQuantity, removeItem } = useShoppingCartStore();

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId, fetchCart]);

  const items = cart?.items || [];
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.variant?.product_item?.product?.price || 0);
    return total + price * item.quantity;
  }, 0);

  if (loading && !cart) return <div className="p-10 text-center text-sm">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-3" />
        <p className="text-sm text-slate-500 mb-4">Your cart is empty</p>
        <Link href="/" className="text-xs font-bold text-indigo-600 underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6 text-slate-900">Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onUpdate={updateQuantity} onRemove={removeItem} />
            ))}
          </AnimatePresence>
        </div>

        {/* Small Summary Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h2 className="text-sm font-bold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-indigo-600">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 w-full bg-slate-900 text-white text-sm font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onUpdate, onRemove }) {
  const variant = item.variant || {};
  const product = variant.product_item?.product || {};
  const price = Number(product.price || 0);
  const primaryImage = product.images?.[0]?.image || "/placeholder.svg";

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
    >
      {/* Tiny Image */}
      <div className="w-16 h-16 bg-slate-50 rounded md overflow-hidden shrink-0 relative border border-slate-100">
        <Image src={primaryImage} alt={product.name} fill className="object-cover" />
      </div>

      {/* Info - Smaller Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 truncate leading-tight">{product.name}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-tighter">
          {variant.color?.name} / {variant.size?.name}
        </p>
        <div className="mt-2 flex items-center gap-4 sm:hidden">
            <span className="text-sm font-bold">${(price * item.quantity).toFixed(2)}</span>
        </div>
      </div>

      {/* Controls - Compact */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-slate-200 rounded-md bg-white">
          <button 
            onClick={() => onUpdate(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1 hover:bg-slate-50 disabled:opacity-30"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
          <button 
            onClick={() => onUpdate(item.id, item.quantity + 1)}
            className="p-1 hover:bg-slate-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="hidden sm:block text-right min-w-[70px]">
          <p className="text-sm font-bold text-slate-900">${(price * item.quantity).toFixed(2)}</p>
        </div>

        <button 
          onClick={() => onRemove(item.id)}
          className="text-slate-300 hover:text-rose-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}