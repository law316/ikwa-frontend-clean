import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import QuickViewModal from '../components/products/QuickViewModal';
import useDebounce from '../hooks/useDebounce';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/forms/Select';
import Badge from '../components/ui/Badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/Sheet';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';



const ProductCatalogPage = () => {
  // Default to list view on mobile, grid on desktop
  const [viewMode, setViewMode] = useState(() => {
    return window.innerWidth < 768 ? 'list' : 'grid';
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [sortBy, setSortBy] = useState('price_asc');

  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const loc = useLocation();
  const [filters, setFilters] = useState({
    sizes: null,
    colors: null,
    priceRange: null,
    eras: null,
    styles: null,
    conditions: null
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load products from API
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [offlineFallback, setOfflineFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const offlineHandler = () => setOfflineFallback(true);
    window.addEventListener('likwapu:offline-fallback', offlineHandler);
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        // getProducts already returns normalized products array
        const normalized = await productService.getProducts();
        if (isMounted) {
          setAllProducts(Array.isArray(normalized) ? normalized : []);
          try {
            const buf = Array.isArray(window.__LIK_MONITOR_BUFFER) ? window.__LIK_MONITOR_BUFFER : [];
            const sawFallback = buf.some(e => e && e.event === 'productService.getProducts fallback to mockProducts');
            if (sawFallback) setOfflineFallback(true);
          } catch (_) {}
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };
    loadProducts();
    return () => { 
      isMounted = false; 
      window.removeEventListener('likwapu:offline-fallback', offlineHandler);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__LIK_OFFLINE_PRODUCTS__) {
      setOfflineFallback(true);
    }
    // Heuristic: if no products loaded and no filters/search applied after load, treat as offline fallback
    const noFilters = Object.values(filters).every(v => v === null);
    if (!loadingProducts && allProducts.length === 0 && noFilters && !debouncedSearchQuery) {
      setOfflineFallback(true);
    }
  }, [allProducts, loadingProducts, filters, debouncedSearchQuery]);



  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== null).length;
  }, [filters]);

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const active = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null) {
        active[key] = [value]; // Convert to array for display compatibility
      }
    });
    return active;
  }, [filters]);

  // Remove individual filter
  const removeFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: null
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      eras: null,
      conditions: null,
      sizes: null,
      colors: null,
      priceRange: null,
      styles: null,
    });
  };



  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply search
    if (debouncedSearchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Apply filters - single selection
    if (filters.sizes) {
      result = result.filter(product =>
        product.size === filters.sizes
      );
    }
    if (filters.colors) {
      result = result.filter(product =>
        product.color === filters.colors
      );
    }
    if (filters.eras) {
      result = result.filter(product =>
        product.decade === filters.eras
      );
    }
    if (filters.styles) {
      result = result.filter(product =>
        product.style === filters.styles
      );
    }
    if (filters.conditions) {
      result = result.filter(product =>
        product.condition === filters.conditions
      );
    }
    if (filters.priceRange) {
      result = result.filter(product => {
        const price = product.price;
        switch (filters.priceRange) {
          case 'Under $25':
            return price < 25;
          case '$25 - $50':
            return price >= 25 && price <= 50;
          case '$50 - $100':
            return price >= 50 && price <= 100;
          case '$100 - $200':
            return price >= 100 && price <= 200;
          case 'Over $200':
            return price > 200;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'era_asc':
        result.sort((a, b) => a.eraYear - b.eraYear);
        break;
      case 'era_desc':
        result.sort((a, b) => b.eraYear - a.eraYear);
        break;
      default:
        result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [debouncedSearchQuery, filters, sortBy, allProducts]);

  const products = filteredProducts;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = async (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: Array.isArray(product.sizes) ? product.sizes[0] : product.size || 'M',
      color: product.color || 'Default',
      era: product.era,
      quantity: 1
    };
    if (!isAuthenticated) {
      try { localStorage.setItem('pendingCartItem', JSON.stringify(cartItem)); } catch {}
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { returnTo: loc.pathname } });
      return;
    }
    try {
      await addToCart(cartItem);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Cart error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Filter Header */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search products, styles, eras..."
                  className="pl-10 pr-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4 ml-4">
              {/* View Mode Toggle - Desktop */}
              <div className="hidden md:flex border-2 border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-600 text-white' : 'bg-white text-black hover:bg-gray-100'} transition-colors duration-300`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'bg-white text-black hover:bg-gray-100'} transition-colors duration-300`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                  <SelectItem value="era_asc">Era (Oldest First)</SelectItem>
                  <SelectItem value="era_desc">Era (Newest First)</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter & Sort
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              
              {/* Desktop Filter Toggle */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(activeFilters).map(([key, values]) =>
                values.map(value => (
                  <Badge
                    key={`${key}-${value}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {value}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFilter(key, value)}
                    />
                  </Badge>
                ))
              )}
              <Button
                variant="link"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content with Proper Layout */}
      <div className="container mx-auto px-4 py-6">
        {offlineFallback && (
          <div id="offline-banner" className="mb-4 rounded-md border-2 border-yellow-300 bg-yellow-50 text-yellow-800 px-4 py-3" role="alert">
            Showing offline products. Some features may be unavailable.
          </div>
        )}
        <div className="flex">
          {/* Desktop Sidebar */}
          {showFilters && (
            <aside className="hidden lg:block w-80 ml-4 md:ml-8 lg:ml-12 xl:ml-16 transition-all duration-300 flex-shrink-0">
              <FilterSidebar
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearAllFilters}
              />
            </aside>
          )}

          {/* Product Grid */}
          <main className={`flex-1 min-w-0 ${showFilters ? 'pl-6 lg:pl-8' : ''}`}>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {products.length} of {allProducts.length} products
              </p>
            </div>

            {/* View Mode Toggle - Mobile */}
            <div className="md:hidden mb-4 flex justify-end">
              <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-600 text-white' : 'bg-white text-black hover:bg-gray-100'} transition-colors duration-300`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'bg-white text-black hover:bg-gray-100'} transition-colors duration-300`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {loadingProducts ? (
              <div className="w-full flex justify-center items-center py-16">
                <svg className="animate-spin h-8 w-8 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button
                  onClick={clearAllFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onQuickView={() => handleQuickView(product)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Items per page:</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                          <SelectItem value="96">96</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <span className="px-4 py-2 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="left" className="w-full sm:w-80 p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filter & Sort</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
            />
          </div>
        </SheetContent>
      </Sheet>

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

export default ProductCatalogPage;