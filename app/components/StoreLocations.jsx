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
      <div className="py-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-100">
        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin mx-auto mb-1" />
        <p className="text-[10px] font-bold text-gray-400">Locating our shops...</p>
      </div>
    );
  }

  if (storeLocations.length === 0) return null;

  // --- SIDEBAR VARIANT ---
  if (variant === "sidebar") {
    return (
      <div className="space-y-3 py-4 border-t border-gray-50 uppercase tracking-tight">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase">
            <MapPin size={10} className="text-indigo-600" /> Available at {storeLocations.length} shops
          </h4>
        </div>
        
        <div className="space-y-2">
          {storeLocations.slice(0, 2).map((loc) => (
            <div 
              key={loc.address_id || loc.id} 
              className="p-3 bg-gray-50/50 hover:bg-white rounded-xl border border-transparent hover:border-indigo-100 transition-all group cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-sm shrink-0 transition-colors">
                  <Navigation size={10} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-gray-900 truncate leading-tight">
                    {loc.house_number ? `${loc.house_number}, ` : ''}{loc.street}
                  </p>
                  <p className="text-[9px] font-semibold text-gray-400 truncate mt-0.5">
                    {loc.commune}, {loc.province}
                  </p>
                  {loc.latitude && loc.longitude && (
                    <a 
                      href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[9px] font-bold text-indigo-600 hover:underline mt-1.5 flex items-center gap-1"
                    >
                      Open in Maps <ChevronRight size={8} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {storeLocations.length > 2 && (
            <button className="w-full py-2 text-[9px] font-bold text-gray-400 hover:text-indigo-600 transition-colors border border-dashed border-gray-100 rounded-lg">
              + {storeLocations.length - 2} more shops
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- FULL GRID VARIANT (Regular Section) ---
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={16} className="text-indigo-600" /> Visit our Shops
          </h3>
          <p className="text-[10px] font-semibold text-gray-400 mt-1">
            Find us at these convenient locations
          </p>
        </div>
        <div className="h-px flex-1 bg-gray-100 mx-6 hidden sm:block" />
        <div className="text-[10px] font-bold text-white bg-black px-3 py-1 rounded-lg">
          {storeLocations.length} Shops
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storeLocations.map((loc) => (
          <div 
            key={loc.address_id || loc.id} 
            className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={40} className="text-indigo-600" />
            </div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Navigation size={14} />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {loc.house_number ? `${loc.house_number}, ` : ''}{loc.street}
                </p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
                  {loc.commune}, {loc.district}
                </p>
                <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                        {loc.province}
                    </span>
                    {loc.country_name && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {loc.country_name}
                        </span>
                    )}
                </div>
                
                {loc.latitude && loc.longitude && (
                   <a 
                     href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                     target="_blank" rel="noopener noreferrer"
                     className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors w-fit pt-2 border-t border-gray-50 group-hover:border-indigo-50"
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
