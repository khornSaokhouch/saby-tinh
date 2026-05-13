"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Zap, ArrowRight, ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
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
      if (distance < 0) { clearInterval(timer); return; }
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
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-400/20 px-2 py-1 rounded-lg">
        <Zap className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Ends in</span>
      </div>
      <div className="flex gap-1">
        {[
          { label: 'D', value: timeLeft.days },
          { label: 'H', value: timeLeft.hours },
          { label: 'M', value: timeLeft.minutes },
          { label: 'S', value: timeLeft.seconds }
        ].map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white/15 backdrop-blur-xl border border-white/20 w-9 py-1.5 rounded-lg">
            <span className="text-sm font-black text-white tabular-nums leading-none">
              {unit.value.toString().padStart(2, '0')}
            </span>
            <span className="text-[7px] font-bold text-white/50 uppercase mt-0.5">{unit.label}</span>
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
    if (!propEvents && storeEvents.length === 0) fetchEvents();
  }, [propEvents, storeEvents.length, fetchEvents]);

  const activeEvents = (propEvents || storeEvents)?.filter(e => e.status === 'active') || [];

  if (!mounted || (loading && activeEvents.length === 0)) {
    return (
      <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl lg:rounded-[32px] flex items-center justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full h-full rounded-2xl lg:rounded-[32px] overflow-hidden border border-slate-200/60 group/container relative">
      {activeEvents.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          speed={1200}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
          className="w-full h-full"
        >
          {activeEvents.map((event) => {
            const deadline = event.promotion?.end_date || event.end_date;

            return (
              <SwiperSlide key={event.id}>
                <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px]">
                  
                  {/* Background image */}
                  <motion.img
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    src={getCleanImageUrl(event.event_image) || FALLBACK_BANNER}
                    alt={event.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Soft left-side overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
                  
                  {/* Ambient glow accent */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl z-10 pointer-events-none" />

                  {/* Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 lg:p-12">
                    <div className="max-w-lg">

                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 mb-4"
                      >
                        <div className="flex items-center gap-1.5 bg-indigo-500/20 backdrop-blur-xl border border-indigo-400/30 px-3 py-1 rounded-full">
                          <Sparkles className="w-3 h-3 text-indigo-300" />
                          <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Featured Event</span>
                        </div>
                      </motion.div>

                      {/* Title */}
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-4xl lg:text-[3.2rem] font-black mb-3 tracking-tighter text-white uppercase leading-[0.92] drop-shadow-lg"
                      >
                        {event.name}
                      </motion.h2>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-slate-300/90 font-medium leading-relaxed line-clamp-2 max-w-sm mb-5"
                      >
                        {event.description}
                      </motion.p>

                      {/* Countdown */}
                      {deadline && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="mb-6"
                        >
                          <BannerCountdown deadline={deadline} />
                        </motion.div>
                      )}

                      {/* CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          href={`/event/${slugify(event.name)}`}
                          className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-xl shadow-black/20"
                        >
                          Explore Now
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>

                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}

          {/* Pagination dots */}
          <div className="absolute bottom-6 left-6 sm:left-10 lg:left-12 z-30">
            <div className="custom-pagination flex gap-2" />
          </div>

          {/* Nav arrows */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-30 hidden sm:flex gap-2">
            <button className="custom-prev w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="custom-next w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </Swiper>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/80">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">No active events</p>
        </div>
      )}

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 20px;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.25) !important;
          opacity: 1 !important;
          transition: all 0.3s;
          margin: 0 !important;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: white !important;
          width: 36px;
        }
      `}</style>
    </section>
  );
};

export default BannerSwiper;