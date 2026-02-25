'use client';

import React from 'react';
import { 
  Target, Users, Zap, Globe, ShieldCheck, 
  BarChart3, MessageSquare, ArrowRight,
  Sparkles, CheckCircle2, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const stats = [
    { label: "Hardware Partners", value: "2.5k+", icon: ShoppingBag },
    { label: "Global Reach", value: "80+ Cities", icon: Globe },
    { label: "Efficiency Boost", value: "+40%", icon: Zap },
    { label: "Secure Data", value: "ISO Cert", icon: ShieldCheck },
];

const values = [
    {
        title: "Agile Sourcing",
        desc: "Smart e-commerce logic that finds the best hardware deals in seconds, not days.",
        icon: Sparkles,
        color: "bg-indigo-50 text-indigo-600"
    },
    {
        title: "Client-Centric",
        desc: "We build for the end-user. Simple interfaces for complex procurement tasks.",
        icon: Users,
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        title: "Data Intelligence",
        desc: "Advanced analytics to track every dollar spent across your supply chain.",
        icon: BarChart3,
        color: "bg-amber-50 text-amber-600"
    }
];

export default function AboutUsPage() {
    return (
        <main className="min-h-screen bg-white">
            
            {/* --- HERO SECTION --- */}
            <section className="relative p-4 overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4"
                        >
                            <Target size={12} /> Our Vision
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4"
                        >
                            Simplifying E-Commerce for <span className="text-indigo-600 italic">Saby-Tinh</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-base text-slate-500 font-medium leading-relaxed"
                        >
                            Saby-Tinh is a specialized procurement platform. We bridge the gap between 
                            premium hardware suppliers and growing businesses through a high-performance 
                            e-commerce ecosystem.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* --- COMPACT STATS --- */}
            <section className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center"
                        >
                            <div className="text-xl font-black text-slate-900 mb-0.5">{stat.value}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- STORY SECTION --- */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-slate-900">Next-Gen Procurement</h2>
                        <p className="text-slate-500 text-sm leading-loose font-medium">
                            Traditional e-commerce is too slow for modern hardware needs. Saby-Tinh 
                            was engineered to handle bulk sourcing, complex logistics, and enterprise 
                            billing in one unified dashboard.
                        </p>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Automated inventory sync",
                                "Direct factory-to-business shipping",
                                "Enterprise-grade security protocols"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-slate-700 text-sm font-bold">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-video rounded-3xl bg-slate-900 overflow-hidden relative flex items-center justify-center border-4 border-white shadow-2xl">
                             <ShoppingBag size={48} className="text-indigo-500 opacity-50" />
                             <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                                <p className="text-[10px] text-white font-bold">Trusted by 2,000+ Brands</p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- VALUES SECTION --- */}
            <section className="bg-slate-50 py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">The Saby-Tinh Way</h2>
                        <p className="text-sm text-slate-500 font-medium">Our core principles for digital commerce.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${value.color}`}>
                                    <value.icon size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- REFINED CTA --- */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-slate-900 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                    
                    <div className="relative z-10 max-w-xl mx-auto space-y-6">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Elevate your procurement today.
                        </h2>
                        <p className="text-slate-400 font-medium text-sm">
                            Join the Saby-Tinh network and simplify your hardware acquisition.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                            <Link
                                href="/contact-us"
                                className="px-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xl"
                            >
                                Contact Sales
                            </Link>
                            <Link
                                href="/faq"
                                className="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all border border-slate-700"
                            >
                                Browse FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}