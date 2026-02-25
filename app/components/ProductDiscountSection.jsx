import React from 'react';

// You can replace these with actual image URLs.
// I've used the image URLs from the screenshot analysis.
const productImages = {
  main: 'https://i.imgur.com/k6KxL2B.png', // Main phone image
  thumb1: 'https://i.imgur.com/gSZnz0e.png',
  thumb2: 'https://i.imgur.com/wV23fC3.png',
  thumb3: 'https://i.imgur.com/i95jHjT.png',
  thumb4: 'https://i.imgur.com/MZaEopz.png',
  ad1: 'https://i.imgur.com/rNnFqOr.png', // Xbox controllers
  ad2: 'https://i.imgur.com/9C06sWN.png', // Foldable phone/tablet
  ad3: 'https://i.imgur.com/E843ueD.png', // Phone lying down
};

// Simple data for the product
const productData = {
  name: 'Xioma Redmi Note 11 Pro 256GB 2023, Black Smartphone',
  salePrice: 569.00,
  originalPrice: 759.00,
  features: [
    'Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core',
    'DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory',
    'Commanding Power Design: Twin 16+1+2 Phases Digital VRM',
  ],
  sold: 26,
  total: 75,
  countdown: {
    days: -162,
    hours: -9,
    minutes: -32,
    seconds: -34,
  },
};

const ProductDiscountSection = () => {
  return (
    <div className=" p-4 md:p-8 font-sans">
      <div className="max-w-8xl mx-auto">
        {/* Header Bar */}
        <header className="bg-green-500 text-white flex justify-between items-center p-3 rounded-lg mb-6">
          <h2 className="text-lg font-bold tracking-wider">EXPLORE OUR PRODUCT'S DISCOUNT</h2>
          <button className="bg-white text-green-600 font-semibold py-2 px-5 rounded-full border border-green-500 hover:bg-gray-100 transition-colors">
            View All
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Main Product Card */}
          <div className="flex-[3] bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-8">
            {/* Image Gallery */}
            <div className="flex gap-4 flex-1">
              <div className="flex flex-col gap-3">
                <div className="w-16 h-16 border-2 border-green-500 p-1 rounded-md cursor-pointer flex items-center justify-center">
                  <img src={productImages.thumb1} alt="Thumbnail 1" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-16 h-16 border border-gray-200 p-1 rounded-md cursor-pointer flex items-center justify-center">
                  <img src={productImages.thumb2} alt="Thumbnail 2" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-16 h-16 border border-gray-200 p-1 rounded-md cursor-pointer flex items-center justify-center">
                  <img src={productImages.thumb3} alt="Thumbnail 3" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-16 h-16 border border-gray-200 p-1 rounded-md cursor-pointer flex items-center justify-center">
                  <img src={productImages.thumb4} alt="Thumbnail 4" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <img src={productImages.main} alt={productData.name} className="max-h-[400px] object-contain" />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-xl font-bold text-gray-800">{productData.name}</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">${productData.salePrice.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">${productData.originalPrice.toFixed(2)}</span>
              </div>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {productData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="flex gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-semibold py-1 px-3 rounded">FREE SHIPPING</span>
                <span className="bg-red-100 text-red-700 text-xs font-semibold py-1 px-3 rounded">FREE GIFT</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500 uppercase leading-tight">
                  Hurry Up! <br /> Promotion will expires in
                </p>
                <div className="flex gap-4 items-baseline">
                  <div className="flex items-baseline text-gray-600">
                    <span className="text-2xl font-bold text-gray-800 mr-1">{productData.countdown.days}</span>
                    <span className="text-lg">d</span>
                  </div>
                  <div className="flex items-baseline text-gray-600">
                    <span className="text-2xl font-bold text-gray-800 mr-1">{productData.countdown.hours}</span>
                    <span className="text-lg">h</span>
                  </div>
                  <div className="flex items-baseline text-gray-600">
                    <span className="text-2xl font-bold text-gray-800 mr-1">{productData.countdown.minutes}</span>
                    <span className="text-lg">m</span>
                  </div>
                  <div className="flex items-baseline text-gray-600">
                    <span className="text-2xl font-bold text-gray-800 mr-1">{productData.countdown.seconds}</span>
                    <span className="text-lg">s</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-auto">
                <span>Sold: {productData.sold}/{productData.total}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Ad Sidebar */}
          <aside className="flex-[1] flex flex-col gap-6">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src={productImages.ad1} alt="Ad 1: Gaming Sale" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src={productImages.ad2} alt="Ad 2: Tablets" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src={productImages.ad3} alt="Ad 3: Smartphones" className="w-full h-full object-cover" />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default ProductDiscountSection;