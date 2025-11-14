import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,

  Ruler,
  Info,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageGallery from '../components/products/ImageGallery';
import SizeGuideModal from '../components/products/SizeGuideModal';
import ReviewSection from '../components/products/ReviewSection';
import ProductRecommendations from '../components/products/ProductRecommendations';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // getProduct already returns normalized product
        const normalized = await productService.getProduct(id);
        setProduct(normalized);
        setSelectedColor(Array.isArray(normalized.colors) ? normalized.colors[0] : normalized.color);
        setSelectedSize(Array.isArray(normalized.sizes) ? normalized.sizes[0] : normalized.size);
      } catch (error) {
        console.error('Failed to load product details:', error);
        toast.error('Failed to load product details');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      era: product.era,
      quantity: quantity
    };
    
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? 'Removed from wishlist'
        : 'Added to wishlist'
    );
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gray-700 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">Product not found</h2>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center text-gray-700 hover:text-black"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-700 hover:text-black">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/products" className="text-gray-700 hover:text-black">
              Products
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="relative">
            <ImageGallery
              images={product.images}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black font-mono">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-2xl font-bold text-black font-mono">
                  ${product.price.toFixed(2)}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-black rounded-full">
                  {product.era}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-black rounded-full">
                  {product.condition}
                </span>
              </div>
            </div>

            <p className="text-gray-700">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-black mb-2">
                Color
              </h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                      selectedColor === color
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-black">
                  Size
                </h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-gray-700 hover:text-black flex items-center gap-1"
                >
                  <Ruler className="h-4 w-4" />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'border-2 border-gray-300 text-black hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-sm font-medium text-black mb-2">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-lg border-2 border-gray-300 text-black hover:border-black transition-colors duration-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium text-black">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-lg border-2 border-gray-300 text-black hover:border-black transition-colors duration-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-black rounded-lg text-black hover:bg-black hover:text-white transition-colors duration-300"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-lg border-2 transition-colors duration-300 ${
                  isWishlisted
                    ? 'border-red-300 text-red-500 hover:bg-black hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-black hover:text-white'
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-current' : ''
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-black hover:text-white transition-colors duration-300"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-black">
                      Authenticity Guarantee
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">
                      Every vintage piece is carefully authenticated by our experts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Ruler className="h-5 w-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-black">
                      Measurements
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">
                      {product.measurements}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewSection productId={product.id} />
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <ProductRecommendations
            currentProductId={product.id}
            category={product.category}
          />
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;