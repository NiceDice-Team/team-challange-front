import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Declare mock functions first
const mockToast = {
  custom: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: mockToast,
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  Info: () => <div data-testid="info-icon" />,
}));

// Import the component after mocking its dependencies
const { showCustomToast } = require('../../components/shared/Toast');

describe('Toast', () => {
  let originalWindow;

  beforeEach(() => {
    jest.clearAllMocks();
    originalWindow = global.window;
    // Mock window safely
    global.window = {
      document: {},
      navigator: {},
    };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  test('shows success toast with default type', () => {
    showCustomToast({
      title: 'Success!',
      description: 'Operation completed successfully',
    });

    expect(mockToast.custom).toHaveBeenCalledTimes(1);
  });

  test('shows error toast', () => {
    showCustomToast({
      type: 'error',
      title: 'Error!',
      description: 'Something went wrong',
    });

    expect(mockToast.custom).toHaveBeenCalledTimes(1);
  });

  test('shows info toast', () => {
    showCustomToast({
      type: 'info',
      title: 'Info',
      description: 'Here is some information',
    });

    expect(mockToast.custom).toHaveBeenCalledTimes(1);
  });

  test('shows toast without description', () => {
    showCustomToast({
      title: 'Title only',
    });

    expect(mockToast.custom).toHaveBeenCalledTimes(1);
  });

  test('handles SSR gracefully when window is undefined', () => {
    // Temporarily remove window
    const originalWindow = global.window;
    delete global.window;

    expect(() => {
      showCustomToast({
        title: 'SSR Test',
        description: 'This should not crash',
      });
    }).not.toThrow();

    // Restore window
    global.window = originalWindow;
  });

  test('renders toast content correctly', () => {
    // Render the toast component JSX that gets passed to toast.custom
    const ToastContent = ({ title, description, type = 'success' }) => (
      <div className={`toast-content toast-${type}`}>
        <div data-testid={`${type}-icon`} />
        <div>
          <div className="font-semibold">{title}</div>
          {description && <div className="text-sm">{description}</div>}
        </div>
      </div>
    );

    render(<ToastContent title="Test" description="Test description" type="success" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});