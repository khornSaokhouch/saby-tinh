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
    return new Date(dateString).toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-50 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md"><User size={14} strokeWidth={2.5} /></div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('Profile info', language)}</h3>
        </div>
        <div className="px-2.5 py-1 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100/50">
            <Calendar size={10} className="text-slate-400" />
            <span className="text-[8px] font-bold text-slate-400 tracking-wide">
              {t('Member since:', language)} {formatDate(user?.created_at)}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* AVATAR UPLOAD AREA */}
        <div className="col-span-2 flex items-center gap-4 mb-1 relative z-10">
          <div className="relative group/avatar">
            <div className="w-14 h-14 rounded-[18px] bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-slate-200 capitalize">
                  {user?.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-[18px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer"
            >
              <Camera className="text-white" size={16} strokeWidth={2.5} />
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
              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-bold tracking-wide hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center gap-1.5"
            >
              <Upload size={12} strokeWidth={2.5} /> {t('Update photo', language)}
            </button>
            <p className="text-[8px] font-medium text-slate-400 ml-1 opacity-70">{t('Min 400x400 recommended', language)}</p>
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div className="col-span-2 sm:col-span-1">
          <InputField label={t('Full name', language)} name="name" value={formData.name} onChange={onInputChange} icon={User} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <InputField label={t('Phone number', language)} name="phone_number" value={formData.phone_number} onChange={onInputChange} icon={Phone} placeholder="e.g. 095 867 475" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <InputField label={t('Email address', language)} name="email" value={formData.email} onChange={onInputChange} type="email" icon={Mail} />
        </div>
        <div className="col-span-2 sm:col-span-1">
           <InputField label={t('Update password', language)} name="password" value={formData.password} onChange={onInputChange} type="password" icon={Key} placeholder={t('Leave empty to keep', language)} />
        </div>

        <div className="col-span-2 space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 opacity-50 px-1">
            <span className="text-[9px] font-bold text-slate-400 tracking-wide">{t('About me', language)}</span>
          </div>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all h-20 resize-none placeholder:text-slate-300 shadow-inner"
            placeholder={t('Tell us a bit about yourself...', language)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}