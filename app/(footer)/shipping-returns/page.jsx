'use client';

import { 
  Truck, ShieldCheck, Clock, RefreshCcw, 
  HelpCircle, AlertCircle, Phone, Mail, 
  ArrowRight, CreditCard, Box, Archive
} from 'lucide-react';
import Link from 'next/link';

export default function ShippingReturnsPage() {
    return (
        <section className="max-w-6xl mx-auto p-6 font-sans">
            
            {/* --- HEADER --- */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Truck size={14} /> Shipping & Returns
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                    Fast Shipping. Simple Returns.
                </h1>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    We ensure your procurement reaches you safely and on time. If something isn't right, our returns process is designed to be frictionless for enterprise needs.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <HighlightCard 
                    icon={Clock} 
                    title="Express Delivery" 
                    desc="Standard shipping within 2-3 business days. Priority next-day delivery available for enterprise accounts." 
                />
                <HighlightCard 
                    icon={ShieldCheck} 
                    title="Insured Shipment" 
                    desc="All hardware shipments are fully insured. We guarantee safe arrival or a prompt replacement." 
                />
                <HighlightCard 
                    icon={RefreshCcw} 
                    title="30-Day Returns" 
                    desc="Unopened items can be returned within 30 days. No restocking fees for our premium partners." 
                />
            </div>

            {/* Detailed Policies */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    
                    <PolicySection 
                        title="Shipping Policies" 
                        icon={Truck}
                        content={[
                            { label: "Domestic Shipping", text: "We ship to all provinces with dedicated logistics partners. Standard rates apply for bulk orders." },
                            { label: "International", text: "Global shipping available. Customs and duties are handled transparently at checkout." },
                            { label: "Handling Time", text: "Orders are processed within 24 hours. Tracking numbers are auto-generated upon dispatch." }
                        ]}
                    />

                    <PolicySection 
                        title="Returns & Refunds" 
                        icon={Archive}
                        content={[
                            { label: "Eligibility", text: "Items must be in original packaging with all seals intact. Software licenses are non-refundable once activated." },
                            { label: "Process", text: "Log a return request via your dashboard or contact support. We provide pre-paid shipping labels." },
                            { label: "Refund Timeline", text: "Refunds are processed to the original payment method within 5-7 business days after inspection." }
                        ]}
                    />

                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                        <h4 className="text-lg font-black mb-4">Support Center</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                            Need help with a specific shipment or have complex return requirements? Our team is ready.
                        </p>
                        <div className="space-y-4">
                            <ContactLink icon={Phone} text="+855 123 4567" />
                            <ContactLink icon={Mail} text="logistics@saby-tinh.com" />
                        </div>
                        <div className="mt-8">
                             <Link 
                                href="/contact-us"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                Contact Support <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-8">
                         <div className="flex items-center gap-3 mb-4">
                            <HelpCircle size={20} className="text-indigo-600" />
                            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Quick FAQ</h4>
                         </div>
                         <p className="text-indigo-700/70 text-xs font-semibold leading-relaxed">
                            "Can I change my shipping address after an order is placed?"
                         </p>
                         <p className="mt-2 text-indigo-900/60 text-xs font-medium italic">
                            Yes, if the order hasn't reached 'Dispatched' status. Contact us immediately.
                         </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HighlightCard({ icon: Icon, title, desc }) {
    return (
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3 mb-6">
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">{title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function PolicySection({ title, icon: Icon, content }) {
    return (
        <div className="bg-white border border-slate-200 rounded-[32px] p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{item.label}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ContactLink({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Icon size={14} />
            </div>
            <span className="text-xs font-bold">{text}</span>
        </div>
    );
}
