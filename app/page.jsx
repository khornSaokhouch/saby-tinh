"use client";

import React, { useEffect } from 'react';
import Navbar from '@/components/nabvar/Navbar';
import Footer from "@/components/nabvar/Footer";
import { ArrowRight, Zap, LayoutGrid, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useEventStore } from '@/stores/useEventStore';
import { useProductStore } from '@/stores/useProductStore';

import CategorySidebar from '@/components/home/CategorySidebar';
import BannerSwiper from '@/components/home/BannerSwiper';
import ProductCard from '@/components/card/ProductCard';
import PartnerLogoBanner from '@/components/home/PartnerLogoBanner';
import BecomeSellerButton from '@/components/ui/BecomeSellerButton';

export default function HomePage() {
    const { categories, fetchCategories } = useCategoryStore();
    const { events, fetchEvents } = useEventStore();
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchEvents();
    }, []);

    const getIsNew = (date) => {
        const diff = Math.abs(new Date() - new Date(date));
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= 7;
    };

    const newArrivals = products?.filter(p => getIsNew(p.created_at)) || [];
    const promotionalProducts = products?.filter(p => {
        return (p.category?.promotions || []).some(promo => {
            if (promo.status !== 1) return false;
            const discountType = promo.discount_type || 'none';
            const discountValue = parseFloat(promo.discount_value || 0);
            if (discountType === 'none' || discountValue <= 0) return false;
            const now = new Date();
            const start = promo.start_date ? new Date(promo.start_date) : null;
            const end = promo.end_date ? new Date(promo.end_date) : null;
            return (!start || now >= start) && (!end || now <= end);
        });
    }) || [];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />

            {/* HERO */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-20 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[440px]">
                    <div className="lg:col-span-3 hidden lg:block h-full">
                        <CategorySidebar categories={categories} />
                    </div>
                    <div className="lg:col-span-9 w-full h-[320px] sm:h-[380px] lg:h-full">
                        <BannerSwiper events={events} />
                    </div>
                </div>
            </main>

            {/* MAIN CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-14 pb-20">

                {/* FLASH DEALS */}
                {promotionalProducts.length > 0 && (
                    <section>
                        <SectionLabel
                            icon={<Zap size={14} className="text-rose-500" />}
                            badge="bg-rose-50 text-rose-500"
                            title="Flash Deals"
                            subtitle="Limited time offers from our top merchants"
                            count={promotionalProducts.length}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {promotionalProducts.slice(0, 6).map(product => (
                                <ProductCard key={`promo-${product.id}`} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* NEW ARRIVALS */}
                {newArrivals.length > 0 && (
                    <section>
                        <SectionLabel
                            icon={<Sparkles size={14} className="text-indigo-500" />}
                            badge="bg-indigo-50 text-indigo-500"
                            title="New Arrivals"
                            subtitle="Just landed in our catalog"
                            count={newArrivals.length}
                            link="/new-arrivals"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {newArrivals.slice(0, 6).map(product => (
                                <ProductCard key={`new-${product.id}`} product={product} />
                            ))}
                        </div>
                    </section>
                )}
                

                {/* EXPLORE */}
                <section>
                    <SectionLabel
                        icon={<LayoutGrid size={14} className="text-slate-500" />}
                        badge="bg-slate-100 text-slate-500"
                        title="Explore Collection"
                        subtitle="Hardware, accessories and more"
                        count={products?.length}
                        link="/store"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {products?.slice(0, 12).map(product => (
                            <ProductCard key={`all-${product.id}`} product={product} />
                        ))}
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/store"
                            className="group inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                        >
                            Browse All Products
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </section>
            </div>

            <PartnerLogoBanner />
            <Footer />
            <BecomeSellerButton />
        </div>
    );
}

/* ────────────────────────────────────────────────── */
/* Clean Section Label                               */
/* ────────────────────────────────────────────────── */
function SectionLabel({ icon, badge, title, subtitle, count, link }) {
    return (
        <div className="flex items-end justify-between gap-4 mb-7">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${badge}`}>
                    {icon}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
                        {count !== undefined && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {count}
                            </span>
                        )}
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                </div>
            </div>

            {link && (
                <Link
                    href={link}
                    className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    View all <ArrowRight size={13} />
                </Link>
            )}
        </div>
    );
}