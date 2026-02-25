"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Plus,
  Package,
  Wallet,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Stores
import { useShoppingCartStore } from "@/app/stores/useShoppingCart";
import { useAddressStore } from "@/app/stores/useAddressStore";
import { useShippingMethodStore } from "@/app/stores/useShippingMethodStore";
import { usePaymentAccountStore } from "@/app/stores/usePaymentAccountStore";
import { useShopOrderStore } from "@/app/stores/useShopOrderStore";
import { useUserStore } from "@/app/stores/userStore";
import AddressFormModal from "@/app/components/user/AddressFormModal";

export default function CheckoutPage() {
  const router = useRouter();

  // ================= STORES =================
  const { cart, fetchCart, loading: cartLoading } = useShoppingCartStore();
  const { userAddresses, fetchUserAddresses } = useAddressStore();
  const { shippingMethods, fetchShippingMethods } = useShippingMethodStore();
  const { paymentAccounts, fetchPaymentAccounts } = usePaymentAccountStore();
  const { createOrder, loading: orderLoading } = useShopOrderStore();
  const { user } = useUserStore();

  const { addAddress } = useAddressStore();

  // ================= LOCAL STATE =================
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchCart();
    fetchUserAddresses();
    fetchShippingMethods();
    fetchPaymentAccounts();
  }, []);

  // Default selections logic
  useEffect(() => {
    if (!selectedAddressId && userAddresses.length > 0) {
      const primary = userAddresses.find((a) => a.is_primary) || userAddresses[0];
      setSelectedAddressId(primary.id);
    }
  }, [userAddresses, selectedAddressId]);

  useEffect(() => {
    if (!selectedMethodId && shippingMethods.length > 0) {
      setSelectedMethodId(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedMethodId]);

  useEffect(() => {
    if (!selectedPaymentId && paymentAccounts.length > 0) {
      setSelectedPaymentId(paymentAccounts[0].id);
    }
  }, [paymentAccounts, selectedPaymentId]);

  // ================= DERIVED DATA =================
  const items = cart?.items || [];
  const selectedShipping = shippingMethods.find((m) => m.id === selectedMethodId);
  const shippingCost = Number(selectedShipping?.price || 0);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.variant?.product_item?.product?.price || 0);
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const total = subtotal + shippingCost;

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedMethodId || !selectedPaymentId) {
      toast.error("Please complete all selection steps.");
      return;
    }

    const orderLines = items.map((item) => ({
      product_item_variant_id: item.product_item_variant_id,
      quantity: item.quantity,
      price: Number(item.variant?.product_item?.product?.price || 0),
    }));

    const orderData = {
      payment_method_id: selectedPaymentId,
      shipping_address_id: selectedAddressId,
      shipping_method_id: selectedMethodId,
      order_total: total,
      order_status_id: 1,
      order_lines: orderLines,
    };

    const result = await createOrder(orderData);

    if (result.success) {
      toast.success("Order placed successfully!");
      router.push("/orders");
    } else {
      toast.error(result.message || "Failed to place order.");
    }
  };

  const handleCreateAddress = async (data) => {
    const res = await addAddress(data);
    if (res.success) {
      toast.success("New destination registry entry created.");
      if (res.data?.id) {
        setSelectedAddressId(res.data.id);
      }
      fetchUserAddresses(); // Refresh list to ensure state consistency
    } else {
      toast.error(res.message || "Failed to establish registry entry.");
    }
  };

  // ================= LOADING =================
  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse rounded-full" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
          Initializing Secure Checkout...
        </p>
      </div>
    );
  }

  // ================= EMPTY =================
  if (!items.length && !cartLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-xs">
          Looks like you haven&apos;t added any components to your build yet.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Secure Checkout
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Finalize Order
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Review your logistics and authorize the transaction.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: SELECTIONS */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. SHIPPING ADDRESS */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold">Shipping Destination</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 group ${
                      selectedAddressId === addr.id
                        ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-indigo-600" />
                    )}
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold uppercase text-slate-500 mb-3">
                      {addr.is_primary ? "Default Address" : "Address"}
                    </span>
                    <p className="font-bold text-slate-900">{addr.province}</p>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">
                      {addr.house_number}, {addr.street}
                      <br />
                      {addr.commune}, {addr.district}
                    </p>
                  </button>
                ))}
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="p-5 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-400 group"
                >
                  <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Add New Address</span>
                </button>
              </div>
            </section>

            <AddressFormModal 
              isOpen={isAddressModalOpen}
              onClose={() => setIsAddressModalOpen(false)}
              onSave={handleCreateAddress}
            />

            {/* 2. SHIPPING METHOD */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold">Logistic Protocol</h2>
              </div>

              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      selectedMethodId === method.id
                        ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethodId === method.id ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                        <Package className={`w-6 h-6 ${selectedMethodId === method.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">{method.name}</p>
                        <p className="text-xs text-slate-500">Estimated delivery: 2-3 Business Days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">${Number(method.price).toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. PAYMENT METHOD */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold">Payment Authorization</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentAccounts.map((pay) => (
                  <button
                    key={pay.id}
                    onClick={() => setSelectedPaymentId(pay.id)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                      selectedPaymentId === pay.id
                        ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                     {selectedPaymentId === pay.id && (
                      <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-indigo-600" />
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                        Platform Registry
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{pay.account_name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                      {pay.type_value} • {pay.currency}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-lg">Order Summary</h3>
                  <p className="text-xs text-slate-500">{items.length} Items in cart</p>
                </div>

                <div className="p-6 max-h-[300px] overflow-y-auto space-y-4 custom-scrollbar">
                  {items.map((item) => {
                    const prod = item.variant?.product_item?.product || {};
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
                          {prod.images?.[0]?.image ? (
                            <Image 
                                src={prod.images[0].image} 
                                alt={prod.name} 
                                width={64} 
                                height={64} 
                                className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{prod.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {item.quantity} × ${Number(prod.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 bg-white space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">
                        {shippingCost === 0 ? "FREE" : `+$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-3xl font-black text-slate-900">
                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="w-full mt-6 h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 group"
                  >
                    {orderLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm Protocol</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                    By confirming, you agree to our Terms of Service. <br/> Secure encrypted transaction.
                  </p>
                </div>
              </div>

              {/* TRUST BADGE */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                    Join <span className="text-slate-900 font-bold">2,400+</span> engineers building with us this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}