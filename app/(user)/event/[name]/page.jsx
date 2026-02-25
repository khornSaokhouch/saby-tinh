"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEventStore } from "@/stores/useEventStore";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Share2, 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function EventDetails() {
  const { name } = useParams();
  const router = useRouter();
  const eventStore = useEventStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const fetchEvent = async () => {
    // 1. Instant Cache Check: Search in the events already in the store (SWR)
    const slugifiedName = name; // Params name is already slugified
    const cachedEvent = eventStore.events.find(
      (e) => slugify(e.name) === slugifiedName
    );

    if (cachedEvent) {
      setEvent(cachedEvent);
      setLoading(false); // Render immediately from cache
    } else {
      setLoading(true); // Only block if we have absolutely no data
    }

    try {
      // 2. Background Refresh: Get fresh data from dedicated endpoint
      const data = await eventStore.fetchEventBySlug(name);
      if (!data) throw new Error("Event not found");
      setEvent(data);
    } catch (err) {
      // Only show error if we have no cached data to fall back on
      if (!cachedEvent) {
        setError(err.message || "Event not found.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [name]);

  const shareEvent = async () => {
    if (!event) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState error={error} onBack={() => router.back()} />;
  if (!event) return null;

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      {/* Header / Nav */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Return to Home</span>
        </button>
        <button onClick={shareEvent} className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500 hover:text-indigo-600 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visuals & Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* Image Hero */}
            <div className="relative aspect-video lg:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/10">
              <img
                src={event.event_image || "/placeholder-event.png"}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Upcoming Event
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  {event.name}
                </h1>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">
                About the Event
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {/* Perks / Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                <PerkItem icon={ShieldCheck} title="Verified Event" desc="Secure entry and verified hosts" />
                <PerkItem icon={Users} title="Networking" desc="Meet industry experts & peers" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Sticky Action Card */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 lg:sticky lg:top-28 space-y-6"
          >
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-900/5 border border-indigo-50 relative overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-50 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Event Details</p>
                  
                  <div className="space-y-5">
                    <DetailItem 
                      icon={Calendar} 
                      label="Event Period" 
                      value={`${formatDate(event.start_date)} - ${formatDate(event.end_date)}`} 
                    />
                    <DetailItem 
                      icon={Clock} 
                      label="Time" 
                      value="09:00 AM - 05:00 PM" 
                    />
                    <DetailItem 
                      icon={MapPin} 
                      label="Location" 
                      value={event.location || "Global Online"} 
                      highlight
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]"
                  >
                    Secure Your Spot <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-gray-400 text-center mt-4">
                    Limited seats available. Registration closes soon.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Widget */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between group cursor-pointer overflow-hidden relative">
               <div className="relative z-10">
                  <p className="text-xs text-slate-400 font-medium">Need assistance?</p>
                  <p className="font-bold">Contact Support</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors relative z-10">
                  <ExternalLink className="w-4 h-4 text-white" />
               </div>
               <div className="absolute inset-0 bg-indigo-600/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            </div>
          </motion.aside>

        </div>
      </main>
    </div>
  );
}

// Sub-components for a cleaner main function
function DetailItem({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex gap-4">
      <div className={`p-2.5 rounded-xl ${highlight ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
        <p className={`text-sm font-bold ${highlight ? 'text-indigo-700' : 'text-gray-700'}`}>{value}</p>
      </div>
    </div>
  );
}

function PerkItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
      <Icon className="w-6 h-6 text-indigo-500" />
      <div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 animate-pulse">Loading event details...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ArrowLeft className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={onBack} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
          Return to Events
        </button>
      </div>
    </div>
  );
}