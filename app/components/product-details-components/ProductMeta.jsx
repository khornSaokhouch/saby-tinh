import Image from "next/image";
import { Twitter, Facebook, Instagram, Youtube, Dribbble } from "lucide-react";

export default function ProductMeta() {
  return (
    <div>
      <p className="mt-6 text-sm text-gray-500">Guaranteed Safe Checkout</p>
      <div className="flex items-center mt-2">
        <Image src="/payment-icons.png" alt="Payment Options" width={250} height={30} className="object-contain" />
      </div>
      <p className="mt-6 text-sm text-gray-500">SKU: ABC025168</p>
      <p className="mt-2 text-sm text-gray-500">CATEGORY: Cell Phones & Tablets</p>
      <p className="mt-2 text-sm text-gray-500">TAGS: Laptop, Macbook, Computer, M1</p>
      
      <div className="flex items-center gap-3 mt-6">
        <a href="#" className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"><Twitter className="w-4 h-4" /></a>
        <a href="#" className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"><Facebook className="w-4 h-4" /></a>
        <a href="#" className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"><Instagram className="w-4 h-4" /></a>
        <a href="#" className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"><Youtube className="w-4 h-4" /></a>
        <a href="#" className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"><Dribbble className="w-4 h-4" /></a>
      </div>
    </div>
  );
}