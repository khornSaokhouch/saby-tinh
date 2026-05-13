'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 font-sans">

      {/* Main */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-y-10 gap-x-8">

          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-base font-black text-slate-900 tracking-tighter uppercase">Saby-Tinh</span>
            </Link>
            <p className="text-slate-400 text-[13px] leading-relaxed max-w-[220px]">
              Connecting you with the best local stores and premium quality products.
            </p>
            <div className="flex gap-2">
              <SocialBtn icon={<FaFacebookF size={11} />} href="#" label="Facebook" />
              <SocialBtn icon={<FaTwitter size={11} />} href="#" label="Twitter" />
              <SocialBtn icon={<FaInstagram size={11} />} href="#" label="Instagram" />
              <SocialBtn icon={<FaLinkedinIn size={11} />} href="#" label="LinkedIn" />
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Shopping</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/store">All Stores</FooterLink>
              <FooterLink href="/category/phones">Mobile Devices</FooterLink>
              <FooterLink href="/category/laptops">Computers</FooterLink>
              <FooterLink href="/category/accessories">Accessories</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/faq">Help Center</FooterLink>
              <FooterLink href="/contact-us">Contact Us</FooterLink>
              <FooterLink href="/track-order">Track Order</FooterLink>
              <FooterLink href="/shipping-returns">Returns Policy</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-2 lg:pl-8">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/about-us">About Us</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Saby-Tinh · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={12} className="text-indigo-500" />
              <span className="text-[11px]">Secure Payments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <li>
    <Link href={href} className="text-[13px] text-slate-500 hover:text-indigo-600 transition-colors">
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ icon, href, label }) => (
  <a
    href={href}
    aria-label={label}
    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
  >
    {icon}
  </a>
);

export default Footer;