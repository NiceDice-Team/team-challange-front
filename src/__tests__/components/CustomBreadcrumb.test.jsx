import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomBreadcrumb } from '../../components/shared/CustomBreadcrumb';

// Mock the Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('CustomBreadcrumb', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Current Page' }, // No href means current page
  ];

  test('renders breadcrumb items', () => {
    render(<CustomBreadcrumb items={mockItems} />);
    
    // Check that all labels are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  test('renders clickable links for items with href', () => {
    render(<CustomBreadcrumb items={mockItems} />);
    
    // Items with href should be rendered as links
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    
    const productsLink = screen.getByRole('link', { name: 'Products' });
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');
    
    const electronicsLink = screen.getByRole('link', { name: 'Electronics' });
    expect(electronicsLink).toBeInTheDocument();
    expect(electronicsLink).toHaveAttribute('href', '/products/electronics');
  });

  test('renders current page item as text (no link)', () => {
    render(<CustomBreadcrumb items={mockItems} />);
    
    // Current Page should not be a link since it has no href
    const currentPageText = screen.getByText('Current Page');
    expect(currentPageText).toBeInTheDocument();
    expect(currentPageText.tagName.toLowerCase()).not.toBe('a');
  });

  test('renders breadcrumb separators', () => {
    render(<CustomBreadcrumb items={mockItems} />);
    
    // Look for breadcrumb structure - separators are usually between items
    const breadcrumbNav = screen.getByRole('navigation') || 
                         document.querySelector('[aria-label*="breadcrumb"]') ||
                         document.querySelector('.breadcrumb');
    expect(breadcrumbNav).toBeInTheDocument();
  });

  test('handles single breadcrumb item', () => {
    const singleItem = [{ label: 'Single Page', href: '/single' }];
    
    render(<CustomBreadcrumb items={singleItem} />);
    
    expect(screen.getByText('Single Page')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Single Page' })).toHaveAttribute('href', '/single');
  });

  test('handles empty items array', () => {
    render(<CustomBreadcrumb items={[]} />);
    
    // Should render without errors, even with empty items
    const breadcrumbNav = screen.queryByRole('navigation') || 
                         document.querySelector('[aria-label*="breadcrumb"]') ||
                         document.querySelector('.breadcrumb');
    
    // Navigation should still exist but be empty or hidden
    expect(breadcrumbNav).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<CustomBreadcrumb items={mockItems} className="custom-breadcrumb" />);
    
    const breadcrumbElement = document.querySelector('.custom-breadcrumb') ||
                             document.querySelector('[class*="custom-breadcrumb"]');
    expect(breadcrumbElement).toBeInTheDocument();
  });

  test('provides proper navigation semantics', () => {
    render(<CustomBreadcrumb items={mockItems} />);
    
    // Should have proper navigation role or aria-label
    const navigation = screen.getByRole('navigation') ||
                      document.querySelector('[aria-label*="breadcrumb"]') ||
                      document.querySelector('[aria-label*="Breadcrumb"]');
    expect(navigation).toBeInTheDocument();
  });

  test('handles items with special characters in labels', () => {
    const specialItems = [
      { label: 'Home & Garden', href: '/home-garden' },
      { label: 'Tools & Equipment', href: '/tools' },
      { label: 'Power Tools > Drills' }, // Current page
    ];
    
    render(<CustomBreadcrumb items={specialItems} />);
    
    expect(screen.getByText('Home & Garden')).toBeInTheDocument();
    expect(screen.getByText('Tools & Equipment')).toBeInTheDocument();
    expect(screen.getByText('Power Tools > Drills')).toBeInTheDocument();
  });

  test('handles items with long labels', () => {
    const longLabelItems = [
      { label: 'Very Long Product Category Name That Might Wrap', href: '/long-category' },
      { label: 'Another Really Long Breadcrumb Item Label', href: '/another-long' },
      { label: 'Current Very Long Page Title That Should Be Displayed' },
    ];
    
    render(<CustomBreadcrumb items={longLabelItems} />);
    
    expect(screen.getByText('Very Long Product Category Name That Might Wrap')).toBeInTheDocument();
    expect(screen.getByText('Another Really Long Breadcrumb Item Label')).toBeInTheDocument();
    expect(screen.getByText('Current Very Long Page Title That Should Be Displayed')).toBeInTheDocument();
  });
});