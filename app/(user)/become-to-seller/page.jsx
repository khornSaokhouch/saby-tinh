"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User, Mail, Phone, Building2, MapPin, Globe,
  FileText, ShieldCheck, Loader2, CheckCircle2,
  UploadCloud, ChevronDown, Sparkles
} from "lucide-react";
import { useSellerStore } from "@/stores/useSellerStore";
import { useRouter } from "next/navigation";

const cambodianProvinces = [
  "Phnom Penh", "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang",
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong", "Kratie",
  "Mondulkiri", "Oddar Meanchey", "Pailin", "Preah Sihanouk", "Preah Vihear",
  "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap", "Stung Treng", "Svay Rieng",
  "Takeo", "Tboung Khmum",
];

export default function BecomeCompanyForm() {
  const { form, loading, error, success, handleChange, handleFileChange, submitForm } = useSellerStore();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredProvinces = form.countryRegion
    ? cambodianProvinces.filter((p) => p.toLowerCase().includes(form.countryRegion.toLowerCase()))
    : cambodianProvinces;

  const handleProvinceSelect = (province) => {
    handleChange({ target: { name: "countryRegion", value: province } });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (error) console.error("Registration Error:", error);
    if (success) router.push("/");
  }, [error, success, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-blue-100">
            <ShieldCheck className="w-3 h-3" />
            Seller Registry
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            Become a <span className="text-blue-600">Seller</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-sm mx-auto">
            Register your business and start selling on the Saby-Tinh platform.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-6">
          <form
            onSubmit={(e) => { e.preventDefault(); submitForm(); }}
            className="space-y-6"
          >
            {/* LOCATION SECTION */}
            <section>
              <SectionHeader icon={MapPin} label="Business Location" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <CompactInput
                  label="Street Address"
                  icon={MapPin}
                  name="streetAddress"
                  value={form.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main Street"
                />
                {/* Province Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">
                    Province / City
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="countryRegion"
                      value={form.countryRegion}
                      onChange={(e) => { handleChange(e); setIsDropdownOpen(true); }}
                      onFocus={() => setIsDropdownOpen(true)}
                      required
                      placeholder="Search province..."
                      className="w-full py-2.5 pl-9 pr-8 bg-slate-50 border border-transparent rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  </div>
                  {isDropdownOpen && (
                    <ul className="absolute z-20 w-full mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5">
                      {filteredProvinces.map((province) => (
                        <li
                          key={province}
                          onClick={() => handleProvinceSelect(province)}
                          className="px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer transition-colors"
                        >
                          {province}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-50" />

            {/* IDENTITY SECTION */}
            <section>
              <SectionHeader icon={Building2} label="Business Identity" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <CompactInput label="Full Name" icon={User} name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Your full name" />
                <CompactInput label="Company Name" icon={Building2} name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Official business name" />
                <CompactInput label="Email" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="contact@company.com" />
                <CompactInput label="Phone" icon={Phone} name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} placeholder="+855 ..." />
              </div>
            </section>

            <div className="h-px bg-slate-50" />

            {/* DOCUMENT SECTION */}
            <section>
              <SectionHeader icon={FileText} label="Business Verification" />
              <label className="mt-3 relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group">
                <UploadCloud className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mb-1.5 transition-colors" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 px-4 text-center">
                  {form.document ? form.document.name : "Upload Business License (PDF / DOCX)"}
                </p>
                <input type="file" name="document" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            </section>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Submit Application
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1.5 opacity-40">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-widest">AES-256 Encrypted</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center">
        <Icon className="w-3 h-3 text-blue-500" />
      </div>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</span>
    </div>
  );
}

const CompactInput = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">
      {label} {props.required && <span className="text-blue-500">*</span>}
    </label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
      <input
        {...props}
        className="w-full py-2.5 pl-9 pr-4 bg-slate-50 border border-transparent rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-300"
      />
    </div>
  </div>
);