import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useClickOutside from '../../utils/useClickOutside';

// Test component to test the hook
function TestComponent() {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);
  
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside element
        <button onClick={() => setIsOpen(true)}>Open</button>
      </div>
      <div data-testid="outside">Outside element</div>
      <div data-testid="status">{isOpen ? 'Open' : 'Closed'}</div>
    </div>
  );
}

describe('useClickOutside hook', () => {
  test('calls callback when clicking outside', () => {
    render(<TestComponent />);
    
    // Initially closed
    expect(screen.getByTestId('status')).toHaveTextContent('Closed');
    
    // Open the component
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('status')).toHaveTextContent('Open');
    
    // Click outside to close
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.getByTestId('status')).toHaveTextContent('Closed');
  });

  test('does not call callback when clicking inside', () => {
    render(<TestComponent />);
    
    // Open the component
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('status')).toHaveTextContent('Open');
    
    // Click inside - should stay open
    fireEvent.mouseDown(screen.getByTestId('inside'));
    expect(screen.getByTestId('status')).toHaveTextContent('Open');
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<TestComponent />);
    
    // Should not throw error when unmounting
    expect(() => unmount()).not.toThrow();
  });
});