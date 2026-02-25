"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShoppingCartStore } from "../../../stores/useShoppingCart";
import { useUserStore } from "../../../stores/userStore";

export default function RightSidebar({ product }) {
  const userId = useUserStore((state) => state.user?.id);
  const { carts = [], fetchCartsByUserId } = useShoppingCartStore();

  useEffect(() => {
    if (userId) {
      fetchCartsByUserId(userId);
    }
  }, [userId, fetchCartsByUserId]);

  // Combine all items from all carts
  const allItems = carts.flatMap((cart) => cart.items || []);

  // Filter items by current product ID
  const filteredItems = allItems.filter(
    (item) => String(item.product_item?.product?.id) === String(product?.id)
  );

  // Calculate subtotal for filtered items
  const subTotal = filteredItems.reduce((total, item) => {
    const price = item.product_item?.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  const isCartEmpty = filteredItems.length === 0;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Unit Summary</h3>
        {!isCartEmpty ? (
          <div className="space-y-4">
             {filteredItems.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                   <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                      <img src={item.product_item?.product?.product_image_url} className="object-cover h-full w-full" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.product_item?.product?.name}</p>
                      <p className="text-[10px] text-slate-500">{item.qty} Unit(s)</p>
                   </div>
                </div>
             ))}
             <div className="pt-4 border-t border-slate-100 flex justify-between">
                <span className="text-xs font-bold text-slate-500">Subtotal</span>
                <span className="text-sm font-black text-slate-900">${subTotal.toFixed(2)}</span>
             </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4 italic">No units of this model in cart.</p>
        )}
      </div>

      <div className="space-y-3">
        <Link href={`/user/${userId}/shopping-cart`} className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all">VIEW CART</Link>
        <Link href="/checkout" className="block w-full text-center py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all">CHECKOUT</Link>
      </div>
    </div>
  );
}