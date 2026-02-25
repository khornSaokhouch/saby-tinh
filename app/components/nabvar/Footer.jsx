'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from 'react-icons/fa';
import { ShieldCheck, Globe, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 font-battambang">
      
      {/* Main Links Section */}
      <div className="container mx-auto p-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-indigo-100">
                  <Sparkles size={20} className="text-white" fill="currentColor" />
                </div>

                {/* LOGO — UNCHANGED */}
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                  Saby-Tinh
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-xs">
              Next-generation terminal for high-performance computing, mobile architecture, and professional node registry.
            </p>

            <div className="flex gap-3">
              <SocialBtn icon={<FaFacebookF size={14} />} />
              <SocialBtn icon={<FaTwitter size={14} />} />
              <SocialBtn icon={<FaInstagram size={14} />} />
              <SocialBtn icon={<FaLinkedinIn size={14} />} />
            </div>
          </div>

          {/* Inventory */}
          <div className="lg:pl-8">
            <h4 className="font-semibold text-slate-900 text-[11px] mb-6 uppercase">
              Inventory Nodes
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/store">Registry Store</FooterLink>
              <FooterLink href="#">New Units</FooterLink>
              <FooterLink href="#">Featured Gear</FooterLink>
              <FooterLink href="#">System Nodes</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-900 text-[11px] mb-6 uppercase">
              Support Terminal
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/faq">Help Center</FooterLink>
              <FooterLink href="/contact-us">Contact Us</FooterLink>
              <FooterLink href="#">Warranty Protocol</FooterLink>
              <FooterLink href="#">Link Status</FooterLink>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-semibold text-slate-900 text-[11px] mb-6 uppercase">
              Registry Policy
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
              <FooterLink href="/admin-about">Admin about</FooterLink>
              <FooterLink href="/about-us">About Us</FooterLink>
            </ul>
          </div>

          {/* Security Node */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 w-full lg:w-auto shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 border border-indigo-50">
                  <ShieldCheck className="w-4 h-4" strokeWidth={3} />
                </div>
                <span className="text-[11px] font-semibold text-slate-900">
                  Verified Gear
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Official manufacturer warranty <br />
                & secure procurement.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-50/50 border-t border-slate-100 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-slate-400 text-[11px] font-medium">
              © {new Date().getFullYear()} Saby-Tinh Registry. All Rights Reserved.
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium hover:text-indigo-600 transition-colors cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>International (Global-OS)</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <FaCcVisa size={22} />
              <FaCcMastercard size={22} />
              <FaCcPaypal size={22} />
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[9px] font-semibold text-emerald-600">
                System Secure
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

/* Sub Components */

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="text-[13px] font-medium text-slate-500 hover:text-indigo-600 hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-300 group"
    >
      <div className="w-1 h-1 bg-slate-200 rounded-full group-hover:bg-indigo-600 group-hover:scale-150 transition-all" />
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ icon }) => (
  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-90">
    {icon}
  </button>
);

export default Footer;
