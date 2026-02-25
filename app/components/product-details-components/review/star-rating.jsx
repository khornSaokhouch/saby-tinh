"use client"
import React, { useState } from "react"
import { Star } from 'lucide-react'

// --- Helper Components ---

export const StarRating = ({ rating, onRatingChange, readOnly = false, starSize = "h-5 w-5" }) => {
  const [hoverRating, setHoverRating] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} transition-all ${!readOnly ? "cursor-pointer active:scale-90" : ""} 
            ${(hoverRating || rating) >= star ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
          onClick={() => !readOnly && onRatingChange?.(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        />
      ))}
    </div>
  )
}
