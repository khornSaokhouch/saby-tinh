import { ShieldCheck, Truck } from "lucide-react";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4" /> Official Warranty Included
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{product.name}</h1>
      
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-black text-slate-900">${product.price?.toFixed(2)}</span>
        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg flex items-center gap-1">
          <Truck className="w-3 h-3" /> Free Global Shipping
        </span>
      </div>

      <p className="text-slate-500 leading-relaxed text-sm lg:text-base">
        Professional-grade hardware design featuring next-gen DDR5 compatibility, 
        advanced digital VRM, and ultra-durable components for high-performance computing.
      </p>

      <div className="flex items-center gap-2 py-3 px-4 bg-blue-50/50 rounded-xl border border-blue-100 w-fit">
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        <span className="text-xs font-bold text-blue-700 uppercase tracking-tighter">In Stock: Ready for Dispatch</span>
      </div>
    </div>
  );
}