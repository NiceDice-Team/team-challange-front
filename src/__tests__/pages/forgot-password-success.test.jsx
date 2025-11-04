import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPasswordPage from '../../app/(auth)/forgot-password/success/page';

// Mock the Toast component
jest.mock('../../components/shared/Toast', () => ({
  showCustomToast: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

const { showCustomToast } = require('../../components/shared/Toast');

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the forgot password success page correctly', () => {
    render(<ForgotPasswordPage />);
    
    // Check main heading
    expect(screen.getByText('✉️ Check Your Inbox')).toBeInTheDocument();
    
    // Check instruction text
    expect(screen.getByText(/If the email address you entered is associated with an account/)).toBeInTheDocument();
    expect(screen.getByText(/Check the message for 5-10 minutes/)).toBeInTheDocument();
    
    // Check resend link
    expect(screen.getByText('Resend')).toBeInTheDocument();
    expect(screen.getByText('Resend').closest('a')).toHaveAttribute('href', '/forgot-password');
    
    // Check continue shopping link
    expect(screen.getByText('Continue shopping')).toBeInTheDocument();
    expect(screen.getByText('Continue shopping').closest('a')).toHaveAttribute('href', '/catalog');
  });

  test('shows success toast on component mount', () => {
    render(<ForgotPasswordPage />);
    
    // Wait for useEffect to run
    expect(showCustomToast).toHaveBeenCalledWith({
      type: "success",
      title: "Email Sent Successfully!",
      description: "A password reset link has been sent to your inbox.",
    });
  });

  test('has correct styling classes', () => {
    render(<ForgotPasswordPage />);
    
    const container = screen.getByText('✉️ Check Your Inbox').closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'mx-auto');
  });

  test('includes accessibility attributes', () => {
    render(<ForgotPasswordPage />);
    
    const arrowImage = screen.getByAltText('arrow');
    expect(arrowImage).toBeInTheDocument();
  });
});