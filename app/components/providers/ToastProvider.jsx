"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right" // Moved to top-right
      toastOptions={{
        // Default Duration (4 seconds)
        duration: 4000, 
        
        // Base Styling for all toasts
        style: {
          background: "#ffffff",
          color: "#0f172a", // text-slate-900
          padding: "14px 20px",
          borderRadius: "16px", // rounded-2xl to match your cards
          border: "1px solid #f1f5f9", // border-slate-100
          fontSize: "14px",
          fontWeight: "600", // Semi-bold for readability (not ultra-black)
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
        },
        
        // SUCCESS TOAST CONFIG
        success: {
          duration: 4000, // 4 seconds
          iconTheme: {
            primary: "#10b981", // text-emerald-500 (Matches your "In Stock" color)
            secondary: "#ffffff",
          },
          style: {
            border: "1px solid #d1fae5", // border-emerald-100
            background: "#ecfdf5", // bg-emerald-50
            color: "#065f46", // text-emerald-800
          }
        },
        
        // ERROR TOAST CONFIG
        error: {
          duration: 5000, // 5 seconds (Errors stay slightly longer so users can read them)
          iconTheme: {
            primary: "#f43f5e", // text-rose-500 (Matches your "Out of Stock" color)
            secondary: "#ffffff",
          },
          style: {
            border: "1px solid #ffe4e6", // border-rose-100
            background: "#fff1f2", // bg-rose-50
            color: "#9f1239", // text-rose-800
          }
        },

        // LOADING TOAST CONFIG (If you use toast.loading)
        loading: {
          duration: Infinity, // Stays until you dismiss it programmatically
          iconTheme: {
            primary: "#4f46e5", // text-indigo-600
            secondary: "#ffffff",
          },
          style: {
            border: "1px solid #e0e7ff", // border-indigo-100
            background: "#eef2ff", // bg-indigo-50
            color: "#3730a3", // text-indigo-800
          }
        }
      }}
      containerStyle={{
        zIndex: 99999,
        top: 40, // Offset from top
        right: 40,
      }}
    />
  );
}