"use client";

import React, { useEffect, useState  } from 'react';
import Navbar from '@/components/nabvar/Navbar';
import Footer from "@/components/nabvar/Footer";
import { ChevronRight, ArrowRight, Zap, Star, LayoutGrid, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useEventStore } from '@/stores/useEventStore';
import { useProductStore } from '@/stores/useProductStore';

import CategorySidebar from '@/components/home/CategorySidebar';
import BannerSwiper from '@/components/home/BannerSwiper';
import ProductCard from '@/components/card/ProductCard';
import PartnerLogoBanner from '@/components/home/PartnerLogoBanner';
import BecomeSellerButton from '@/components/ui/BecomeSellerButton';
import SectionHeader from '@/components/ui/SectionHeader';

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
            
            // Basic hasPromotion logic alignment
            const discountType = promo.discount_type || 'none';
            const discountValue = parseFloat(promo.discount_value || 0);
            if (discountType === 'none' || discountValue <= 0) return false;

            // Date validation (if available from backend)
            const now = new Date();
            const start = promo.start_date ? new Date(promo.start_date) : null;
            const end = promo.end_date ? new Date(promo.end_date) : null;
            return (!start || now >= start) && (!end || now <= end);
        });
    }) || [];

    return (
        <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900">
            <Navbar />

            {/* HERO SECTION - Refined Spacing */}
            <main className="max-w-[1400px] mx-auto px-4 pt-20 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[450px]">
                    {/* Sidebar: Hidden on mobile, 3 cols on desktop */}
                    <div className="lg:col-span-3 hidden lg:block h-full">
                        <CategorySidebar categories={categories} />
                    </div>
                    
                    {/* Banner: Full width on mobile, 9 cols on desktop */}
                    <div className="lg:col-span-9 w-full h-[350px] sm:h-[400px] lg:h-full">
                        <BannerSwiper events={events} />
                    </div>
                </div>
            </main>

            <div className="max-w-[1400px] mx-auto px-4 space-y-16 pb-20">
                
                {/* 1. PROMOTIONAL - High Visibility */}
                {promotionalProducts.length > 0 && (
                   <section>
                        <SectionHeader 
                            title="Flash Deals" 
                            subtitle="Limited time offers from our top merchants" 
                            icon={Zap} 
                            color="text-rose-500 bg-rose-50"
                            count={promotionalProducts.length}
                            deadline={promotionalProducts.reduce((acc, p) => {
                                const end = (p.category?.promotions || []).find(pr => pr.status === 1)?.end_date;
                                if (!end) return acc;
                                const date = new Date(end);
                                if (!acc || date < acc) return date;
                                return acc;
                            }, null)}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {promotionalProducts.slice(0, 6).map((product) => (
                                <ProductCard key={`promo-${product.id}`} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. NEW ARRIVALS */}
                {newArrivals.length > 0 && (
                    <section>
                        <SectionHeader 
                            title="New Arrivals" 
                            subtitle="Just landed in our global catalog" 
                            icon={Sparkles} 
                            color="text-indigo-600 bg-indigo-50"
                            link="/new-arrivals"
                            count={newArrivals.length}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {newArrivals.slice(0, 6).map((product) => (
                                <ProductCard key={`new-${product.id}`} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. MAIN EXPLORATION */}
                <section>
                    <SectionHeader 
                        title="Explore Collection" 
                        subtitle="Curated hardware and premium accessories" 
                        icon={LayoutGrid} 
                        color="text-slate-600 bg-slate-100"
                        link="/store"
                        count={products?.length}
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {products?.slice(0, 12).map((product) => (
                            <ProductCard key={`all-${product.id}`} product={product} />
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Link href="/store" className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm">
                            Browse Entire Registry <ArrowRight size={14} />
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