"use client";

import { useEffect, useMemo } from "react";
import { MapPin, Navigation, Loader2, ChevronRight } from "lucide-react";
import { useAddressStore } from "@/stores/useAddressStore";

export default function StoreLocations({ userId, variant = "grid" }) {
  const { allAddresses, fetchAllAddresses, loading } = useAddressStore();

  useEffect(() => {
    if (allAddresses.length === 0) {
      fetchAllAddresses();
    }
  }, [allAddresses.length, fetchAllAddresses]);

  const storeLocations = useMemo(() => {
    if (!userId) return [];
    return allAddresses.filter(addr => String(addr.user_id) === String(userId));
  }, [allAddresses, userId]);

  if (loading && storeLocations.length === 0) {
    return (
      <div className="py-4 text-center bg-slate-50 rounded-xl border border-slate-100">
        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin mx-auto mb-1" />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Locating Shops...</p>
      </div>
    );
  }

  if (storeLocations.length === 0) return null;

  // --- SIDEBAR VARIANT ---
  if (variant === "sidebar") {
    return (
      <div className="space-y-3 py-4 border-t border-slate-100">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[9px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
            <MapPin size={10} className="text-indigo-600" /> {storeLocations.length} Shop Locations
          </h4>
        </div>

        <div className="space-y-2">
          {storeLocations.slice(0, 2).map((loc) => (
            <div
              key={loc.address_id || loc.id}
              className="p-3 bg-slate-50 hover:bg-white rounded-xl border border-transparent hover:border-indigo-100 transition-all group cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm shrink-0 transition-colors border border-slate-100">
                  <Navigation size={10} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                    {loc.house_number ? `${loc.house_number}, ` : ''}{loc.street}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5 uppercase tracking-tight">
                    {loc.commune}, {loc.province}
                  </p>
                  {loc.latitude && loc.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[9px] font-black text-indigo-600 hover:underline mt-1.5 flex items-center gap-1 uppercase tracking-widest"
                    >
                      Open Maps <ChevronRight size={8} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {storeLocations.length > 2 && (
            <button className="w-full py-2 text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors border border-dashed border-slate-100 rounded-lg uppercase tracking-widest">
              + {storeLocations.length - 2} more shops
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- FULL GRID VARIANT ---
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin size={16} className="text-indigo-600" /> Visit Our Shops
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
            Find us at these locations
          </p>
        </div>
        <div className="h-px flex-1 bg-slate-100 mx-6 hidden sm:block" />
        <div className="text-[9px] font-black text-white bg-slate-900 px-3 py-1.5 rounded-lg uppercase tracking-widest">
          {storeLocations.length} Shops
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storeLocations.map((loc) => (
          <div
            key={loc.address_id || loc.id}
            className="p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={40} className="text-indigo-600" />
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                <Navigation size={14} />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {loc.house_number ? `${loc.house_number}, ` : ''}{loc.street}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {loc.commune}, {loc.district}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-black text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded uppercase tracking-tight">
                    {loc.province}
                  </span>
                  {loc.country_name && (
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded uppercase tracking-tight">
                      {loc.country_name}
                    </span>
                  )}
                </div>

                {loc.latitude && loc.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-indigo-600 hover:text-indigo-700 transition-colors w-fit pt-2 border-t border-slate-50 group-hover:border-indigo-50 uppercase tracking-widest"
                  >
                    Get Directions <Navigation size={10} className="fill-current" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
