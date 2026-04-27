'use client';

import { DollarSign, Percent, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { request } from '@/util/request';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function PlatformFeeSection() {
  const { language } = useLanguageStore();
  const [fee, setFee] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFee();
  }, []);

  const fetchFee = async () => {
    try {
      const res = await request('/admin/platform-fee', 'GET');
      if (res.success && res.data) {
        setFee(res.data.commission_percentage);
      }
    } catch (error) {
      console.error("Failed to fetch platform fee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await request('/admin/platform-fee', 'POST', {
        commission_percentage: fee
      });
      if (res.success) {
        toast.success(t('Platform fee updated successfully', language));
      } else {
        toast.error(t('Failed to update fee', language));
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(t('Operation failed', language));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <DollarSign size={14} strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('Platform Fee', language)}</h3>
        </div>
        
        <button 
          onClick={handleUpdate}
          disabled={isSaving}
          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="block text-[8px] font-bold text-slate-400 tracking-wide mb-1 ml-1 uppercase">
            {t('Commission Percentage', language)}
          </label>
          <div className="relative">
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              step="0.01"
              min="0"
              max="100"
              className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-10 py-2 text-[12px] font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Percent size={12} strokeWidth={3} />
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 italic leading-relaxed px-1">
            {t('This percentage will be deducted from each product sale.', language)}
          </p>
        </div>
      </div>
      
      <div className="absolute -right-5 -bottom-5 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}
