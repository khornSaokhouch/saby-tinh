"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useReviewStore } from "@/app/stores/useReviewStore"
import { toast } from "react-hot-toast"
import { Edit2, Trash2, MessageSquare, Send, CheckCircle, Plus, X } from "lucide-react"
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

  // Calculate Average for the Summary
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
    <div className="max-w-7xl mx-auto px-4 py-10">
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
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h2 className="text-5xl font-black text-slate-900 leading-none">{averageRating}</h2>
            <div className="mt-2">
              <StarRating rating={Math.round(Number(averageRating))} readOnly starSize="h-4 w-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{reviews.length} Reviews</p>
          </div>
          <div className="h-16 w-px bg-slate-100 hidden md:block" />
          <div className="hidden sm:block space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Customer Feedback</h3>
            <p className="text-sm text-slate-500 font-medium">Verified reviews from our community.</p>
          </div>
        </div>

        {userId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              showForm ? "bg-slate-100 text-slate-600" : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
            }`}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Close" : "Write a Review"}
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
            className="overflow-hidden mb-10"
          >
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="sm:w-1/3 space-y-4">
                  <p className="text-sm font-bold text-slate-700">How would you rate it?</p>
                  <StarRating rating={newRating} onRatingChange={setNewRating} starSize="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-4">
                  <textarea
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 transition-all min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddReview}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Send size={16} /> Post Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. CLEAN REVIEW LIST --- */}
      <div className="space-y-8">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 font-medium">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedReviews.map((review) => {
            const isUserReview = String(review.user_id) === String(userId)
            const isEditing = editingReviewId === review.id

            return (
              <div key={review.id} className="group relative">
                <div className="flex gap-4 sm:gap-6">
                  {/* Avatar */}
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden">
                    {review.user?.profile_image_url ? (
                      <img src={review.user.profile_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-indigo-100">
                        <StarRating rating={editingRating} onRatingChange={setEditingRating} />
                        <textarea
                          value={editingReviewText}
                          onChange={(e) => setEditingReviewText(e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => {
                             updateReview(review.id, { review_text: editingReviewText, rating: editingRating })
                             setEditingReviewId(null)
                          }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Save</button>
                          <button onClick={() => setEditingReviewId(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-bold">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{review.user?.name || "Customer"}</span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                <CheckCircle size={10} /> Verified
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <StarRating rating={review.rating} readOnly starSize="h-3 w-3" />
                              <span className="text-[11px] text-slate-400 font-medium">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {isUserReview && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingReviewId(review.id); setEditingReviewText(review.review_text); setEditingRating(review.rating); }}
                                className="p-2 text-slate-400 hover:text-indigo-600"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={() => { setReviewToDeleteId(review.id); setIsConfirmModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
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