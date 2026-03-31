'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn 
} from 'react-icons/fa';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 font-sans">
      
      {/* --- Main Navigation Section --- */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-y-10 gap-x-6">
          
          {/* Brand and Mission */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 tracking-tighter leading-none uppercase">
                  Saby-Tinh
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-[12px] sm:text-sm leading-relaxed max-w-[240px]">
              Connecting you with the best local stores and premium quality products.
            </p>

            <div className="flex gap-1.5 pt-2">
              <SocialBtn icon={<FaFacebookF size={10} />} color="text-blue-600 bg-blue-50 border-blue-100" />
              <SocialBtn icon={<FaTwitter size={10} />}   color="text-sky-500 bg-sky-50 border-sky-100" />
              <SocialBtn icon={<FaInstagram size={10} />} color="text-rose-500 bg-rose-50 border-rose-100" />
              <SocialBtn icon={<FaLinkedinIn size={10} />} color="text-indigo-700 bg-indigo-50 border-indigo-100" />
            </div>
          </div>

          {/* Shopping Column */}
          <div className="col-span-1">
            <h4 className="text-[12px] font-semibold text-slate-900 mb-3">
              Shopping
            </h4>
            <ul className="space-y-2">
              <FooterLink href="/store">Stores</FooterLink>
              <FooterLink href="/category/phones">Mobile Devices</FooterLink>
              <FooterLink href="/category/laptops">Computers</FooterLink>
              <FooterLink href="/category/accessories">Accessories</FooterLink>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-span-1">
            <h4 className="text-[12px] font-semibold text-slate-900 mb-3">
              Support
            </h4>
            <ul className="space-y-2">
              <FooterLink href="/faq">Help Center</FooterLink>
              <FooterLink href="/contact-us">Contact Us</FooterLink>
              <FooterLink href="/track-order">Track Order</FooterLink>
              <FooterLink href="/shipping-returns">Returns Policy</FooterLink>
            </ul>
          </div>

          {/* Corporate Column */}
          <div className="col-span-1 lg:col-span-2 lg:pl-10">
            <h4 className="text-[12px] font-semibold text-slate-900 mb-3">
              Our Company
            </h4>
            <ul className="space-y-2">
              <FooterLink href="/about-us">About Us</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
              <FooterLink href="/admin-about ">admin about</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Bottom Status Bar --- */}
      <div className="bg-slate-50 border-t border-slate-100 py-3">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px]">
              © {new Date().getFullYear()} Saby-Tinh
            </span>
            <span className="text-slate-200">|</span>
            <span className="text-slate-400 text-[11px]">Reliable Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck size={12} className="text-indigo-500" />
              <span className="text-[11px]">Secure Payments</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex h-1 w-1">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative rounded-full h-1 w-1 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] text-emerald-600">Live</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

/* --- SUB COMPONENTS --- */

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ icon, color }) => (
  <button className={`w-7 h-7 flex items-center justify-center rounded-lg border shadow-sm transition-transform hover:scale-105 ${color}`}>
    {icon}
  </button>
);

export default Footer;