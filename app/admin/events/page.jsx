'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Search, Plus, Pencil, Trash2, Clock, 
  Loader2, Check, X, LayoutGrid, Timer, Image as ImageIcon,
  RefreshCw, MapPin, Calendar, ArrowUpRight, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEventStore } from '@/stores/useEventStore';
import EventFormModal from '@/components/admin/modelform/EventFormModal';
import { toast } from 'react-hot-toast';

export default function EventsPage() {
  const { 
    events, loading, fetchEvents, search, setSearch, saveEvent, deleteEvent, error
  } = useEventStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => fetchEvents(), 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = ev.name.toLowerCase().includes(search.toLowerCase()) ||
        (ev.description || '').toLowerCase().includes(search.toLowerCase());
      
      let matchTab = true;
      const today = new Date();
      const startDate = new Date(ev.start_date);
      const endDate = new Date(ev.end_date);
      
      if (activeTab === 'upcoming') {
        matchTab = startDate > today;
      } else if (activeTab === 'active') {
        matchTab = startDate <= today && endDate >= today;
      } else if (activeTab === 'past') {
        matchTab = endDate < today;
      }
      
      return matchSearch && matchTab;
    });
  }, [events, search, activeTab]);

  const handleSave = async (formData) => {
    setIsActionLoading(true);
    try {
      await saveEvent({ ...formData, id: selectedItem?.id });
      toast.success(selectedItem ? 'Event updated' : 'Event created');
      setIsFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save event');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteEvent(id);
      toast.success('Event removed');
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Events Manager</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Events</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Create and manage promotional campaigns for your store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchEvents()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black hover:bg-slate-800 transition-all shadow-md uppercase tracking-widest active:scale-95"
          >
            <Plus size={14} strokeWidth={3} />
            Create Event
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Events" value={events.length} icon={LayoutGrid} color="indigo" />
        <StatCard label="Active Search" value={filteredEvents.length} icon={Search} color="blue" />
        <StatCard label="System Status" value="Online" icon={Timer} color="emerald" />
      </div>

      {/* --- CONTENT TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 h-[32px] bg-slate-50 border border-transparent rounded-lg text-[9px] font-black text-slate-500 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all min-w-[140px] uppercase tracking-widest"
            >
              <option value="all">All Events</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={12} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Event Info</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && events.length === 0 ? (
                <tr><td colSpan="4" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse italic">Scanning Data...</td></tr>
              ) : filteredEvents.length === 0 ? (
                <tr><td colSpan="4" className="py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No events found</td></tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                           {event.event_image ? (
                             <img src={event.event_image} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={14} /></div>
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{event.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ref: {event.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[10px] font-bold text-slate-500 max-w-[220px] truncate">
                        {event.description || 'No description provided'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                          <Check size={10} strokeWidth={3} /> {event.start_date}
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-rose-100">
                          <X size={10} strokeWidth={3} /> {event.end_date}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedItem(event); setIsFormOpen(true); }}
                          className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                        >
                          <Pencil size={14} strokeWidth={3} />
                        </button>

                        {confirmDeleteId === event.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all"
                            >
                              {deletingId === event.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg shadow-sm active:scale-95 transition-all"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(event.id)}
                            className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all"
                          >
                            <Trash2 size={14} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EventFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedItem} 
        onSubmit={handleSave}
        isSubmitting={isActionLoading}
      />
    </div>
  );
}

// --- SUB COMPONENTS ---

// --- SUB COMPONENTS ---

function StatCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-600',
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm group relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className={`p-2 rounded-xl ${themes[color]} text-white shadow-lg`}>
          <Icon size={16} strokeWidth={3} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}