'use client';

import { useState, useEffect, useMemo } from "react";
import { 
  ShieldCheck, Database, Eye, Share2, 
  Lock, Cookie, Scale, History, 
  Mail, ArrowRight, FileText, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- DATA ---
const policySections = [
    { 
        id: "info-collection", 
        title: "1. Information We Collect", 
        icon: Database,
        content: "We may collect personal identification information such as your name, email address, and physical address when you register. We also collect financial data (payment details) and usage data (IP address, browser type) when you interact with our services."
    },
    { 
        id: "info-use", 
        title: "2. How We Use Information", 
        icon: Eye,
        content: "Your information is used to provide and improve our services, process payments, deliver security alerts, and personalize your experience. We analyze usage data to understand user behavior and enhance our offerings."
    },
    { 
        id: "info-sharing", 
        title: "3. Sharing of Information", 
        icon: Share2,
        content: "We operate on a strict no-sale policy. We only share limited information with trusted third-party partners (payment processors, shipping providers) strictly when necessary to fulfill our core business services."
    },
    { 
        id: "data-security", 
        title: "4. Data Security", 
        icon: Lock,
        content: "We prioritize your data security using state-of-the-art encryption (SSL/TLS) and regular security audits. While we implement strong measures, please remember that no method of online transmission is 100% secure."
    },
    { 
        id: "cookies", 
        title: "5. Cookies and Tracking", 
        icon: Cookie,
        content: "Our platform uses cookies to enhance your experience, maintain sessions, and analyze traffic. You may choose to disable cookies in your browser settings, though this may impact some functionality."
    },
    { 
        id: "your-rights", 
        title: "6. Your Rights", 
        icon: Scale,
        content: "You maintain fundamental rights to access, correct, or delete your personal data. To exercise any of these rights, please contact our Data Protection Officer directly."
    },
    { 
        id: "policy-changes", 
        title: "7. Policy Changes", 
        icon: History,
        content: "We reserve the right to update this policy periodically. Significant changes will be notified by updating the 'Last Updated' date at the top of this page. Continued use constitutes acceptance."
    },
    { 
        id: "contact", 
        title: "8. Contact Us", 
        icon: Mail,
        content: "If you have questions about this Privacy Policy or our data handling practices, please contact our Data Protection Officer at support@e-commerces.com."
    },
];

export default function PrivacyPolicyContent() {
    const [activeId, setActiveId] = useState("info-collection");

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
        policySections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="max-w-6xl mx-auto p-6 font-sans">
            
            {/* --- HEADER --- */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                    <ShieldCheck size={14} /> Legal Center
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Privacy Policy
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Your trust is our priority. Last updated <span className="text-slate-900 font-bold underline decoration-indigo-500/30">October 3, 2025</span>. 
                    Please read how we handle and protect your data.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* --- SIDEBAR NAVIGATION (Matches FAQ Sidebar) --- */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="px-4 py-3 mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            On this page
                        </div>
                        <nav className="space-y-1">
                            {policySections.map((section) => {
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

                    {/* Simple Help Card */}
                    <div className="mt-6 bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-2">Legal concerns?</h4>
                            <p className="text-xs text-indigo-100 font-medium mb-6 leading-relaxed">
                                Our legal team is available for clarification on data processing agreements.
                            </p>
                            <Link 
                                href="/contact-us"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 transition-colors"
                            >
                                Contact Legal <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    </div>
                </div>

                {/* --- CONTENT CARDS (Matches FAQ Accordion Style) --- */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
                        <div className="flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Introduction</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">What this document covers.</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-base leading-loose font-medium">
                            At <span className="text-indigo-600 font-bold">Saby-Tinh</span>, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our procurement platform.
                        </p>
                    </div>

                    {policySections.map((section) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className={`group rounded-2xl border transition-all duration-300 p-8 ${
                                activeId === section.id 
                                    ? "bg-white border-indigo-200 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-100" 
                                    : "bg-white border-slate-200"
                            }`}
                        >
                            <div className="flex gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                    activeId === section.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                                }`}>
                                    <section.icon size={20} />
                                </div>
                                <h3 className={`text-xl font-black transition-colors ${
                                    activeId === section.id ? "text-slate-900" : "text-slate-700"
                                }`}>
                                    {section.title}
                                </h3>
                            </div>
                            
                            <p className="text-slate-500 text-base leading-loose font-medium ml-14">
                                {section.content}
                                {section.id === "contact" && (
                                    <Link 
                                        href="mailto:support@e-commerces.com"
                                        className="block mt-4 text-indigo-600 font-bold hover:underline"
                                    >
                                        support@e-commerces.com
                                    </Link>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM CTA (Dark Theme) --- */}
            <div className="mt-20 bg-slate-900 rounded-[40px] p-10 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-300 border border-white/10">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Need further clarification?</h2>
                    <p className="text-slate-400 font-medium text-lg">
                        If you have a specific inquiry regarding GDPR, CCPA, or data processing, our privacy team is here to help.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Link
                            href="/contact-us"
                            className="px-8 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                        >
                            Contact Privacy Team
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}