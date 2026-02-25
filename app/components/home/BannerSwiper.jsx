"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Zap, Terminal, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

// Swiper Styles
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
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const BannerSwiper = ({ events }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="lg:col-span-9 h-[480px] bg-slate-100/50 backdrop-blur-md rounded-[32px] animate-pulse" />;

  return (
    <section className="lg:col-span-9 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 h-[480px] group/container relative">
      
      {events && events.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} !w-10 !h-1 !rounded-full !bg-white/20 transition-all duration-500"></span>`;
            }
          }}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }}
          className="w-full h-full"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="relative w-full h-full overflow-hidden">
                {/* Deeper Liquid Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                
                <motion.img 
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: [0.23, 1, 0.32, 1] }}
                  src={getCleanImageUrl(event.event_image) || FALLBACK_BANNER} 
                  alt={event.name} 
                  className="w-full h-full object-cover" 
                />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 lg:p-16 pb-20">
                  <div className="max-w-2xl">
                    
                    {/* Featured Tag: Liquid Style */}
                    <motion.div 
                      initial={{ opacity: 0, y: -15 }} 
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                      className="flex items-center gap-3 mb-6"
                    >
                      <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10">
                        <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Featured</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Live Node</span>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <h2 className="text-5xl lg:text-7xl font-black mb-5 tracking-tighter text-white uppercase leading-[0.85]">
                            {event.name}
                        </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="mb-10 max-w-lg"
                    >
                        <p className="text-sm lg:text-base text-slate-300 font-medium leading-relaxed line-clamp-2 opacity-80">
                            {event.description}
                        </p>
                    </motion.div>

                    {/* Action Button: Liquid Glass Style */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, type: 'spring', damping: 20 }}
                    >
                      <Link href={`/event/${slugify(event.name)}`} className="
                        group inline-flex items-center gap-4 px-10 py-4 
                        bg-white/10 backdrop-blur-2xl border border-white/20
                        text-white rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] 
                        transition-all duration-500 ease-[0.23,1,0.32,1]
                        hover:bg-white hover:text-slate-950 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)]
                        active:scale-95
                      ">
                        <Terminal className="w-4.5 h-4.5" /> 
                        Explore Now
                        <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform duration-500" />
                      </Link>
                    </motion.div>

                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Liquid Glass Navigation Arrows */}
          <div className="absolute bottom-12 right-12 z-30 flex gap-3 opacity-0 group-hover/container:opacity-100 transition-opacity duration-500">
            <button className="custom-prev w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-500 cursor-pointer active:scale-90 group shadow-2xl">
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button className="custom-next w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-500 cursor-pointer active:scale-90 group shadow-2xl">
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </Swiper>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-md">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Loading events...</p>
        </div>
      )}

      <style jsx global>{`
        .swiper-pagination-bullet {
            opacity: 1 !important;
            background: rgba(255,255,255,0.1) !important;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          width: 3rem !important;
          box-shadow: 0 0 20px rgba(255,255,255,0.5);
        }
        .swiper-pagination {
            bottom: 48px !important;
            left: 56px !important;
            text-align: left !important;
            width: auto !important;
        }
      `}</style>
    </section>
  );
};

export default BannerSwiper;