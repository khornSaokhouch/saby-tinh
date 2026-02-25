"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaGithub, 
} from 'react-icons/fa';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  ChevronRight,
  Zap,
  ArrowRight,
  Target,
  Compass
} from 'lucide-react';
import PartnerLogoBanner from '@/components/home/PartnerLogoBanner';

// Professional Spring Transition
const springSmooth = { type: "spring", damping: 25, stiffness: 120 };

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

const AboutUsClient = () => {
  return (
    <motion.main
      className="min-h-screen bg-slate-50"
      initial="hidden"
      animate="visible"
    >
      {/* --- 1. COMPACT HERO SECTION --- */}
      <section className="relative pt-24 pb-20 lg:pt-16 lg:pb-16 overflow-hidden bg-slate-900">
        {/* Subtle Water Blur Background */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[60px]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div variants={itemVariants} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-xl text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/10">
              <Cpu className="w-3.5 h-3.5" /> Registry Core v2.0
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-[1.1]">
                Unified Hardware <br/>
                <span className="text-blue-500">Procurement</span> Nodes
            </h1>
            
            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed opacity-80 max-w-xl">
                Technocore is a high-performance registry designed to bridge the gap between global manufacturers and enterprise-level hardware procurement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- 2. MISSION GRID (REFINED CARDS) --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard 
            icon={<Target className="text-blue-500" />}
            title="Precision"
            desc="Sub-second registry updates for critical hardware data nodes."
          />
          <GlassCard 
            icon={<ShieldCheck className="text-emerald-500" />}
            title="Integrity"
            desc="Multi-layer verification for every component in our system."
          />
          <GlassCard 
            icon={<Compass className="text-cyan-500" />}
            title="Navigation"
            desc="Intuitive interface designed for rapid hardware sourcing."
          />
        </div>
      </div>

      {/* --- 3. FOUNDER SECTION (COMPACT & SHARP) --- */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            
            {/* Profile Image - Smaller and Sharper */}
            <motion.div variants={itemVariants} className="w-full lg:w-[380px] h-[450px] relative shrink-0">
                <Image
                    src={teamMembers[0].image}
                    alt={teamMembers[0].name}
                    fill
                    className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </motion.div>

            <div className="p-8 lg:p-12">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                The Architect
              </motion.div>
              <motion.h3 variants={itemVariants} className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                {teamMembers[0].name}
              </motion.h3>
              <motion.p variants={itemVariants} className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-lg">
                "{teamMembers[0].description}"
              </motion.p>

              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
                <SocialPill href={teamMembers[0].social.facebook} icon={<FaFacebookF />} />
                <SocialPill href={teamMembers[0].social.linkedin} icon={<FaLinkedinIn />} />
                <SocialPill href={teamMembers[0].social.github} icon={<FaGithub />} />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8 border-t border-slate-100 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                    <Zap className="text-white w-4 h-4 fill-white" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Email</p>
                    <p className="text-slate-900 font-bold text-sm">khornsaokhouch4456@gmail.com</p>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. PARTNERS --- */}
      <div className="py-12 bg-white border-y border-slate-100">
         <PartnerLogoBanner />
      </div>

  
    </motion.main>
  );
};

// --- SUB-COMPONENTS (TIGHT & LIQUID) ---

const GlassCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white/80 backdrop-blur-xl rounded-[24px] border border-white shadow-sm hover:shadow-md transition-all duration-500 group active:scale-95">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h3>
    <p className="text-[12px] text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const SocialPill = ({ href, icon }) => (
  <Link 
    href={href} target="_blank"
    className="
        w-10 h-10 flex items-center justify-center 
        bg-slate-50 border border-slate-200 rounded-xl 
        text-slate-400 transition-all duration-300 
        hover:bg-blue-600 hover:text-white hover:border-blue-600 
        active:scale-90
    "
  >
    {icon}
  </Link>
);

const teamMembers = [
  {
    name: "Khorn Saokhouch",
    image: "/me.png",
    description: "Driven by the vision of a unified hardware ecosystem, Khorn focuses on building high-performance architectures that simplify the global tech marketplace.",
    social: {
      facebook: "https://www.facebook.com/khorn.saokhouch.2025",
      linkedin: "https://www.linkedin.com/in/khorn-saokhouch-702026326",
      github: "https://github.com/khornSaokhouch",
    },
  },
];

export default AboutUsClient;