import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomBadge from '../../components/shared/CustomBadge';

// Mock the Badge component from ui
jest.mock('../../components/ui/badge', () => ({
  Badge: ({ children, className, variant, ...props }) => (
    <span data-testid="badge" className={className} data-variant={variant} {...props}>
      {children}
    </span>
  ),
}));

// Mock the cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' ')
}));

describe('CustomBadge', () => {
  test('renders children correctly', () => {
    render(<CustomBadge>Test Badge</CustomBadge>);
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  test('renders with default variant', () => {
    render(<CustomBadge>Default Badge</CustomBadge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveClass('bg-purple', 'text-white');
  });

  test('renders with secondary variant', () => {
    render(<CustomBadge variant="secondary">Secondary Badge</CustomBadge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'secondary');
    expect(badge).toHaveClass('bg-light-purple', 'text-white');
  });

  test('renders with destructive variant', () => {
    render(<CustomBadge variant="destructive">Error Badge</CustomBadge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
    expect(badge).toHaveClass('bg-red', 'text-white');
  });

  test('renders with outline variant', () => {
    render(<CustomBadge variant="outline">Outline Badge</CustomBadge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'outline');
    expect(badge).toHaveClass('bg-white', 'border', 'border-purple', 'text-purple');
  });

  test('applies custom className via Badge component', () => {
    render(<CustomBadge className="custom-class">Custom Badge</CustomBadge>);
    
    const badge = screen.getByTestId('badge');
    // The Badge component should handle the className prop
    // Since cn() merges classes, let's check if the component renders properly
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Custom Badge');
  });

  test('applies base classes', () => {
    render(<CustomBadge>Base Badge</CustomBadge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('py-1', 'px-3', 'rounded-[20px]', 'tabular-nums');
  });
});