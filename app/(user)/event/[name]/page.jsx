"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEventStore } from "@/stores/useEventStore";
import { useProductStore } from "@/stores/useProductStore";
import ProductCard from "@/components/card/ProductCard";
import Link from "next/link";
import { 
  Calendar, MapPin, Share2, ArrowLeft, Clock, 
  ChevronRight, ExternalLink, ShieldCheck, Users,
  Tag, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const slugify = (text) =>
  (text || "").toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

export default function EventDetails() {
  const { name } = useParams();
  const router = useRouter();
  const eventStore = useEventStore();
  const productStore = useProductStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, { 
      year: "numeric", month: "short", day: "numeric" 
    });
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      productStore.clearProducts(); // Clear old products immediately
      
      try {
        const data = await eventStore.fetchEventBySlug(name);
        if (data) {
          setEvent(data);
          if (data) {
            setProductsLoading(true);
            await productStore.fetchProductsByFilters({ 
              eventName: data.name,
              silent: true 
            });
            setProductsLoading(false);
          } else {
            // Explicitly ensure products are empty if no promotion
            productStore.clearProducts();
          }
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchEventData();
  }, [name]);

  if (loading) return <LoadingScreen />;
  if (!event) return null;

  return (
    <div className="min-h-screen">
      {/* Header - Slimmer */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-[12px] font-bold">Back</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-2">

        {/* Campaign Products Section */}
        <section className="mt-12 mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 rounded-full">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Featured Deals</span>
              </div>
              
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Campaign Collection
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-lg">
                  Exclusive offers available during this event. Grab them before they're gone!
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                {event.promotion?.end_date && (
                    <CountdownTimer deadline={event.promotion.end_date} />
                )}
                
                <Link href="/products" className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform border-l border-slate-200 pl-6 h-8">
                    View All Products <ChevronRight size={14} strokeWidth={3} />
                </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-100 animate-pulse" />
              ))
            ) : productStore.products.length > 0 ? (
              productStore.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Tag className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No products found</h3>
                <p className="text-[11px] text-slate-400 mt-1">Check back later for campaign updates.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* Helper Component for Countdown */
function CountdownTimer({ deadline }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(deadline).getTime() - now;
            
            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    return (
        <div className="flex items-center gap-1.5 ml-0 sm:ml-4 mt-2 sm:mt-0">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg">Ends In:</span>
            <div className="flex gap-1">
                {[
                    { label: 'd', value: timeLeft.days },
                    { label: 'h', value: timeLeft.hours },
                    { label: 'm', value: timeLeft.minutes },
                    { label: 's', value: timeLeft.seconds }
                ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-slate-900 text-white min-w-[28px] py-1 rounded-lg shadow-sm border border-slate-700">
                        <span className="text-[11px] font-black tabular-nums leading-none">
                            {unit.value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );
}
