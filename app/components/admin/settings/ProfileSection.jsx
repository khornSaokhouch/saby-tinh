import { useRef } from 'react';
import { User, Calendar, Upload, Camera, Phone, Mail, Key } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import InputField from './InputField';

export default function ProfileSection({ user, formData, imagePreview, onInputChange, onImageChange }) {
  const { language } = useLanguageStore();
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Use the current language for date formatting
    return new Date(dateString).toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg"><User size={16} strokeWidth={3} /></div>
          <h3 className="text-base font-black text-slate-900 tracking-tighter">{t('Identity Registry', language)}</h3>
        </div>
        <div className="px-2.5 py-1 bg-slate-50 rounded-lg flex items-center gap-2 border border-slate-100/50">
            <Calendar size={10} className="text-slate-400" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {t('Sync:', language)} {formatDate(user?.created_at)}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* AVATAR UPLOAD AREA */}
        <div className="col-span-2 flex items-center gap-5 mb-2 relative z-10">
          <div className="relative group/avatar">
            <div className="w-20 h-20 rounded-[24px] bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-slate-200 uppercase tracking-tighter">
                  {user?.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-[24px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer"
            >
              <Camera className="text-white" size={20} strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center gap-1.5"
            >
              <Upload size={12} strokeWidth={3} /> {t('Sync Avatar', language)}
            </button>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-60">{t('Dimensions: 800x800 Recommended', language)}</p>
          </div>
        </div>

        <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />

        {/* INPUT FIELDS */}
        <div className="col-span-2 sm:col-span-1">
          <InputField label={t('Full Name', language)} name="name" value={formData.name} onChange={onInputChange} icon={User} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <InputField label={t('Phone Number', language)} name="phone_number" value={formData.phone_number} onChange={onInputChange} icon={Phone} placeholder={t('e.g. 095 867 475', language)} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <InputField label={t('Email Address', language)} name="email" value={formData.email} onChange={onInputChange} type="email" icon={Mail} />
        </div>
        <div className="col-span-2 sm:col-span-1">
           <InputField label={t('New Password', language)} name="password" value={formData.password} onChange={onInputChange} type="password" icon={Key} placeholder={t('Leave empty to keep', language)} />
        </div>

        <div className="col-span-2 space-y-1.5 relative z-10">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">{t('Entity Synopsis', language)}</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all h-20 resize-none placeholder:text-slate-300 shadow-sm"
            placeholder={t('Tell us a bit about yourself...', language)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}