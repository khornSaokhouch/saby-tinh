
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Check, Loader2, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

const DynamicMapPicker = dynamic(() => import("../addresses/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      <p className="text-sm font-medium text-slate-500">Getting your map ready...</p>
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
    <div className="fixed inset-0 bg-white flex flex-col font-sans">
      {/* TOP NAVIGATION BAR */}
      <nav className="relative z-[500] bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors rounded-xl hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold text-slate-900">Pin Location</h1>
          <p className="text-[11px] text-slate-500 font-medium">Tap the map to move the pin</p>
        </div>

        <div className="w-10 sm:w-20" /> {/* Balance spacer */}
      </nav>

      {/* MAP AREA */}
      <div className="flex-1 relative">
        <DynamicMapPicker position={position} onLocationSelect={setPosition} />
        
        {/* Floating Instruction Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
          <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm shadow-xl">
            <Navigation size={12} className="text-indigo-400" />
            Find your house and tap to pin it
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION PANEL */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative z-[500] bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-[2.5rem]"
      >
        <div className="max-w-md mx-auto">
          {/* Location Summary */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pinned Location</p>
              <p className="text-base font-bold text-slate-900">
                {position[0].toFixed(5)}, {position[1].toFixed(5)}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
          >
            {confirmed ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Check size={20} /> 
                Confirm Delivery Location
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
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Locating delivery hub...</p>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}