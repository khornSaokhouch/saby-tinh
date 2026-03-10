'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Calendar, Search, Plus, Pencil, Trash2, Clock, 
  Loader2, Check, X, LayoutGrid, Timer, Image as ImageIcon,
  ShieldAlert, RefreshCw, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStore } from '@/stores/useEventStore';
import EventFormModal from '@/components/admin/modelform/EventFormModal';
import { toast } from 'react-hot-toast';

export default function EventsPage() {
  const { 
    events, 
    loading, 
    fetchEvents, 
    search, 
    setSearch, 
    saveEvent, 
    deleteEvent,
    error
  } = useEventStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      fetchEvents();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter(ev => 
      ev.name.toLowerCase().includes(search.toLowerCase()) ||
      (ev.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

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
      toast.success('Event deleted');
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-10 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Events</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchEvents()}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-[0.2em]"
          >
            <Plus size={16} strokeWidth={3} /> Create Event
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Events" value={events.length} icon={LayoutGrid} color="indigo" />
        <MetricCard label="Search Results" value={filteredEvents.length} icon={MapPin} color="purple" />
        <MetricCard label="Active Status" value="Live" icon={Timer} color="emerald" />
      </div>

      {/* --- EVENTS TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search event registry..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {filteredEvents.length} of {events.length} Records
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Designation</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description Meta</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && events.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-indigo-500" size={32} />
                      Loading events...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                      <ShieldAlert size={14} /> {error}
                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold">
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event, idx) => (
                  <tr key={event.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-white shadow-sm shrink-0 flex items-center justify-center group-hover:rotate-3 transition-transform">
                           {event.event_image ? (
                             <img src={event.event_image} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <ImageIcon size={14} className="text-slate-300" />
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{event.name}</span>
                          <span className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest">Segment: {event.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-black text-slate-400 max-w-[200px] line-clamp-1 italic uppercase tracking-wider">
                        {event.description || 'Null Content'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                          <Clock size={10} /> {event.start_date}
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-rose-100/50">
                          <Clock size={10} /> {event.end_date}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => { setSelectedItem(event); setIsFormOpen(true); }}
                          className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100/50"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>

                        {confirmDeleteId === event.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(event.id)}
                              disabled={deletingId === event.id}
                              className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                            >
                              {deletingId === event.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(event.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100/50"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
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

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Total: {filteredEvents.length} Active Records
          </span>
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

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors text-left">
      <div className="absolute top-0 right-0 w-24 h-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-[0.03] group-hover:scale-150 transition-transform duration-700" />
      <div className={`p-3 rounded-xl w-fit mb-4 ${themes[color] || themes.indigo}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700" />
    </div>
  );
}