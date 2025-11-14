import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const ImageGallery = ({ images, currentIndex, onIndexChange }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isZoomed || !mainImageRef.current || !containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleThumbnailClick = (index) => {
    onIndexChange(index);
    setIsZoomed(false);
  };

  const handlePrevClick = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleNextClick = () => {
    onIndexChange((currentIndex + 1) % images.length);
    setIsZoomed(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-200 bg-amber-50"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.img
          ref={mainImageRef}
          src={images[currentIndex]}
          alt="Product"
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />

        {/* Zoom Controls */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-4 right-4 p-2 rounded-lg bg-white/90 backdrop-blur-sm text-amber-600 hover:text-amber-700 transition-colors duration-300"
        >
          {isZoomed ? (
            <ZoomOut className="h-5 w-5" />
          ) : (
            <ZoomIn className="h-5 w-5" />
          )}
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevClick}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/90 backdrop-blur-sm text-amber-600 hover:text-amber-700 transition-colors duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNextClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/90 backdrop-blur-sm text-amber-600 hover:text-amber-700 transition-colors duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Vintage Overlay */}
        <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply" />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
              currentIndex === index
                ? 'border-amber-600'
                : 'border-amber-200 hover:border-amber-400'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery; 