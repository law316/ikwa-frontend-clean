import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';
import QuickViewModal from '../components/products/QuickViewModal';
import { productService, normalizeProducts } from '../services/api';

const HomePage = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Prepare hero slides before effects so dependencies can reference length safely
  const heroImageIndices = Array.from({ length: 19 }, (_, i) => i + 11);
  const heroSlides = heroImageIndices.map((num) => {
    const imagePath = `/IMG-20251024-WA${String(num).padStart(4, '0')}.jpg`;
    return {
      image: imagePath,
      title: 'Lace and Legacy',
      description: 'Discover authentic vintage fashion'
    };
  });

  // Typewriter effect for hero section
  useEffect(() => {
    const texts = [
      "Discover Vintage Treasures",
      "Timeless Style, Modern Comfort",
      "Curated Collections from Every Era"
    ];
    let i = 0;
    let j = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      const currentText = texts[i];
      if (isDeleting) {
        setTypewriterText(currentText.slice(0, j - 1));
        j--;
      } else {
        setTypewriterText(currentText.slice(0, j + 1));
        j++;
      }

      if (!isDeleting && j === currentText.length) {
        isDeleting = true;
        timer = setTimeout(type, 2000);
      } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % texts.length;
        timer = setTimeout(type, 500);
      } else {
        timer = setTimeout(type, isDeleting ? 50 : 100);
      }
    };

    timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch latest products for the home page
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await productService.getProducts();
        // Some APIs return `{ products: [...] }`; handle both array and object shapes
        const items = Array.isArray(res) ? res : res?.products || [];
        setProducts(normalizeProducts(items));
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error('Failed to load latest products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  

  const categories = [
    { name: "Band Tees", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", decade: "70s" },
    { name: "Sports Classics", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", decade: "80s" },
    { name: "Surf & Skate", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", decade: "80s" },
    { name: "Movie Classics", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", decade: "70s" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover filter sepia-[0.2]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-black">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 font-mono tracking-wider">
                  {typewriterText}
                </h1>
                <p className="text-xl md:text-2xl mb-8 font-mono">
                  {slide.description}
                </p>
                <div className="space-x-4">
                  <Link
                    to="/catalog"
                    className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Product Categories Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-12 text-center font-mono">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/catalog?category=${category.name}`}
                className="group relative overflow-hidden rounded-xl border-4 border-black"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full aspect-square object-cover filter sepia-[0.1] group-hover:sepia-[0.3] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <span className="text-gray-300 text-sm font-mono mb-2">
                    {category.decade}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-white">
                    <span className="text-sm font-mono">Explore Collection</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Throwback Finds Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-12 text-center font-mono">
              Latest Throwback Finds
            </h2>
          {loadingProducts ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 text-gray-700 animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  onQuickView={() => setSelectedProduct(product)}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/payment" className="inline-block">
                <span className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300">
                  Proceed to Checkout
                </span>
              </Link>
            </div>
            </>
          ) : (
            <div className="text-center text-gray-700 py-10">
              No products available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-black font-mono">
                Our Vintage Journey
              </h2>
              <div className="space-y-6">
                <div className="relative pl-8 border-l-4 border-black">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-black rounded-full" />
                  <h3 className="text-2xl font-bold text-black mb-2">2018</h3>
                  <p className="text-gray-700">
                    Started as a small vintage shop in downtown, curating the finest collection of retro tees.
                </p>
              </div>
                <div className="relative pl-8 border-l-4 border-black">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-black rounded-full" />
                  <h3 className="text-2xl font-bold text-black mb-2">2020</h3>
                  <p className="text-gray-700">
                    Expanded our collection to include rare finds from the 50s to the 90s.
                </p>
              </div>
                <div className="relative pl-8 border-l-4 border-black">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-black rounded-full" />
                  <h3 className="text-2xl font-bold text-black mb-2">2023</h3>
                  <p className="text-gray-700">
                    Launched our online store, bringing vintage fashion to enthusiasts worldwide.
                </p>
              </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                alt="Vintage Collection"
                className="rounded-lg filter sepia-[0.2]"
              />
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                alt="Store Front"
                className="rounded-lg filter sepia-[0.2] mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4 font-mono">
            Join Our Vintage Community
          </h2>
          <p className="text-gray-700 mb-8 font-mono">
            Subscribe to get exclusive access to new arrivals and special offers
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors duration-300 font-mono bg-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
