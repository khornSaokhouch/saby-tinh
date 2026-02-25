import { Minus, Plus, Heart, ShoppingCart } from "lucide-react";

export default function ProductActions({
  quantity, setQuantity, handleAddToCart, handleFavoriteClick, isFavorited,
}) {
  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Quantity</p>
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 w-fit border border-slate-200">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-6 font-black text-lg text-slate-900">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={handleAddToCart} 
          className="flex-1 min-w-[200px] h-[64px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" /> ADD TO UNIT CART
        </button>

        <button 
          onClick={handleFavoriteClick} 
          className={`h-[64px] px-5 rounded-2xl border transition-all ${isFavorited ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'}`}
        >
          <Heart className={`w-6 h-6 ${isFavorited ? "fill-white" : ""}`} />
        </button>
      </div>
    </div>
  );
}