import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RollingDice from '../../utils/dice';

// Mock styled-jsx to prevent styled-jsx related issues in testing
jest.mock('styled-jsx/style', () => ({
  __esModule: true,
  default: () => null,
}));

describe('RollingDice Component', () => {
  const defaultProps = {
    value: 1,
    isRolling: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dice component with correct structure', () => {
    render(<RollingDice {...defaultProps} />);
    
    // Check if the main dice elements are rendered
    const diceWrapper = document.querySelector('.dice-wrapper');
    const diceContainer = document.querySelector('.dice-container');
    const diceCube = document.querySelector('.dice-cube');
    const diceFaces = document.querySelectorAll('.dice-face');
    
    expect(diceWrapper).toBeInTheDocument();
    expect(diceContainer).toBeInTheDocument();
    expect(diceCube).toBeInTheDocument();
    expect(diceFaces).toHaveLength(6); // 6 faces of a dice
  });

  test('renders dots for different dice values', () => {
    // Test various dice values
    [1, 2, 3, 4, 5, 6].forEach(value => {
      const { unmount } = render(<RollingDice {...defaultProps} value={value} />);
      
      // Check that dots are rendered (dots are styled divs with specific classes)
      const dots = document.querySelectorAll('.dice-face .absolute.bg-gray-900.rounded-full');
      expect(dots.length).toBeGreaterThan(0);
      
      unmount(); // Clean up for next iteration
    });
  });

  test('calls onClick when dice wrapper is clicked', () => {
    const mockOnClick = jest.fn();
    render(<RollingDice {...defaultProps} onClick={mockOnClick} />);
    
    const diceWrapper = document.querySelector('.dice-wrapper');
    fireEvent.click(diceWrapper);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('applies different transforms for different values', () => {
    const { rerender } = render(<RollingDice {...defaultProps} value={1} isRolling={false} />);
    
    const diceCube = document.querySelector('.dice-cube');
    const value1Transform = diceCube.style.transform;
    
    rerender(<RollingDice {...defaultProps} value={2} isRolling={false} />);
    const value2Transform = diceCube.style.transform;
    
    // Transforms should be different for different values
    expect(value2Transform).not.toBe(value1Transform);
  });

  test('applies rolling animation when isRolling is true', () => {
    const { rerender } = render(<RollingDice {...defaultProps} value={3} isRolling={false} />);
    
    const diceCube = document.querySelector('.dice-cube');
    const staticTransform = diceCube.style.transform;
    
    // Start rolling
    rerender(<RollingDice {...defaultProps} value={3} isRolling={true} />);
    const rollingTransform = diceCube.style.transform;
    
    // Transform should change when rolling
    expect(rollingTransform).not.toBe(staticTransform);
    expect(rollingTransform).toContain('scale(1)');
  });

  test('handles edge cases for dice values', () => {
    // Test with invalid values - component should still render
    render(<RollingDice {...defaultProps} value={0} />);
    expect(document.querySelector('.dice-wrapper')).toBeInTheDocument();
    
    const { rerender } = render(<RollingDice {...defaultProps} value={7} />);
    expect(document.querySelector('.dice-wrapper')).toBeInTheDocument();
    
    rerender(<RollingDice {...defaultProps} value={-1} />);
    expect(document.querySelector('.dice-wrapper')).toBeInTheDocument();
  });

  test('maintains state during rolling animation transitions', () => {
    const { rerender } = render(<RollingDice {...defaultProps} value={3} isRolling={false} />);
    
    // Check initial state
    expect(document.querySelector('.dice-cube')).toBeInTheDocument();
    
    // Start rolling
    rerender(<RollingDice {...defaultProps} value={3} isRolling={true} />);
    expect(document.querySelector('.dice-cube')).toBeInTheDocument();
    
    // Stop rolling with new value
    rerender(<RollingDice {...defaultProps} value={5} isRolling={false} />);
    expect(document.querySelector('.dice-cube')).toBeInTheDocument();
  });

  test('handles rapid value changes gracefully', () => {
    const { rerender } = render(<RollingDice {...defaultProps} value={1} />);
    
    // Rapidly change values
    [2, 3, 4, 5, 6, 1].forEach(value => {
      rerender(<RollingDice {...defaultProps} value={value} />);
      
      // Ensure structure is maintained
      const diceFaces = document.querySelectorAll('.dice-face');
      expect(diceFaces).toHaveLength(6);
    });
  });

  test('has correct CSS classes and cursor pointer', () => {
    render(<RollingDice {...defaultProps} />);
    
    const diceWrapper = document.querySelector('.dice-wrapper');
    const diceContainer = document.querySelector('.dice-container');
    
    expect(diceWrapper).toBeInTheDocument();
    expect(diceContainer).toHaveClass('cursor-pointer');
  });

  test('renders all 6 dice faces with correct transforms', () => {
    render(<RollingDice {...defaultProps} />);
    
    const diceFaces = document.querySelectorAll('.dice-face');
    expect(diceFaces).toHaveLength(6);
    
    // Check that each face has a transform style
    diceFaces.forEach(face => {
      expect(face.style.transform).toBeTruthy();
    });
  });
});