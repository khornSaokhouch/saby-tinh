"use client"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">{children}</p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm" onClick={onClose}>Cancel</button>
              <button className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm" onClick={onConfirm}>Yes, Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}