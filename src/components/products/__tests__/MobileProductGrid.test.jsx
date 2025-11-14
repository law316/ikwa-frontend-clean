import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MobileProductGrid from '../MobileProductGrid';

// Mock the framer-motion components
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <span data-testid="heart-icon">Heart</span>,
  ShoppingCart: () => <span data-testid="shopping-cart-icon">ShoppingCart</span>,
}));

// Sample product data
const mockProducts = [
  {
    id: 1,
    name: 'Vintage T-Shirt 1',
    price: 29.99,
    image: '/images/product1.jpg',
    isNew: true,
    discount: 0,
  },
  {
    id: 2,
    name: 'Vintage T-Shirt 2',
    price: 39.99,
    image: '/images/product2.jpg',
    isNew: false,
    discount: 10,
  },
];

describe('MobileProductGrid', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the product grid with initial products', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if all products are rendered
    expect(screen.getByText('Vintage T-Shirt 1')).toBeInTheDocument();
    expect(screen.getByText('Vintage T-Shirt 2')).toBeInTheDocument();
  });

  it('displays product prices correctly', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if prices are rendered correctly
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
  });

  it('shows new badge for new products', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if new badge is shown for the first product
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('shows discount badge for discounted products', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if discount badge is shown for the second product
    expect(screen.getByText('-10%')).toBeInTheDocument();
  });

  it('renders product images with correct attributes', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if images are rendered with correct attributes
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/images/product1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Vintage T-Shirt 1');
    expect(images[1]).toHaveAttribute('src', '/images/product2.jpg');
    expect(images[1]).toHaveAttribute('alt', 'Vintage T-Shirt 2');
  });

  it('loads more products when scrolling to bottom', async () => {
    const moreProducts = [
      ...mockProducts,
      {
        id: 3,
        name: 'Vintage T-Shirt 3',
        price: 49.99,
        image: '/images/product3.jpg',
        isNew: false,
        discount: 0,
      },
    ];

    render(<MobileProductGrid products={moreProducts} />);
    
    // Simulate scroll to bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    
    // Wait for the loading indicator to appear
    await waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
    
    // Wait for the new product to be loaded
    await waitFor(() => {
      expect(screen.getByText('Vintage T-Shirt 3')).toBeInTheDocument();
    });
  });

  it('shows loading indicator while fetching more products', async () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Simulate scroll to bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    
    // Check if loading indicator is shown
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('handles wishlist button click', () => {
    const onWishlistClick = jest.fn();
    render(<MobileProductGrid products={mockProducts} onWishlistClick={onWishlistClick} />);
    
    // Click the wishlist button for the first product
    fireEvent.click(screen.getAllByTestId('heart-icon')[0]);
    
    // Check if the callback was called with the correct product
    expect(onWishlistClick).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('handles add to cart button click', () => {
    const onAddToCart = jest.fn();
    render(<MobileProductGrid products={mockProducts} onAddToCart={onAddToCart} />);
    
    // Click the add to cart button for the first product
    fireEvent.click(screen.getAllByTestId('shopping-cart-icon')[0]);
    
    // Check if the callback was called with the correct product
    expect(onAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('applies the correct styles to product cards', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if product cards have the correct classes
    const productCards = screen.getAllByTestId('product-card');
    productCards.forEach(card => {
      expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');
    });
  });

  it('applies the correct styles to product images', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if product images have the correct classes
    const images = screen.getAllByRole('img');
    images.forEach(image => {
      expect(image).toHaveClass('w-full', 'h-48', 'object-cover');
    });
  });

  it('applies the correct styles to product names', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if product names have the correct classes
    const productNames = screen.getAllByTestId('product-name');
    productNames.forEach(name => {
      expect(name).toHaveClass('text-lg', 'font-semibold', 'text-gray-800');
    });
  });

  it('applies the correct styles to product prices', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if product prices have the correct classes
    const prices = screen.getAllByTestId('product-price');
    prices.forEach(price => {
      expect(price).toHaveClass('text-amber-600', 'font-bold');
    });
  });

  it('applies the correct styles to action buttons', () => {
    render(<MobileProductGrid products={mockProducts} />);
    
    // Check if action buttons have the correct classes
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('p-2', 'rounded-full', 'hover:bg-gray-100');
    });
  });
}); 