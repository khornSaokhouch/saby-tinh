"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useReviewStore } from "@/app/stores/useReviewStore"
import { toast } from "react-hot-toast"
import { Edit2, Trash2, Send, CheckCircle, Plus, X, MessageSquare } from "lucide-react"
import { StarRating } from "./product-details-components/review/star-rating"
import { ConfirmationModal } from "./product-details-components/review/confirmation-modal"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

export default function UserReviews({ orderProductId, userId }) {
  const { reviews, loading, fetchReviews, createReview, updateReview, deleteReview } = useReviewStore()
  const [showForm, setShowForm] = useState(false)
  const [newReviewText, setNewReviewText] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editingReviewText, setEditingReviewText] = useState("")
  const [editingRating, setEditingRating] = useState(5)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null)

  useEffect(() => {
    fetchReviews(orderProductId)
  }, [orderProductId, fetchReviews])

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [reviews])

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
  }, [reviews])

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!newReviewText.trim()) return toast.error("Please add a comment")
    try {
      const res = await createReview({
        product_id: orderProductId,
        review_text: newReviewText.trim(),
        rating: newRating,
      })
      if (res.success) {
        toast.success("Review posted!")
        setNewReviewText("")
        setShowForm(false)
      }
    } catch (err) {
      toast.error("Failed to post review")
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          await deleteReview(reviewToDeleteId)
          setIsConfirmModalOpen(false)
        }}
        title="Remove Review"
      >
        Are you sure? This will permanently delete your feedback.
      </ConfirmationModal>

      {/* --- 1. COMPACT SUMMARY HEADER --- */}
      <section className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-gray-900 leading-none">{averageRating}</h2>
            <div>
              <StarRating rating={Math.round(Number(averageRating))} readOnly starSize="h-3 w-3" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{reviews.length} Reviews</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100 hidden sm:block" />
          <div className="hidden md:block">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Customer Feedback</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Verified community ratings</p>
          </div>
        </div>

        {userId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
              showForm ? "bg-gray-100 text-gray-500" : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
            }`}
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? "Close" : "Rate Product"}
          </button>
        )}
      </section>

      {/* --- 2. STREAMLINED FORM (Collapsible) --- */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Rating</p>
                  <StarRating rating={newRating} onRatingChange={setNewRating} starSize="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Describe your experience..."
                    className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-indigo-600 transition-all min-h-[80px] placeholder:text-gray-300"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddReview}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Send size={12} /> Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. CLEAN REVIEW LIST --- */}
      <div className="space-y-5">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-6 bg-gray-50/30 rounded-2xl border border-dashed border-gray-100">
             <MessageSquare className="w-5 h-5 text-gray-200 mx-auto mb-2" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No feedback yet</p>
          </div>
        ) : (
          sortedReviews.map((review) => {
            const isUserReview = String(review.user_id) === String(userId)
            const isEditing = editingReviewId === review.id

            return (
              <div key={review.id} className="group relative">
                <div className="flex gap-4">
                  {/* Avatar (Smaller) */}
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden shadow-sm">
                    {review.user?.profile_image_url ? (
                      <img src={review.user.profile_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-black uppercase">
                        {review.user?.name?.[0] || "?"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-indigo-100">
                        <StarRating rating={editingRating} onRatingChange={setEditingRating} starSize="h-3 w-3" />
                        <textarea
                          value={editingReviewText}
                          onChange={(e) => setEditingReviewText(e.target.value)}
                          className="w-full p-2 bg-white border border-gray-100 rounded-lg text-xs font-bold outline-none h-20"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => {
                             updateReview(review.id, { review_text: editingReviewText, rating: editingRating })
                             setEditingReviewId(null)
                          }} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-[9px] font-black uppercase tracking-widest">Save</button>
                          <button onClick={() => setEditingReviewId(null)} className="px-3 py-1.5 bg-white border border-gray-100 text-gray-400 rounded-md text-[9px] font-black uppercase tracking-widest">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 text-[11px] truncate">{review.user?.name || "Customer"}</span>
                              <span className="flex items-center gap-0.5 text-[8px] font-black text-green-600 bg-green-50 px-1 py-0.5 rounded uppercase tracking-widest">
                                <CheckCircle size={8} /> Verified
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={review.rating} readOnly starSize="h-2.5 w-2.5" />
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {isUserReview && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingReviewId(review.id); setEditingReviewText(review.review_text); setEditingRating(review.rating); }}
                                className="p-1.5 text-gray-300 hover:text-indigo-600 bg-white rounded-md border border-gray-50 shadow-sm"
                              >
                                <Edit2 size={10} />
                              </button>
                              <button 
                                onClick={() => { setReviewToDeleteId(review.id); setIsConfirmModalOpen(true); }}
                                className="p-1.5 text-gray-300 hover:text-rose-600 bg-white rounded-md border border-gray-50 shadow-sm"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-gray-600 text-[11px] font-bold leading-relaxed pr-8">
                          {review.review_text}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}