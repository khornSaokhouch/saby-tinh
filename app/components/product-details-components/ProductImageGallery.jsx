import Image from "next/image";

export default function ProductImageGallery({ product }) {
  if (!product) return null;
  return (
    <div className="relative h-full min-h-[500px] group bg-slate-50">
      <div className="absolute top-6 left-6 z-10 bg-slate-900 text-white text-[10px] font-black py-1.5 px-3 rounded-lg tracking-widest uppercase">
        Hardware Core
      </div>
      <Image
        src={product.product_image_url}
        alt={product.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        priority
      />
    </div>
  );
}