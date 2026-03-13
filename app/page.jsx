"use client";

import React, { useEffect } from 'react';
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

export default function HomePage() {
    const { categories, fetchCategories } = useCategoryStore();
    const { events, fetchEvents } = useProductStore(); // Assuming fetchEvents is here or in useEventStore
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const getIsNew = (date) => {
        const diff = Math.abs(new Date() - new Date(date));
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= 7;
    };

    const newArrivals = products?.filter(p => getIsNew(p.created_at)) || [];
    const promotionalProducts = products?.filter(p => {
        const storeUserId = p.store?.user_id || p.store?.user?.id;
        return (p.category?.promotions || []).some(promo => 
            promo.user_id === storeUserId && promo.status === 1
        );
    }) || [];

    return (
        <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900">
            <Navbar />

            {/* HERO SECTION - Refined Spacing */}
            <main className="max-w-[1400px] mx-auto px-4 pt-20 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[300px] md:h-[420px]">
                    <div className="lg:col-span-3 h-full hidden lg:block">
                        <CategorySidebar categories={categories} />
                    </div>
                    <div className="lg:col-span-9 h-full">
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

/* Helper Component for Headers */
function SectionHeader({ title, subtitle, icon: Icon, color, link }) {
    return (
        <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${color} shadow-sm`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{title}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{subtitle}</p>
                </div>
            </div>
            {link && (
                <Link href={link} className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                    View All <ChevronRight size={14} strokeWidth={3} />
                </Link>
            )}
        </div>
    );
}