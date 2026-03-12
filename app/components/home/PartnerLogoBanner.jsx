"use client";

import React from "react";
import Image from "next/image";
import { FaHandshake } from "react-icons/fa";

const foodDeliveryPartners = [
  { id: 1, name: "Nham24", logo: "/logos/nham24_logo.png" },
  { id: 2, name: "Foodpanda", logo: "/logos/foodpanda_logo.png" },
  { id: 3, name: "GrabFood", logo: "/logos/grabfood_logo.png" },
  { id: 4, name: "E-GetS", logo: "/logos/egets_logo.png" },
  { id: 5, name: "WowNow", logo: "/logos/wownow_logo.png" },
];

const PartnerLogoBanner = () => {
  const mockPartners = [...foodDeliveryPartners];
  const infinitePartners = [...mockPartners, ...mockPartners]; // duplicate for smooth scroll

  const marqueeStyle = `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;

  return (
    <section className="w-full bg-gray-50 py-8 border-t border-b border-gray-200 overflow-hidden">
      {/* Global keyframes */}
      <style jsx global>{marqueeStyle}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
          <FaHandshake className="text-purple-600 text-[28px]" />
          Our Trusted Cambodian Delivery Partners
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          We partner with the best food tech and express delivery companies to bring your orders faster and safer across Cambodia.
        </p>
      </div>

      {/* Marquee Logos */}
      <div className="relative h-24 sm:h-32 md:h-40 overflow-hidden mt-6">
        <div
          className="absolute top-0 left-0 h-full flex flex-nowrap items-center space-x-4"
          style={{
            animation: "marquee 40s linear infinite",
            width: `${infinitePartners.length * 280}px`, // account for logo width
            minWidth: "200%",
          }}
        >
          {infinitePartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: "280px", height: "100px" }}
            >
              <div className="relative w-full h-full rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
                <Image
                  src={partner.logo || "/placeholder-store.png"}
                  alt={`${partner.name} Logo`}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                  className="opacity-90"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogoBanner;