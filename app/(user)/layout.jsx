"use client";

import Footer from "@/components/nabvar/Footer";
import Navbar from "@/components/nabvar/Navbar";
import Link from "next/link";
// import BecomeSellerButton from "@/components/ui/BecomeSellerButton";

export default function UserLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Navbar Fixed Top */}
      <div className="flex-grow pt-24">
        <Navbar />
      </div>

      {/* Page Content */}
      <main>{children}</main>

      <Footer />
      {/* <BecomeSellerButton /> */}
    </div>
  );
}