"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  FileText,
  ShieldCheck,
  ChevronRight,
  Loader2,
  CheckCircle2,
  UploadCloud
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
  const {
    form,
    loading,
    error,
    success,
    handleChange,
    handleFileChange,
    submitForm
  } = useSellerStore();

  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredProvinces = form.countryRegion
    ? cambodianProvinces.filter((p) =>
        p.toLowerCase().includes(form.countryRegion.toLowerCase())
      )
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (error) console.error("Registration Error:", error);
    if (success) router.push("/");
  }, [error, success, router]);

  return (
    <div className="min-h-screen px-4 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <ShieldCheck className="w-3 h-3" />
            Registry
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter uppercase mb-4">
            Become a <span className="text-blue-600">Seller</span>
          </h1>

          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Register your business identity within the global Saby-Tinh
            registry.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 lg:p-12 font-sans">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
            className="space-y-10"
          >
            {/* HUB LOCATION */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 font-sans">
                <MapPin className="w-3.5 h-3.5" />
                Business Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StyledInput
                  label="Street Address"
                  icon={MapPin}
                  name="streetAddress"
                  value={form.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. 123 Business Street"
                />

                <div className="relative font-sans" ref={dropdownRef}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Province / City
                  </label>

                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="countryRegion"
                      value={form.countryRegion}
                      onChange={(e) => {
                        handleChange(e);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      required
                      placeholder="Search Hub..."
                      className="w-full py-4 pl-12 pr-4 font-sans bg-slate-50 border border-transparent rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                    />
                  </div>

                  {isDropdownOpen && (
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-[24px] shadow-2xl max-h-60 overflow-y-auto p-2 font-sans">
                      {filteredProvinces.map((province) => (
                        <li
                          key={province}
                          onClick={() => handleProvinceSelect(province)}
                          className="px-4 py-3 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-colors"
                        >
                          {province}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-50 w-full" />

            {/* ORGANIZATION */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 font-sans">
                <Building2 className="w-3.5 h-3.5" />
                Business Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StyledInput label="Admin Full Name" icon={User} name="fullName" value={form.fullName} onChange={handleChange} required />
                <StyledInput label="Official Company Name" icon={Building2} name="companyName" value={form.companyName} onChange={handleChange} required />
                <StyledInput label="Secure Contact Email" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} required />
                <StyledInput label="Communication Node" icon={Phone} name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} />
              </div>
            </div>

            {/* DOCUMENT */}
            <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 font-sans">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Business Verification Data
              </h3>

              <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[24px] bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="text-[10px] font-bold font-sans text-slate-400 uppercase tracking-widest group-hover:text-blue-600 px-4 text-center">
                  {form.document
                    ? form.document.name
                    : "Transmit Business License (PDF / DOCX)"}
                </p>
                <input
                  type="file"
                  name="document"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* ACTION */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-sans shadow-xl flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
                  Submit
                </span>
              )}
            </button>

            <div className="flex justify-center gap-2 opacity-40 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                AES-256 Protocol Enabled
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Styled Input */
const StyledInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2 font-sans">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label} {props.required && <span className="text-blue-500">*</span>}
    </label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600" />
      <input
        {...props}
        className="w-full py-4 pl-12 pr-4 font-sans bg-slate-50 border border-transparent rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
      />
    </div>
  </div>
);