'use client';

import { useState, useEffect } from "react";
import { 
  Scale, CheckCircle, Globe, UserCheck, 
  CreditCard, AlertTriangle, Copyright, Edit3, 
  Mail, ArrowRight, BookOpen, ChevronRight, Info
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- DATA ---
const termsSections = [
    { 
        id: "acceptance", 
        title: "1. Acceptance of Terms", 
        icon: CheckCircle,
        content: "By accessing or using E-Commerces, you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you do not agree, you must discontinue use immediately."
    },
    { 
        id: "platform-use", 
        title: "2. Use of the Platform", 
        icon: Globe,
        content: "You agree to use the platform only for lawful purposes. Specifically, you must not transmit material that is harassing, libelous, abusive, or otherwise objectionable. Misuse may result in immediate account termination."
    },
    { 
        id: "accounts", 
        title: "3. Accounts and Security", 
        icon: UserCheck,
        content: "You are solely responsible for maintaining the confidentiality of your account credentials. We are not liable for any loss arising from your failure to comply with security obligations. Notify us immediately of any breach."
    },
    { 
        id: "payments", 
        title: "4. Payments & Billing", 
        icon: CreditCard,
        content: "All payments are subject to our billing policies. Subscription fees are non-refundable unless otherwise stated. You authorize us to charge your payment method for all applicable fees and taxes."
    },
    { 
        id: "liability", 
        title: "5. Limitation of Liability", 
        icon: AlertTriangle,
        content: "E-Commerces is not liable for indirect, incidental, or punitive damages. Our total aggregate liability is expressly limited to the amount you paid us in fees in the 12 months preceding the claim."
    },
    { 
        id: "ip", 
        title: "6. Intellectual Property", 
        icon: Copyright,
        content: "All content, trademarks, and logos on the platform are the exclusive property of E-Commerces. You may not reproduce, distribute, or create derivative works without our express written permission."
    },
    { 
        id: "modifications", 
        title: "7. Modifications", 
        icon: Edit3,
        content: "We reserve the right to update these Terms at any time. We will provide reasonable notice of material changes. Continued use of the platform after changes constitutes your acceptance of the new terms."
    },
    { 
        id: "contact-legal", 
        title: "8. Contact Information", 
        icon: Mail,
        content: "If you have any questions or concerns regarding these Terms of Service, please contact our Legal Department directly at support@e-commerces.com."
    },
];

export default function TermsOfServiceContent() {
    const [activeId, setActiveId] = useState("acceptance");

    // Scroll Spy Logic
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        termsSections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
    };

    return (
        <section className="max-w-6xl mx-auto p-6 font-sans">
            
            {/* --- HEADER --- */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                    <Scale size={14} /> Legal Agreement
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                    Terms of Service
                </h1>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Welcome to <span className="text-indigo-600 font-bold">E-Commerces</span>. 
                    Effective Date: <span className="text-slate-900 font-bold underline decoration-indigo-500/30 text-sm">October 3, 2025</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* --- SIDEBAR NAVIGATION --- */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="px-4 py-3 mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Legal Navigation
                        </div>
                        <nav className="space-y-1">
                            {termsSections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeId === section.id;
                                
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                            isActive
                                                ? "bg-slate-900 text-white shadow-md"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="truncate">{section.title}</span>
                                        {isActive && (
                                            <motion.div layoutId="activeInd" className="ml-auto">
                                                <ChevronRight size={14} className="text-indigo-400" />
                                            </motion.div>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Key Commitments Card */}
                    <div className="mt-6 bg-slate-50 border border-slate-200 p-6 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                                <Info size={20} />
                            </div>
                            <h4 className="text-slate-900 font-black mb-2">Key Commitments</h4>
                            <ul className="space-y-3">
                                {['Full Acceptance', 'Account Responsibility', 'Limited Liability'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <div className="w-1 h-1 rounded-full bg-indigo-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT CARDS --- */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Intro Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 border-l-4 border-l-indigo-600">
                        <div className="flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Platform Overview</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Understanding this agreement.</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-loose font-medium">
                            These terms constitute a legally binding agreement between you and E-Commerces. By using our services, you acknowledge that you have read, understood, and agree to be bound by these provisions.
                        </p>
                    </div>

                    {/* Dynamic Sections */}
                    {termsSections.map((section) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className={`group rounded-2xl border transition-all duration-300 p-8 ${
                                activeId === section.id 
                                    ? "bg-white border-indigo-200 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-100" 
                                    : "bg-white border-slate-200 hover:border-indigo-100"
                            }`}
                        >
                            <div className="flex gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                    activeId === section.id ? "bg-indigo-600 text-white rotate-3" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                }`}>
                                    <section.icon size={20} />
                                </div>
                                <h3 className={`text-xl font-black transition-colors ${
                                    activeId === section.id ? "text-slate-900" : "text-slate-700"
                                }`}>
                                    {section.title}
                                </h3>
                            </div>
                            
                            <p className="text-slate-500 text-sm leading-loose font-medium ml-0 md:ml-14">
                                {section.content}
                                {section.id === "contact-legal" && (
                                    <Link 
                                        href="mailto:support@e-commerces.com"
                                        className="inline-flex items-center gap-1 mt-4 text-indigo-600 font-bold hover:underline"
                                    >
                                        support@e-commerces.com <ArrowRight size={14} />
                                    </Link>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM CTA --- */}
            <div className="mt-20 bg-slate-900 rounded-[40px] p-10 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-300 border border-white/10">
                        <Scale size={32} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Questions about these terms?</h2>
                    <p className="text-slate-400 font-medium text-sm">
                        If you require a formal Data Processing Agreement (DPA) or have specific legal inquiries, please reach out.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Link
                            href="/contact-us"
                            className="px-8 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                        >
                            Contact Legal Team
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}