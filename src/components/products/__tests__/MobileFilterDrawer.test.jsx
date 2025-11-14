import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileFilterDrawer from '../MobileFilterDrawer';

// Mock the framer-motion components
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="close-icon">Close</span>,
  Sliders: () => <span data-testid="sliders-icon">Sliders</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">ChevronDown</span>,
  ChevronUp: () => <span data-testid="chevron-up-icon">ChevronUp</span>,
  AlertTriangle: () => <span data-testid="alert-triangle-icon">AlertTriangle</span>,
}));

describe('MobileFilterDrawer', () => {
  const mockFilters = {
    priceRange: [0, 100],
    categories: [],
    eras: [],
    sizes: [],
    colors: [],
  };

  const mockOnApply = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the filter drawer when isOpen is true', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if the drawer is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render the filter drawer when isOpen is false', () => {
    render(
      <MobileFilterDrawer
        isOpen={false}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if the drawer is not rendered
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the close button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onApply with updated filters when apply button is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the current filters
    expect(mockOnApply).toHaveBeenCalledWith(mockFilters);
  });

  it('toggles section expansion when section header is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the first section header
    fireEvent.click(screen.getByText(/price range/i));
    
    // Check if the section content is visible
    expect(screen.getByTestId('price-range-content')).toBeInTheDocument();
    
    // Click the section header again
    fireEvent.click(screen.getByText(/price range/i));
    
    // Check if the section content is hidden
    expect(screen.queryByTestId('price-range-content')).not.toBeInTheDocument();
  });

  it('updates price range when sliders are moved', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Get the price range inputs
    const minInput = screen.getByLabelText(/min price/i);
    const maxInput = screen.getByLabelText(/max price/i);
    
    // Update the price range
    fireEvent.change(minInput, { target: { value: '20' } });
    fireEvent.change(maxInput, { target: { value: '80' } });
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the updated price range
    expect(mockOnApply).toHaveBeenCalledWith({
      ...mockFilters,
      priceRange: [20, 80],
    });
  });

  it('toggles category selection when checkbox is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the first category checkbox
    fireEvent.click(screen.getByLabelText(/t-shirts/i));
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the updated categories
    expect(mockOnApply).toHaveBeenCalledWith({
      ...mockFilters,
      categories: ['t-shirts'],
    });
  });

  it('toggles era selection when checkbox is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the first era checkbox
    fireEvent.click(screen.getByLabelText(/70s/i));
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the updated eras
    expect(mockOnApply).toHaveBeenCalledWith({
      ...mockFilters,
      eras: ['70s'],
    });
  });

  it('toggles size selection when checkbox is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the first size checkbox
    fireEvent.click(screen.getByLabelText(/small/i));
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the updated sizes
    expect(mockOnApply).toHaveBeenCalledWith({
      ...mockFilters,
      sizes: ['small'],
    });
  });

  it('toggles color selection when color button is clicked', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the first color button
    fireEvent.click(screen.getByLabelText(/red/i));
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the updated colors
    expect(mockOnApply).toHaveBeenCalledWith({
      ...mockFilters,
      colors: ['red'],
    });
  });

  it('resets all filters when reset button is clicked', () => {
    const initialFilters = {
      priceRange: [20, 80],
      categories: ['t-shirts'],
      eras: ['70s'],
      sizes: ['small'],
      colors: ['red'],
    };

    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={initialFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Click the reset button
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    
    // Click the apply button
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));
    
    // Check if onApply was called with the reset filters
    expect(mockOnApply).toHaveBeenCalledWith(mockFilters);
  });

  it('applies the correct styles to the drawer', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if the drawer has the correct classes
    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveClass('fixed', 'inset-x-0', 'bottom-0', 'z-40');
  });

  it('applies the correct styles to section headers', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if section headers have the correct classes
    const headers = screen.getAllByRole('button', { name: /price range|categories|eras|sizes|colors/i });
    headers.forEach(header => {
      expect(header).toHaveClass('flex', 'items-center', 'justify-between', 'w-full', 'px-4', 'py-3');
    });
  });

  it('applies the correct styles to checkboxes', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if checkboxes have the correct classes
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveClass('w-4', 'h-4', 'text-amber-600');
    });
  });

  it('applies the correct styles to color buttons', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if color buttons have the correct classes
    const colorButtons = screen.getAllByRole('button', { name: /red|blue|green|yellow|black|white/i });
    colorButtons.forEach(button => {
      expect(button).toHaveClass('w-8', 'h-8', 'rounded-full', 'border-2', 'border-gray-200');
    });
  });

  it('applies the correct styles to action buttons', () => {
    render(
      <MobileFilterDrawer
        isOpen={true}
        filters={mockFilters}
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );
    
    // Check if action buttons have the correct classes
    const buttons = screen.getAllByRole('button', { name: /apply filters|reset|close/i });
    buttons.forEach(button => {
      expect(button).toHaveClass('px-4', 'py-2', 'rounded-md', 'font-medium');
    });
  });
});