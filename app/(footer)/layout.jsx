"use client";

import Footer from "@/components/nabvar/Footer";
import Navbar from "@/components/nabvar/Navbar";
import BecomeSellerButton from "@/components/ui/BecomeSellerButton";

export default function UserLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#fcfdfe]">
      {/* Navbar Fixed Top */}
      <div className="flex-grow pt-24">
        <Navbar />
      </div>

      {/* Page Content */}
      <main>{children}</main>

      <Footer />

      <BecomeSellerButton />

      {/* Styles for the float and glow move to globals.css */}
    </div>
  );
}