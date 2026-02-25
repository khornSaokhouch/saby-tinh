'use client';

import { useState, useMemo } from "react";
import { 
  ChevronDown, HelpCircle, Rocket, ShieldCheck, 
  MessageSquare, Search, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const allFaqs = [
    // General Information
    {
        id: 1,
        category: "General",
        question: "What is Saby-Tinh?",
        answer: "Saby-Tinh is a high-performance procurement platform designed to streamline hardware acquisition for enterprises and SMEs.",
    },
    {
        id: 2,
        category: "General",
        question: "Who can use the platform?",
        answer: "Our ecosystem supports individual buyers, retail partners, and large-scale enterprise procurement teams.",
    },
    {
        id: 3,
        category: "General",
        question: "Is there a trial period?",
        answer: "Yes, we offer a 14-day comprehensive trial for our Pro and Enterprise tiers, with no credit card required upfront.",
    },
    // Platform Features
    {
        id: 4,
        category: "Platform Features",
        question: "Can I customize my storefront?",
        answer: "Absolutely. Partners get access to a modular dashboard where they can brand their store, manage inventory, and set custom pricing rules.",
    },
    {
        id: 5,
        category: "Platform Features",
        question: "Does it support API integration?",
        answer: "Yes, our REST API allows seamless synchronization with your existing ERP, CRM, or inventory management software.",
    },
    {
        id: 6,
        category: "Platform Features",
        question: "How does real-time tracking work?",
        answer: "We utilize direct API hooks with major logistics providers to give you granular, real-time status updates on every shipment.",
    },
    // Security & Support
    {
        id: 7,
        category: "Security & Support",
        question: "How is my data secured?",
        answer: "We employ AES-256 encryption at rest and TLS 1.3 for data in transit. Our infrastructure is SOC 2 Type II compliant.",
    },
    {
        id: 8,
        category: "Security & Support",
        question: "What support channels are available?",
        answer: "All users have access to email support. Premium tiers include 24/7 dedicated phone lines and a priority Slack channel.",
    },
];

const categoryIcons = {
    "General": HelpCircle,
    "Platform Features": Rocket,
    "Security & Support": ShieldCheck
};

export default function FAQContent() {
    const [openIndex, setOpenIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = useMemo(() => {
        if (activeCategory === "All") return allFaqs;
        return allFaqs.filter(faq => faq.category === activeCategory);
    }, [activeCategory]);
    
    const categories = useMemo(() => ["All", ...new Set(allFaqs.map(faq => faq.category))], []);

    return (
        <section className="max-w-7xl mx-auto p-6 font-sans">
            
            {/* --- HEADER --- */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                    <HelpCircle size={14} /> Help Center
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Everything you need to know about the product and billing. Can’t find the answer you’re looking for? Please chat to our friendly team.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* --- SIDEBAR FILTER --- */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <nav className="space-y-1">
                            {categories.map((category) => {
                                const Icon = categoryIcons[category];
                                const isActive = activeCategory === category;
                                
                                return (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setActiveCategory(category);
                                            setOpenIndex(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                            isActive
                                                ? "bg-slate-900 text-white shadow-md"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        {category === "All" ? <Search size={18} /> : (Icon && <Icon size={18} />)}
                                        <span>{category}</span>
                                        {category !== "All" && (
                                            <span className={`ml-auto text-[10px] py-0.5 px-2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {allFaqs.filter(f => f.category === category).length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Support Card */}
                    <div className="mt-6 bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-2">Need direct help?</h4>
                            <p className="text-xs text-indigo-100 font-medium mb-6 leading-relaxed">
                                Our support team is available 24/7 to assist with any technical issues or inquiries.
                            </p>
                            <Link 
                                href="/contact-us"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 transition-colors"
                            >
                                Contact Us <ArrowRight size={12} />
                            </Link>
                        </div>
                        {/* Decor */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    </div>
                </div>

                {/* --- ACCORDION CONTENT --- */}
                <div className="lg:col-span-8 space-y-4">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {filteredFaqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                                        openIndex === index 
                                            ? "bg-white border-indigo-200 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-100" 
                                            : "bg-white border-slate-200 hover:border-indigo-100"
                                    }`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex justify-between items-start p-6 text-left"
                                    >
                                        <div className="flex gap-4">
                                            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                                openIndex === index ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                            }`}>
                                                <HelpCircle size={14} />
                                            </div>
                                            <span className={`text-base font-bold transition-colors ${openIndex === index ? "text-slate-900" : "text-slate-700"}`}>
                                                {faq.question}
                                            </span>
                                        </div>
                                        <ChevronDown 
                                            size={20}
                                            className={`text-slate-400 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-indigo-600" : ""}`}
                                        />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-6 pl-[4.5rem] pr-8">
                                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold text-sm">No FAQs found in this section.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- BOTTOM CTA --- */}
            <div className="mt-20 bg-slate-900 rounded-[40px] p-10 sm:p-12 text-center relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-300 border border-white/10">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Still have questions?</h2>
                    <p className="text-slate-400 font-medium text-lg">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Link
                            href="/contact-us"
                            className="px-8 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                        >
                            Get in touch
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}