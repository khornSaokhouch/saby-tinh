'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Building2, Globe, Clock, MapPin, Save, Upload, 
  Loader2, Layout, Image as ImageIcon, Facebook, 
  Instagram, Linkedin, Twitter, ExternalLink, 
  Navigation, ShieldCheck , AlertCircle
} from 'lucide-react';
import { useCompanyStore } from '@/stores/useCompanyStore';
import { useUserStore } from '@/stores/userStore';
import { request } from '@/util/request';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

// Dynamically load map component
const LocationPicker = dynamic(() => import('@/components/owner/LocationPicker'), { 
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center border border-slate-200">
      <div className="flex flex-col items-center gap-2 text-slate-400">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Maps...</span>
      </div>
    </div>
  )
});

export default function OwnerCompanyPage() {
  // --- STORE & STATE ---
  const { companies, fetchCompanies, createCompany, updateCompany, loading } = useCompanyStore();
  const { user, fetchProfile } = useUserStore();
  
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    website_url: '',
    open_time: '',
    close_time: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    latitude: '',
    longitude: '',
    house_number: '',
    street: '',
    commune: '',
    district: '',
    province: 'Phnom Penh',
    country_id: 1, 
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]); 
  const fileInputRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    fetchProfile();
    fetchCompanies();
    
    const getCountries = async () => {
      try {
        const res = await request("/countries", "GET");
        setAvailableCountries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    getCountries();
  }, [fetchProfile, fetchCompanies]);

  useEffect(() => {
    if (companies.length > 0) {
      const company = companies[0];
      setFormData({
        company_name: company.company_name || '',
        description: company.description || '',
        website_url: company.website_url || '',
        open_time: company.open_time || '',
        close_time: company.close_time || '',
        facebook_url: company.facebook_url || '',
        instagram_url: company.instagram_url || '',
        twitter_url: company.twitter_url || '',
        linkedin_url: company.linkedin_url || '',
        latitude: company.address?.latitude || '',
        longitude: company.address?.longitude || '',
        house_number: company.address?.house_number || '',
        street: company.address?.street || '',
        commune: company.address?.commune || '',
        district: company.address?.district || '',
        province: company.address?.province || '',
        country_id: company.address?.country_id || '',
      });
      setPreview(company.company_image);
    }
  }, [companies]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLocationChange = async (lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    
    // Reverse Geocoding
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      
      if (data && data.address) {
        const addr = data.address;
        const updates = {
          house_number: addr.house_number || formData.house_number,
          street: addr.road || addr.pedestrian || formData.street,
          commune: addr.suburb || addr.neighbourhood || addr.village || formData.commune,
          district: addr.city_district || addr.county || formData.district,
          province: addr.city || addr.state || formData.province,
        };

        if (addr.country && availableCountries.length > 0) {
          const matched = availableCountries.find(
            c => c.name.toLowerCase() === addr.country.toLowerCase()
          );
          if (matched) {
            updates.country_id = matched.id;
          }
        }
        setFormData(prev => ({ ...prev, ...updates }));
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    const submissionData = new FormData();
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      const isOptional = ['latitude', 'longitude', 'website_url', 'facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 'house_number', 'street', 'commune', 'district', 'open_time', 'close_time', 'description'].includes(key);
      if (isOptional && (value === '' || value === null || value === undefined)) return; 
      submissionData.append(key, value);
    });
    
    if (user?.id) submissionData.append('user_id', user.id);
    if (imageFile) submissionData.append('company_image', imageFile);

    try {
      if (companies.length > 0) {
        await updateCompany(companies[0].id, submissionData);
      } else {
        await createCompany(submissionData);
      }
      toast.success('Profile saved successfully');
    } catch (err) {
      console.error("Submission Error:", err);
      const responseData = err.response?.data;
      if (responseData?.errors) {
        const firstField = Object.keys(responseData.errors)[0];
        const msg = `${firstField.replace('_', ' ')}: ${responseData.errors[firstField][0]}`;
        setSubmissionError(msg);
        toast.error(msg);
      } else if (responseData?.message) {
        setSubmissionError(responseData.message);
        toast.error(responseData.message);
      } else {
        setSubmissionError("An unexpected error occurred.");
        toast.error("Failed to sync profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Business Setup</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Business Profile</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2.5} />}
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* --- ERROR ALERT --- */}
      {submissionError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-rose-700 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
            <AlertCircle size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Update Failed</h4>
            <p className="text-sm font-medium mt-0.5">{submissionError}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: Branding & Status --- */}
        <div className="space-y-6">
          
          {/* Logo Card */}
          <div className="bg-white p-5 rounded-[22px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon size={15} className="text-indigo-600" />
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Brand Logo</h3>
            </div>
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="group relative aspect-square w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="Logo Preview" className="w-full h-full object-contain p-6" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 text-indigo-500">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Upload Logo</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">SVG, PNG, JPG (Max 2MB)</p>
                </div>
              )}
              
              {/* Overlay */}
              {preview && (
                <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                   <Upload size={24} className="text-white mb-2" />
                   <p className="text-white text-xs font-bold">Change Logo</p>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          {/* Visibility Status */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-[22px] text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
               <Building2 size={60} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Store Profile</span>
               </div>
               <h4 className="text-lg font-black text-white tracking-tight leading-none mb-2">Business Identity</h4>
               <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                 Your details are visible to customers. Keep location and contact info accurate.
               </p>
               <button className="text-[9px] font-black text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 uppercase tracking-widest">
                 View Live Page <ExternalLink size={10} strokeWidth={2.5} />
               </button>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Forms --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Core Details */}
          <div className="bg-white p-5 rounded-[22px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Layout size={15} /></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Company Details</h3>
                <p className="text-[10px] text-slate-400 font-medium">Basic information about your business.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <InputField 
                label="Company Name" 
                name="company_name" 
                value={formData.company_name} 
                onChange={handleChange} 
                placeholder="e.g. Acme Innovations"
                required
              />
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Business Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all h-32 resize-none placeholder:text-slate-400"
                  placeholder="Tell customers what makes your business unique..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField 
                  label="Opening Hours" 
                  name="open_time" 
                  type="time" 
                  value={formData.open_time} 
                  onChange={handleChange} 
                  icon={Clock}
                />
                <InputField 
                  label="Closing Hours" 
                  name="close_time" 
                  type="time" 
                  value={formData.close_time} 
                  onChange={handleChange} 
                  icon={Clock}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Address */}
          <div className="bg-white p-5 rounded-[22px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><MapPin size={15} /></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Physical Location</h3>
                <p className="text-[10px] text-slate-400 font-medium">Address details and map coordinates.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Address Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="House No." name="house_number" value={formData.house_number} onChange={handleChange} placeholder="e.g. #12" />
                <InputField label="Street" name="street" value={formData.street} onChange={handleChange} placeholder="e.g. St. 2004" />
                <InputField label="Commune / Sangkat" name="commune" value={formData.commune} onChange={handleChange} placeholder="e.g. Teuk Thla" />
                <InputField label="District / Khan" name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Sen Sok" />
                <InputField label="City / Province" name="province" value={formData.province} onChange={handleChange} placeholder="Phnom Penh" />
                
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Country</label>
                  <select 
                    name="country_id" 
                    value={formData.country_id} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Select Country</option>
                    {availableCountries.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-[34px] pointer-events-none text-slate-400">
                    <Navigation size={14} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="h-64 w-full rounded-[18px] overflow-hidden border border-slate-100 relative shadow-inner">
                 <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-100 text-[9px] font-bold text-slate-600 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                   Click map to pin location
                 </div>
                 <LocationPicker 
                   lat={formData.latitude} 
                   lng={formData.longitude} 
                   onChange={handleLocationChange}
                 />
              </div>

              {/* Lat/Lng Readonly */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <InputField label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} icon={MapPin} readOnly />
                <InputField label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} icon={MapPin} readOnly />
              </div>
            </div>
          </div>

          {/* Section 3: Online Presence */}
          <div className="bg-white p-5 rounded-[22px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={15} /></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Social & Web</h3>
                <p className="text-[10px] text-slate-400 font-medium">Connect your social media accounts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField 
                label="Official Website" 
                name="website_url" 
                value={formData.website_url} 
                onChange={handleChange} 
                icon={Globe}
                placeholder="https://"
              />
              <InputField 
                label="Facebook Page" 
                name="facebook_url" 
                value={formData.facebook_url} 
                onChange={handleChange} 
                icon={Facebook}
                placeholder="facebook.com/..."
              />
              <InputField 
                label="Instagram" 
                name="instagram_url" 
                value={formData.instagram_url} 
                onChange={handleChange} 
                icon={Instagram}
                placeholder="instagram.com/..."
              />
              <InputField 
                label="LinkedIn" 
                name="linkedin_url" 
                value={formData.linkedin_url} 
                onChange={handleChange} 
                icon={Linkedin}
                placeholder="linkedin.com/in/..."
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- REUSABLE INPUT COMPONENT ---
function InputField({ label, name, value, onChange, placeholder, type = "text", icon: Icon, readOnly = false, required = false }) {
  return (
    <div className="relative group">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.14em] mb-1.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type} 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          className={`
            w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 
            focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 focus:bg-white 
            transition-all placeholder:text-slate-300 
            ${Icon ? 'pl-10' : ''} 
            ${readOnly ? 'cursor-default bg-slate-100 text-slate-400 focus:border-slate-100 focus:ring-0' : ''}
          `}
        />
        {Icon && (
          <Icon 
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${readOnly ? 'text-slate-300' : 'text-slate-300 group-focus-within:text-indigo-400'}`} 
            size={14} 
          />
        )}
      </div>
    </div>
  );
}