"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Zap, Terminal, ArrowRight, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useEventStore } from '@/app/stores/useEventStore';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const FALLBACK_BANNER = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200";

const getCleanImageUrl = (url) => {
  if (!url) return null;
  const lastHttpIndex = url.lastIndexOf('http');
  if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
  return url;
};

const slugify = (text) =>
  (text || "").toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

const BannerCountdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
      <div className="flex items-center gap-2 bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 px-2 py-1 rounded-lg">
        <Zap className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Ends:</span>
      </div>
      <div className="flex gap-1.5">
        {[
          { label: 'D', value: timeLeft.days },
          { label: 'H', value: timeLeft.hours },
          { label: 'M', value: timeLeft.minutes },
          { label: 'S', value: timeLeft.seconds }
        ].map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white/10 backdrop-blur-2xl border border-white/20 min-w-[32px] sm:min-w-[40px] py-1 rounded-lg">
            <span className="text-[11px] sm:text-[13px] font-black text-white tabular-nums leading-none">
              {unit.value.toString().padStart(2, '0')}
            </span>
            <span className="text-[6px] sm:text-[7px] font-bold text-white/40 uppercase mt-0.5">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BannerSwiper = ({ events: propEvents }) => {
  const [mounted, setMounted] = useState(false);
  const { events: storeEvents, fetchEvents, loading } = useEventStore();

  useEffect(() => {
    setMounted(true);
    if (!propEvents && storeEvents.length === 0) {
      fetchEvents();
    }
  }, [propEvents, storeEvents.length, fetchEvents]);

  const activeEvents = (propEvents || storeEvents)?.filter(e => e.status === 'active') || [];

  if (!mounted || (loading && activeEvents.length === 0)) {
    return (
      <div className="w-full h-full min-h-[300px] bg-slate-900/5 backdrop-blur-md rounded-2xl lg:rounded-[32px] flex items-center justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full h-full rounded-2xl lg:rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group/container relative">
      {activeEvents.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            el: '.custom-pagination',
          }}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }}
          className="w-full h-full"
        >
          {activeEvents.map((event) => {
            const deadline = event.promotion?.end_date || event.end_date;
            
            return (
              <SwiperSlide key={event.id}>
                <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10" />
                  
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10 }}
                    src={getCleanImageUrl(event.event_image) || FALLBACK_BANNER} 
                    alt={event.name} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-10 lg:p-14">
                    <div className="max-w-xl">
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 px-2 py-1 rounded-lg flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Featured</span>
                        </div>
                      </motion.div>
  
                      <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl sm:text-4xl lg:text-5xl font-black mb-3 tracking-tighter text-white uppercase leading-[0.9]"
                      >
                        {event.name}
                      </motion.h2>
  
                      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                        <p className="text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-2 max-w-sm">
                            {event.description}
                        </p>
                        {deadline && <BannerCountdown deadline={deadline} />}
                      </div>
  
                      <Link href={`/event/${slugify(event.name)}`} className="
                        group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4
                        bg-white text-slate-950 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest 
                        transition-all hover:bg-indigo-500 hover:text-white active:scale-95
                      ">
                        <Terminal className="w-4 h-4" /> 
                        Explore Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}

          {/* Pagination & Nav - Adjusted for mobile */}
          <div className="absolute bottom-6 left-5 sm:left-10 lg:left-14 z-30 flex items-center gap-6">
            <div className="custom-pagination flex gap-2" />
          </div>

          <div className="absolute bottom-6 right-5 sm:right-10 z-30 hidden sm:flex gap-2">
            <button className="custom-prev w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="custom-next w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </Swiper>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-900">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">No active events</p>
        </div>
      )}

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
            width: 20px;
            height: 4px;
            border-radius: 2px;
            background: rgba(255,255,255,0.2) !important;
            opacity: 1 !important;
            transition: all 0.3s;
            margin: 0 !important;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: white !important;
          width: 40px;
        }
      `}</style>
    </section>
  );
};

export default BannerSwiper;