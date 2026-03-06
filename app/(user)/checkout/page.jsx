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
import { usePaymentStore } from "@/app/stores/usePaymentStore";
import AddressFormModal from "@/app/components/user/AddressFormModal";
import BakongQrModal from "@/app/components/payment/BakongQrModal";

export default function CheckoutPage() {
  const router = useRouter();

  // ================= STORES =================
  const { cart, fetchCart, loading: cartLoading } = useShoppingCartStore();
  const { userAddresses, fetchUserAddresses, addAddress } = useAddressStore();
  const { shippingMethods, fetchShippingMethods } = useShippingMethodStore();
  const { paymentAccounts, fetchPaymentAccounts } = usePaymentAccountStore();
  const { createOrder, loading: orderLoading } = useShopOrderStore();
  const { generateBakongQr, qrData } = usePaymentStore();

  // ================= LOCAL STATE =================
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchCart();
    fetchUserAddresses();
    fetchShippingMethods();
    fetchPaymentAccounts();
  }, []);

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

  // ================= HANDLERS =================
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
      const orderId = result.data.id;
      setCurrentOrderId(orderId);

      const selectedPayment = paymentAccounts.find(p => p.id === selectedPaymentId);
      const isBakong = selectedPayment?.account_name?.toLowerCase().includes('bakong') ||
                       selectedPayment?.type_value?.toLowerCase().includes('bakong');

      if (isBakong) {
        const qrResult = await generateBakongQr(orderId, selectedPaymentId, selectedPayment.currency || 'USD');
        if (qrResult.success) {
          setIsQrModalOpen(true);
          return;
        }
      }

      toast.success("Order placed successfully!");
      router.push("/orders");
    } else {
      toast.error(result.message || "Failed to place order.");
    }
  };

  const handleCreateAddress = async (data) => {
    const res = await addAddress(data);
    if (res.success) {
      toast.success("Address added.");
      if (res.data?.id) setSelectedAddressId(res.data.id);
      fetchUserAddresses();
    }
  };

  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Checkout</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Review your details and complete your purchase.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* SELECTIONS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. SHIPPING ADDRESS */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Destination
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative p-4 rounded-xl border transition-all text-left ${
                      selectedAddressId === addr.id
                        ? "border-indigo-600 bg-indigo-50/30 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-indigo-600" />
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{addr.is_primary ? "Default" : "Address"}</span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{addr.province}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{addr.house_number}, {addr.street}, {addr.district}</p>
                  </button>
                ))}
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="p-4 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-xs font-semibold">New Address</span>
                </button>
              </div>
            </section>

            {/* 2. SHIPPING METHOD */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Delivery Method
              </h2>
              <div className="space-y-2">
                {shippingMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                      selectedMethodId === method.id
                        ? "border-indigo-600 bg-indigo-50/30 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMethodId === method.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 text-sm">{method.name}</p>
                        <p className="text-[10px] text-slate-500 italic">Est: 2-3 Business Days</p>
                      </div>
                    </div>
                    <p className="font-bold text-indigo-600 text-sm">${Number(method.price).toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. PAYMENT METHOD */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Payment Authorization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentAccounts.map((pay) => {
                  const isBakong = pay.type_value?.toLowerCase().includes('bakong') || pay.account_name?.toLowerCase().includes('bakong');
                  return (
                    <button
                      key={pay.id}
                      onClick={() => setSelectedPaymentId(pay.id)}
                      className={`relative p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                        selectedPaymentId === pay.id
                          ? "border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-600/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {selectedPaymentId === pay.id && (
                        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-600" />
                      )}
                      
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {isBakong ? (
                          <img src="/img/khqr.png" alt="Bakong" className="w-8 h-8 object-contain" />
                        ) : (
                          <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px] italic">
                            {pay.type_value?.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-none mb-1">{pay.type_value}</span>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-60">Settlement: {pay.currency}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="font-bold text-slate-900">Order Summary</h3>
              </div>

              <div className="p-6 max-h-[240px] overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                      {item.variant?.product_item?.product?.images?.[0]?.image ? (
                        <Image src={item.variant.product_item.product.images[0].image} alt="product" width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-slate-300" /></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.variant?.product_item?.product?.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.quantity} × ${Number(item.variant?.product_item?.product?.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white space-y-3 pt-0">
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">{shippingCost === 0 ? "FREE" : `+$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                    <span className="text-2xl font-black text-slate-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full mt-4 h-12 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  {orderLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm Order</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddressFormModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} onSave={handleCreateAddress} />
      <BakongQrModal 
        isOpen={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)} 
        qrData={qrData} 
        orderId={currentOrderId} 
        onPaymentSuccess={() => { toast.success("Payment successful!"); router.push("/orders"); }} 
      />
    </div>
  );
}