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
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 font-sans">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            Seller Registry
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
            Secure your <span className="text-indigo-600">Merchant</span> Space
          </h1>
          <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-sm mx-auto">
            Register your business today and join the premium marketplace of Saby-Tinh.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 space-y-8">
          <form
            onSubmit={(e) => { e.preventDefault(); submitForm(); }}
            className="space-y-8"
          >
            {/* LOCATION SECTION */}
            <section>
              <SectionHeader icon={MapPin} label="Operational Hub" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <CompactInput
                  label="Street Address"
                  icon={MapPin}
                  name="streetAddress"
                  value={form.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. 123 Veng Sreng Blvd"
                />
                
                {/* Province Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">
                    Province / City
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      name="countryRegion"
                      value={form.countryRegion}
                      onChange={(e) => { handleChange(e); setIsDropdownOpen(true); }}
                      onFocus={() => setIsDropdownOpen(true)}
                      required
                      placeholder="Select your city"
                      className="w-full py-3 pl-10 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-300"
                    />
                    <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isDropdownOpen && (
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredProvinces.map((province) => (
                        <li
                          key={province}
                          onClick={() => handleProvinceSelect(province)}
                          className="px-4 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors"
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
              <SectionHeader icon={Building2} label="Merchant Identity" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <CompactInput label="Full Name" icon={User} name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Your legal name" />
                <CompactInput label="Company Name" icon={Building2} name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Brand or Store name" />
                <CompactInput label="E-mail Address" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="contact@merchant.com" />
                <CompactInput label="Contact Number" icon={Phone} name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} placeholder="+855 ..." />
              </div>
            </section>

            <div className="h-px bg-slate-50" />

            {/* DOCUMENT SECTION */}
            <section>
              <SectionHeader icon={FileText} label="Identity Documents" />
              <label className="mt-4 relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all group">
                <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-indigo-600 mb-2 transition-colors" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-700 px-6 text-center leading-relaxed">
                  {form.document ? form.document.name : "Upload License / National ID (PDF/DOCX)"}
                </p>
                <input type="file" name="document" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            </section>

            {/* SUBMIT */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white/20" />
                    Submit Application
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-center items-center gap-2 opacity-30 select-none">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-900">Secure AES-256 Protocol</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shadow-sm">
        <Icon size={14} className="text-slate-600" />
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
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