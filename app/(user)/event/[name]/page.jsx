"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEventStore } from "@/stores/useEventStore";
import Link from "next/link";
import { 
  Calendar, MapPin, Share2, ArrowLeft, Clock, 
  ChevronRight, ExternalLink, ShieldCheck, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const slugify = (text) =>
  (text || "").toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

export default function EventDetails() {
  const { name } = useParams();
  const router = useRouter();
  const eventStore = useEventStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, { 
      year: "numeric", month: "short", day: "numeric" 
    });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const slugifiedName = name;
      const cachedEvent = eventStore.events.find((e) => slugify(e.name) === slugifiedName);
      if (cachedEvent) { setEvent(cachedEvent); setLoading(false); }
      try {
        const data = await eventStore.fetchEventBySlug(name);
        if (data) setEvent(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchEvent();
  }, [name]);

  if (loading) return <LoadingScreen />;
  if (!event) return null;

  return (
    <div className="min-h-screen">
      {/* Header - Slimmer */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-[12px] font-bold">Back</span>
        </button>
        <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Copied!"); }} 
          className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400 hover:text-indigo-600">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-5">
            {/* Hero - More Compact Aspect Ratio */}
            <div className="relative aspect-[21/8] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={event.event_image || "/placeholder.png"} alt={event.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-md mb-2">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  Live Event
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  {event.name}
                </h1>
              </div>
            </div>

            {/* Description - Tighter Padding */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-tight">About this Event</h3>
              <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-line mb-6">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PerkItem icon={ShieldCheck} title="Verified" desc="Secure entry guaranteed" />
                <PerkItem icon={Users} title="Networking" desc="Meet industry experts" />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Sticky Card */}
          <motion.aside initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 lg:sticky lg:top-10 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-50/50">
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-3">Event Summary</p>
                  <div className="space-y-3.5">
                    <DetailItem icon={Calendar} label="Date" value={`${formatDate(event.start_date)} - ${formatDate(event.end_date)}`} />
                    <DetailItem icon={Clock} label="Schedule" value="09:00 AM - 05:00 PM" />
                    <DetailItem icon={MapPin} label="Location" value={event.location || "Online"} highlight />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <Link href="/register" className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-[0.98]">
                    Secure Your Spot <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <p className="text-[10px] text-gray-400 text-center mt-3">Limited availability. Register soon.</p>
                </div>
              </div>
            </div>

            {/* Mini Support Widget */}
            <div className="bg-slate-900 rounded-xl p-3.5 text-white flex items-center justify-between group cursor-pointer">
               <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-medium">Need help?</span>
                  <span className="text-[12px] font-bold">Contact Support</span>
               </div>
               <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
               </div>
            </div>
          </motion.aside>

        </div>
      </main>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex gap-2.5 items-center">
      <div className={`p-1.5 rounded-lg ${highlight ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col">
        <p className="text-[8px] font-bold text-gray-400 uppercase leading-none mb-0.5">{label}</p>
        <p className={`text-[12px] font-bold ${highlight ? 'text-indigo-700' : 'text-gray-700'}`}>{value}</p>
      </div>
    </div>
  );
}

function PerkItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-gray-50/50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
      <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
      <div>
        <h4 className="text-[12px] font-bold text-gray-900 leading-tight">{title}</h4>
        <p className="text-[10px] text-gray-500 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );
}