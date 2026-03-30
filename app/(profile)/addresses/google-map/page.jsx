"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Check, Loader2, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

const DynamicMapPicker = dynamic(() => import("../MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialising Map...</p>
    </div>
  ),
});

function MapPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialLat = parseFloat(searchParams.get("lat") || "11.5564");
  const initialLng = parseFloat(searchParams.get("lng") || "104.9282");
  const editId = searchParams.get("editId");

  const [position, setPosition] = useState([initialLat, initialLng]);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    const action = editId ? "edit" : "new";
    const editParam = editId ? `&editId=${editId}` : "";
    router.push(`/addresses?action=${action}${editParam}&lat=${position[0]}&lng=${position[1]}`);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans overflow-hidden">
      {/* COMPACT NAV BAR */}
      <nav className="relative z-[500] bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-12 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Pin Destination</h1>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Adjust marker to delivery hub</p>
        </div>

        <div className="w-12" />
      </nav>

      {/* MAP AREA */}
      <div className="flex-1 relative">
        <DynamicMapPicker position={position} onLocationSelect={setPosition} />
        
        {/* Floating Tooltip */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
          <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm shadow-xl border border-white/10">
            <Navigation size={10} className="text-indigo-400" />
            Drag or Tap to Pin
          </div>
        </div>
      </div>

      {/* COMPACT BOTTOM PANEL */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="relative z-[500] bg-white border-t border-slate-100 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] rounded-t-2xl"
      >
        <div className="max-w-sm mx-auto">
          {/* Location Details */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
              <MapPin size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gps Coordinates</p>
              <p className="text-xs font-black text-slate-900 tracking-tight">
                {position[0].toFixed(5)} N, {position[1].toFixed(5)} E
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className="w-full h-11 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {confirmed ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Check size={14} /> 
                Confirm Endpoint
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AddressMapPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locating Terminal...</p>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}