'use client';

import { useState } from "react";
import { 
  Package, Search, Truck, CheckCircle, 
  Clock, MapPin, ArrowRight, Loader2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [isTracking, setIsTracking] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setIsTracking(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTracking(false);
        setShowStatus(true);
    };

    return (
        <section className="max-w-4xl mx-auto p-6 font-sans">
            {/* Header */}
            <div className="text-center mb-12 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Package size={12} /> Logistics
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
                    Track Your Shipment
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Enter your order ID or tracking number to get real-time status updates on your hardware procurement.
                </p>
            </div>

            {/* Tracking Form */}
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-200 shadow-sm mb-12">
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            required
                            placeholder="Order ID (e.g., SBT-12345)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isTracking}
                        className="h-12 px-8 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isTracking ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                        {isTracking ? "Locating..." : "Track Order"}
                    </button>
                </form>
            </div>

            {/* Tracking Result Stub */}
            <AnimatePresence>
                {showStatus && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                             <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Current Status</span>
                                    <h2 className="text-xl font-black mt-1">In Transit - Regional Hub</h2>
                                    <p className="text-slate-400 text-xs font-medium mt-2 flex items-center gap-1.5">
                                        <Clock size={12} /> Expected Delivery: Oct 24, 2025
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Tracking Number</span>
                                    <p className="text-lg font-black mt-1 uppercase">{orderId || "SBT-778899"}</p>
                                </div>
                             </div>
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Truck size={120} />
                             </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Shipment History</h3>
                            <div className="space-y-8">
                                <TimelineStep 
                                    icon={CheckCircle} 
                                    title="Order Processed" 
                                    date="Oct 20, 10:30 AM" 
                                    location="Phnom Penh Main Hub"
                                    isDone 
                                />
                                <TimelineStep 
                                    icon={Package} 
                                    title="Shipped from Hub" 
                                    date="Oct 21, 09:15 AM" 
                                    location="Phnom Penh Distribution"
                                    isDone 
                                />
                                <TimelineStep 
                                    icon={MapPin} 
                                    title="Arrived at Regional Hub" 
                                    date="Oct 22, 05:45 PM" 
                                    location="Kampong Cham Hub"
                                    isActive
                                />
                                <TimelineStep 
                                    icon={Truck} 
                                    title="Out for Delivery" 
                                    date="Estimated Oct 24" 
                                    location="Designated Address"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Info size={14} /> Need manual support? <a href="/contact-us" className="text-indigo-600 underline">Contact Logistics Team</a>
                </div>
            </div>
        </section>
    );
}

function TimelineStep({ icon: Icon, title, date, location, isDone, isActive }) {
    return (
        <div className="flex gap-4 relative">
            <div className={`mt-1 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 z-10 ${
                isDone ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : 
                "bg-slate-50 text-slate-300 border border-slate-100"
            }`}>
                <Icon size={16} />
            </div>
            <div>
                <h4 className={`text-sm font-black ${isDone ? "text-slate-900" : isActive ? "text-indigo-600" : "text-slate-400"}`}>{title}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{location}</span>
                </div>
            </div>
            {/* Line connector */}
            <div className="absolute left-4 top-10 bottom-[-2rem] w-[1px] bg-slate-100 last:hidden" />
        </div>
    );
}
