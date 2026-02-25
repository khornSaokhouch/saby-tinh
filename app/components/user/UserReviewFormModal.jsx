"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MessageSquare, Loader2, Send } from "lucide-react";
import { useReviewStore } from "@/app/stores/useReviewStore";
import { toast } from "react-hot-toast";

export default function UserReviewFormModal({ isOpen, onClose, orderLine, onSave }) {
  const { submitReview, loading } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating before submitting.");
      return;
    }

    const res = await submitReview({
      order_line_id: orderLine.id,
      rating,
      review_text: reviewText,
    });

    if (res.success) {
      toast.success("Review submitted! Your feedback is valued.");
      onSave?.();
      onClose();
    } else {
      toast.error(res.message || "Failed to submit review.");
    }
  };

  const prod = orderLine.product_item_variant?.product_item?.product || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <MessageSquare size={22} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Submit Review</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Component Acquisition Registry</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* Product Summary */}
            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="w-16 h-16 bg-white rounded-xl border border-slate-100 p-2 shrink-0">
                  <img src={prod.images?.[0]?.image || "/placeholder.svg"} alt={prod.name} className="w-full h-full object-contain" />
               </div>
               <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{prod.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {orderLine.product_item_variant?.color?.name} / {orderLine.product_item_variant?.size?.name}
                  </p>
               </div>
            </div>

            {/* Star Interaction */}
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Rating</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="group transition-all active:scale-90"
                  >
                    <Star 
                      size={42} 
                      className={`transition-all duration-300 ${
                        (hoverRating || rating) >= star 
                          ? 'fill-amber-400 stroke-amber-400 scale-110' 
                          : 'stroke-slate-200 fill-transparent'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs font-black text-indigo-600 uppercase tracking-widest">
                {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Rating Required'}
              </p>
            </div>

            {/* Text Area */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Hardware Experience</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your technical findings with the community..."
                className="w-full bg-slate-50 border border-slate-200 rounded-[28px] py-5 px-6 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none min-h-[140px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-40 active:scale-[0.98] group"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Transmit Feedback <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
