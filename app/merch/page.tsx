'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';

import Image from 'next/image';

interface SizeDetail {
  size: string;
  measurements: {
    [key: string]: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: string;
  material: string;
  frontImage: React.ReactNode;
  backImage: React.ReactNode;
  gradient: string;
  description: string;
  type: string;
  sizes: string[];
  sizeDetails: SizeDetail[];
}

export default function MerchPage() {
  const router = useRouter();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const products: Product[] = [
    {
      id: 'hoodie',
      name: 'CCIT Hoodie',
      price: '₹599',
      material: '100% Cotton',
      frontImage: <Image src="/back.png" alt="CCIT Hoodie Front" fill className="object-cover rounded-3xl" />,
      backImage: <Image src="/merch/hoodie-back.jpg" alt="CCIT Hoodie Back" fill className="object-cover rounded-3xl" />,
      gradient: 'from-purple-600 to-blue-600',
      description: 'Premium Quality • Limited Edition',
      type: 'Apparel',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      sizeDetails: [
        { size: 'XS', measurements: { 'Chest': '86 cm', 'Length': '63 cm', 'Shoulder': '41 cm' } },
        { size: 'S', measurements: { 'Chest': '91 cm', 'Length': '66 cm', 'Shoulder': '44 cm' } },
        { size: 'M', measurements: { 'Chest': '96 cm', 'Length': '69 cm', 'Shoulder': '47 cm' } },
        { size: 'L', measurements: { 'Chest': '101 cm', 'Length': '72 cm', 'Shoulder': '50 cm' } },
        { size: 'XL', measurements: { 'Chest': '106 cm', 'Length': '75 cm', 'Shoulder': '53 cm' } },
        { size: 'XXL', measurements: { 'Chest': '111 cm', 'Length': '78 cm', 'Shoulder': '56 cm' } }
      ]
    },
    {
      id: 'tshirt',
      name: 'CCIT T-Shirt',
      price: '₹399',
      material: 'Cotton Blend',
      frontImage: <Image src="/merch/tshirt.jpg" alt="CCIT T-Shirt Front" fill className="object-cover rounded-3xl" />,
      backImage: <Image src="/merch/tshirt-back.jpg" alt="CCIT T-Shirt Back" fill className="object-cover rounded-3xl" />,
      gradient: 'from-green-600 to-teal-600',
      description: 'Comfortable • Everyday Wear',
      type: 'Apparel',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      sizeDetails: [
        { size: 'XS', measurements: { 'Chest': '84 cm', 'Length': '61 cm', 'Shoulder': '39 cm' } },
        { size: 'S', measurements: { 'Chest': '89 cm', 'Length': '64 cm', 'Shoulder': '42 cm' } },
        { size: 'M', measurements: { 'Chest': '94 cm', 'Length': '67 cm', 'Shoulder': '45 cm' } },
        { size: 'L', measurements: { 'Chest': '99 cm', 'Length': '70 cm', 'Shoulder': '48 cm' } },
        { size: 'XL', measurements: { 'Chest': '104 cm', 'Length': '73 cm', 'Shoulder': '51 cm' } },
        { size: 'XXL', measurements: { 'Chest': '109 cm', 'Length': '76 cm', 'Shoulder': '54 cm' } }
      ]
    },
    {
      id: 'mug',
      name: 'Coffee Mug',
      price: '₹299',
      material: 'Ceramic',
      frontImage: <Image src="/merch/mug.jpg" alt="Coffee Mug Front" fill className="object-cover rounded-3xl" />,
      backImage: <Image src="/merch/mug-side.jpg" alt="Coffee Mug Side" fill className="object-cover rounded-3xl" />,
      gradient: 'from-orange-600 to-red-600',
      description: 'Perfect for Code & Coffee',
      type: 'Accessories',
      sizes: ['11oz', '15oz'],
      sizeDetails: [
        { size: '11oz', measurements: { 'Height': '9.5 cm', 'Diameter': '8.2 cm', 'Capacity': '325 ml' } },
        { size: '15oz', measurements: { 'Height': '11.4 cm', 'Diameter': '8.8 cm', 'Capacity': '440 ml' } }
      ]
    },
    {
      id: 'stickers',
      name: 'Sticker Pack',
      price: '₹99',
      material: 'Set of 10',
      frontImage: <Image src="/merch/stickers.jpg" alt="Sticker Pack Front" fill className="object-cover rounded-3xl" />,
      backImage: <Image src="/merch/stickers-layout.jpg" alt="Sticker Pack Layout" fill className="object-cover rounded-3xl" />,
      gradient: 'from-pink-600 to-purple-600',
      description: 'Waterproof • Tech Themed',
      type: 'Accessories',
      sizes: ['Standard'],
      sizeDetails: [
        { size: 'Standard', measurements: { 'Size Range': '5-10 cm', 'Quantity': '10 pieces', 'Material': 'Vinyl' } }
      ]
    }
  ];

  const currentProduct = products[currentProductIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previousItem();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'Escape') goBack();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentProductIndex]);

  const goBack = () => {
    router.push('/');
  };

  const handleBuyClick = () => {
    // Open Google Docs form for merchandise purchase
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/viewform', '_blank');
  };

  const previousItem = () => {
    if (isSliding) return; // Prevent multiple clicks during animation
    
    setSlideDirection('left');
    setIsSliding(true);
    
    setTimeout(() => {
      setCurrentProductIndex(prev => 
        prev > 0 ? prev - 1 : products.length - 1
      );
      setSelectedSize('');
      setIsFlipped(false);
      
      setTimeout(() => {
        setIsSliding(false);
      }, 50);
    }, 300);
  };

  const nextItem = () => {
    if (isSliding) return; // Prevent multiple clicks during animation
    
    setSlideDirection('right');
    setIsSliding(true);
    
    setTimeout(() => {
      setCurrentProductIndex(prev => 
        prev < products.length - 1 ? prev + 1 : 0
      );
      setSelectedSize('');
      setIsFlipped(false);
      
      setTimeout(() => {
        setIsSliding(false);
      }, 50);
    }, 300);
  };

  // Reset selected size when product changes
  useEffect(() => {
    setSelectedSize('');
    setIsFlipped(false);
  }, [currentProductIndex]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat font-sans relative overflow-hidden" style={{ backgroundImage: 'url("/merch-bg.jpg")' }}>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Navigation */}
      <nav className="fixed top-6 left-6 z-50">
        <button 
          onClick={goBack}
          className="text-white hover:scale-110 transition-all duration-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </nav>

      {/* Buy Button */}
      <button 
        onClick={handleBuyClick}
        className="fixed top-6 right-6 z-50 bg-black/70 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl hover:scale-110 hover:bg-black/80 transition-all duration-300 shadow-lg"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>

      {/* Left Arrow */}
      <button 
        onClick={previousItem}
        disabled={isSliding}
        className={`fixed left-8 top-1/2 transform -translate-y-1/2 z-50 text-white hover:scale-110 transition-all duration-300 ${
          isSliding ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextItem}
        disabled={isSliding}
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-50 text-white hover:scale-110 transition-all duration-300 ${
          isSliding ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Content - Centered */}
      <div className="min-h-screen flex flex-col items-center justify-center">
        
        {/* Size Chart */}
        <div className={`mb-8 transition-all duration-300 ${
          isSliding ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {currentProduct.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  console.log('Size clicked:', size);
                  setSelectedSize(selectedSize === size ? '' : size);
                }}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 font-medium ${
                  selectedSize === size
                    ? 'bg-white text-black border-white shadow-lg transform scale-105'
                    : 'bg-black/50 text-white border-white/30 hover:border-white/60 hover:bg-black/70'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Size Details */}
          {selectedSize && (
            <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto shadow-lg animate-in fade-in duration-300">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">
                Size {selectedSize} Details
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {currentProduct.sizeDetails
                  .find(detail => detail.size === selectedSize)
                  ?.measurements && 
                  Object.entries(
                    currentProduct.sizeDetails.find(detail => detail.size === selectedSize)!.measurements
                  ).map(([measurement, value]) => (
                    <div key={measurement} className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{measurement}:</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        {/* Product Header */}
        <div className={`text-center mb-12 transition-all duration-300 ${
          isSliding ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            {currentProduct.name}
          </h1>
          <p className="text-2xl text-gray-400 font-light">
            {currentProduct.type}
          </p>
        </div>

        {/* Product Image Container with Flip Animation and Sliding */}
        <div className="relative group overflow-hidden">
          <div className={`w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 relative [perspective:1000px] transition-all duration-300 ease-in-out ${
            isSliding 
              ? slideDirection === 'right' 
                ? 'translate-x-full opacity-0 scale-95' 
                : '-translate-x-full opacity-0 scale-95'
              : 'translate-x-0 opacity-100 scale-100'
          }`}>
            {/* Flip Container */}
            <div 
              className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl overflow-hidden">
                {currentProduct.frontImage}
              </div>
              
              {/* Back Side */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden">
                {currentProduct.backImage}
              </div>
            </div>
          </div>
          
          {/* Product Price Badge */}
          <div className={`absolute top-6 right-6 bg-black/70 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
            isSliding ? 'opacity-0' : 'opacity-100'
          }`}>
            {currentProduct.price}
          </div>

          {/* Image Toggle Controls */}
          <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ${
            isSliding ? 'opacity-0' : 'opacity-100'
          }`}>
            <button
              onClick={() => setIsFlipped(false)}
              className={`px-4 py-2 rounded-xl border transition-all duration-300 font-medium text-sm ${
                !isFlipped
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-black/50 text-white border-white/30 hover:border-white/60 hover:bg-black/70'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setIsFlipped(true)}
              className={`px-4 py-2 rounded-xl border transition-all duration-300 font-medium text-sm ${
                isFlipped
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-black/50 text-white border-white/30 hover:border-white/60 hover:bg-black/70'
              }`}
            >
              Back
            </button>
          </div>

          {/* Flip Indicator */}
          <div className={`absolute top-6 left-6 bg-black/70 backdrop-blur-md border border-white/20 text-white px-3 py-2 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 ${
            isSliding ? 'opacity-0' : 'opacity-100'
          }`}>
            {isFlipped ? 'Back View' : 'Front View'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/70 backdrop-blur-md border-t border-white/20 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white text-lg font-medium">
            You can explore the merch here too. To buy, click the buy button and fill out the Google Doc.
          </p>
        </div>
      </footer>
    </div>
  );
}