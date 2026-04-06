'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserPlus, Search, Mail, Phone, 
  Trash2, ShieldCheck, MoreHorizontal, Download, 
  RefreshCw, Loader2, Check, X, Shield, 
  User, Activity, Calendar, ArrowUpRight,
  Eye, EyeOff, Key, Info, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getCleanImageUrl } from '@/components/nabvar/utils';

export default function OwnerTeamMemberPage() {
  const { language } = useLanguageStore();
  const { users, fetchTeamMembers, addTeamMember, updateTeamMember, batchDeleteTeamMembers, loading, deleteUser } = useUserStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    bio: ''
  });

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const filteredTeam = useMemo(() => {
    return users.filter(m => 
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // --- Handlers ---

  const handleOpenModal = (member = null) => {
    if (member) {
      setIsEditMode(true);
      setEditingId(member.id);
      setFormData({
        name: member.name || '',
        email: member.email || '',
        password: '', // Keep empty for updates
        phone_number: member.phone_number || '',
        bio: member.profile?.bio || ''
      });
    } else {
      setIsEditMode(false);
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', phone_number: '', bio: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateTeamMember(editingId, formData);
        toast.success(t('Member updated successfully', language));
      } else {
        await addTeamMember(formData);
        toast.success(t('Member added successfully', language));
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || t('Operation failed', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteUser(id);
      toast.success(t('Member removed', language));
      setConfirmDeleteId(null);
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (err) {
      toast.error(t('Delete failed', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm(t('Are you sure you want to delete selected members?', language))) return;
    setIsSubmitting(true);
    try {
      await batchDeleteTeamMembers(selectedIds);
      toast.success(t('Members deleted', language));
      setSelectedIds([]);
    } catch (err) {
      toast.error(t('Batch delete failed', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selection Helpers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTeam.length) {
        setSelectedIds([]);
    } else {
        setSelectedIds(filteredTeam.map(m => m.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 pb-16 font-sans animate-in fade-in duration-500 pt-1">
      
      {/* --- BATCH ACTION BAR --- */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: -20, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-6"
          >
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="bg-indigo-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">
                {selectedIds.length}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} strokeWidth={3} />}
                {t('Delete Selected', language)}
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black transition-all"
              >
                {t('Cancel', language)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Organization Governance', language)}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Manage', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">{t('Team members', language)}</span>
          </h1>
          <p className="text-slate-500 text-[11px] font-medium mt-1">
            {t('Administer roles and permissions for your store members.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <UserPlus size={12} strokeWidth={3} /> {t('Enroll member', language)}
          </button>
          <button 
            onClick={() => fetchTeamMembers()}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm transition-all shadow-slate-100"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label={t('Total members', language)} value={users.length} icon={Users} color="indigo" />
        <MetricCard label={t('Active now', language)} value={Math.floor(users.length * 0.8)} icon={ShieldCheck} color="emerald" />
        <MetricCard label={t('Operating state', language)} value="Active" icon={Activity} color="purple" />
      </div>

      {/* --- REGISTRY TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-3 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={12} />
            <input 
              type="text" 
              placeholder={t('Search name, email...', language)} 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Registry size:', language)} {filteredTeam.length}</span>
            <div className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                {t('Owner access', language)}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="pl-6 w-10 py-3 text-left">
                   <div
                    onClick={toggleSelectAll}
                    className={`w-3.5 h-3.5 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedIds.length === filteredTeam.length && filteredTeam.length > 0
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-white border-slate-200 hover:border-indigo-400'
                    }`}
                   >
                     {selectedIds.length === filteredTeam.length && filteredTeam.length > 0 && <Check size={8} className="text-white" strokeWidth={5} />}
                   </div>
                </th>
                <th className="px-6 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('Member info', language)}</th>
                <th className="px-6 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('Identity & role', language)}</th>
                <th className="px-6 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('Joined', language)}</th>
                <th className="px-6 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                <tr>
                   <td colSpan="5" className="py-20 text-center">
                     <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Syncing registry...', language)}</span>
                     </div>
                   </td>
                </tr>
              ) : filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-slate-200">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Users size={32} />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('No members matching filter', language)}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTeam.map((member, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={member.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(member.id) ? 'bg-indigo-50/40' : ''}`}
                  >
                    <td className="pl-6 py-3.5">
                       <div
                        onClick={() => toggleSelectId(member.id)}
                        className={`w-3.5 h-3.5 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                          selectedIds.includes(member.id)
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'bg-white border-slate-200 group-hover:border-indigo-300'
                        }`}
                       >
                         {selectedIds.includes(member.id) && <Check size={8} className="text-white" strokeWidth={5} />}
                       </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px] border border-white shadow-sm overflow-hidden relative shrink-0">
                           {getCleanImageUrl(member.profile?.image_profile) ? (
                              <Image 
                                src={getCleanImageUrl(member.profile?.image_profile)} 
                                alt={member.name} 
                                fill 
                                className="object-cover" 
                              />
                           ) : (
                              member.name?.charAt(0).toUpperCase()
                           )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight">{member.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 truncate">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                        <div className="flex flex-col text-left gap-0.5">
                            <div className="flex items-center gap-1.5 leading-none">
                                <Shield size={9} className="text-indigo-600" />
                                <span className="text-[10px] font-bold text-slate-700 capitalize">{member.role || 'Member'}</span>
                                <span className="bg-indigo-50 text-indigo-600 text-[7px] font-black px-1.5 py-0.5 rounded-md border border-indigo-100 uppercase">#{member.id}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-50 px-0.5">
                                <Phone size={8} className="text-slate-400" />
                                <span className="text-[9px] font-semibold text-slate-500">{member.phone_number || '---'}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(member.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <AnimatePresence mode="wait" initial={false}>
                          {confirmDeleteId === member.id ? (
                            <motion.div
                              key="confirm-delete"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={() => handleDelete(member.id)}
                                disabled={isSubmitting}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                              >
                                {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg shadow-sm active:scale-95 transition-all"
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            </motion.div>
                          ) : (
                               <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleOpenModal(member)}
                                        className="p-1.5 bg-slate-50 text-slate-300 rounded-lg border border-slate-100 hover:border-indigo-100 hover:text-indigo-600 transition-all shadow-sm"
                                    >
                                        <Edit3 size={11} strokeWidth={3} />
                                    </button>
                                    <motion.button
                                        key="delete-button"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setConfirmDeleteId(member.id)}
                                        className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95 shadow-rose-100"
                                    >
                                        <Trash2 size={12} strokeWidth={3} />
                                    </motion.button>
                               </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-50 flex items-center justify-between text-slate-400 bg-slate-50/20">
            <p className="text-[9px] font-bold tracking-tight">
                {t('Authorized personnel only.', language)}
            </p>
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t('Registry Secured', language)}</span>
            </div>
        </div>
      </div>

      {/* --- ADD/EDIT MEMBER MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[20px] shadow-2xl z-[201] overflow-hidden border border-slate-100"
            >
                <div className="p-5 sm:p-6 flex flex-col h-full">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                {isEditMode ? <Edit3 size={14} className="text-indigo-600" /> : <UserPlus size={14} className="text-indigo-600" />}
                                <h3 className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">
                                    {isEditMode ? t('Update registry', language) : t('Enrollment', language)}
                                </h3>
                            </div>
                            <p className="text-base font-black text-slate-900 tracking-tighter leading-none">
                                {isEditMode ? t('Edit team member', language) : t('Add new member', language)}
                            </p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            <InputField label={t('Full name', language)} icon={User} name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <InputField label={t('Email', language)} icon={Mail} type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            <InputField 
                                label={isEditMode ? t('New password (opt)', language) : t('Password', language)} 
                                icon={Key} 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                required={!isEditMode} 
                            />
                            <InputField label={t('Phone', language)} icon={Phone} name="phone_number" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                        </div>
                        
                        <div className="space-y-1 text-left">
                            <div className="flex items-center gap-1.5 px-0.5">
                                <MoreHorizontal size={9} className="text-slate-400" />
                                <span className="text-[9px] font-black text-slate-400 tracking-wide uppercase">{t('Bio (optional)', language)}</span>
                            </div>
                            <textarea 
                                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-100 transition-all h-20 resize-none shadow-sm"
                                value={formData.bio}
                                onChange={e => setFormData({...formData, bio: e.target.value})}
                            />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2 shadow-slate-100"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : (
                                    <>
                                        {isEditMode ? t('Update registry', language) : t('Enroll member', language)} 
                                        <ArrowUpRight size={14} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden text-left">
      <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

function InputField({ label, icon: Icon, type = 'text', ...props }) {
    const [isVisible, setIsVisible] = useState(false);
    const finalType = type === 'password' ? (isVisible ? 'text' : 'password') : type;

    return (
        <div className="space-y-1 group text-left">
            <div className="flex items-center gap-1.5 px-0.5">
                <Icon size={9} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <span className="text-[9px] font-black text-slate-400 tracking-wide uppercase">{label}</span>
            </div>
            <div className="relative">
                <input 
                    type={finalType}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-sm"
                    {...props} 
                />
                {type === 'password' && (
                    <button 
                        type="button" 
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-200 hover:text-indigo-600"
                    >
                        {isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                )}
            </div>
        </div>
    );
}

// Custom Icons
function Edit3({ size, strokeWidth = 2, className = "" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    )
}