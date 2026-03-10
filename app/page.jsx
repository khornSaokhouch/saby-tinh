"use client";

import React, { useEffect } from 'react';
import Navbar from '@/components/nabvar/Navbar';
import Footer from "@/components/nabvar/Footer";
import { ChevronRight, ArrowRight, Zap, Star, LayoutGrid } from 'lucide-react';
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
        const loadData = async () => {
            // Fetch all products to ensure all promotional offers from all owners are visible
            await Promise.all([fetchCategories(), fetchEvents(), fetchProducts()]);
        };
        loadData();
    }, [fetchCategories, fetchEvents, fetchProducts]);

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
    const popularProducts = products?.slice(0, 10).sort(() => 0.5 - Math.random()) || []; 

    return (
        <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            <Navbar />

            {/* HERO SECTION */}
            <main className="max-w-full mx-auto px-6 pt-28 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[500px]">
                    <div className="lg:col-span-3 h-full hidden lg:block">
                        <CategorySidebar categories={categories} />
                    </div>
                    <div className="lg:col-span-9 h-full">
                        <BannerSwiper events={events} />
                    </div>
                </div>
            </main>

            {/* 1. NEW ARRIVALS */}
            {newArrivals.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Star size={20} fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Our New Arrivals</h2>
                        </div>
                        <Link href="/new-arrivals" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {newArrivals.slice(0, 5).map((product) => (
                            <ProductCard key={`new-${product.id}`} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* 2. PROMOTIONAL OFFERS */}
            {promotionalProducts.length > 0 && (
               <section className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Promotional Offers</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {promotionalProducts.map((product) => (
                            <ProductCard key={`promo-${product.id}`} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* 3. POPULAR PRODUCTS */}
            {popularProducts.length > 0 && (
               <section className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Popular Products</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {popularProducts.slice(0, 5).map((product) => (
                            <ProductCard key={`popular-${product.id}`} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* 4. ALL PRODUCTS (Grid Layout) */}
           <section className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                            <LayoutGrid size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Collection</h2>
                    </div>
                    
                    <Link href="/store" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                        Full Catalog <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {products?.map((product) => (
                        <ProductCard key={`all-${product.id}`} product={product} />
                    ))}
                </div>
            </section>

            <PartnerLogoBanner />
            <Footer />
            <BecomeSellerButton />
        </div>
    );
}