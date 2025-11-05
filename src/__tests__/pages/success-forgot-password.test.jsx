import React from 'react';import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';import { render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';import '@testing-library/jest-dom';

import ForgotPasswordPage from '../../app/(auth)/forgot-password/success/page';import ForgotPasswordPage from '../../app/(auth)/forgot-password/success/page';



// Mock the Toast component// Mock the Toast component

jest.mock('../../components/shared/Toast', () => ({jest.mock('../../components/shared/Toast', () => ({

  showCustomToast: jest.fn(),  showCustomToast: jest.fn(),

}));}));



// Mock Next.js Image component// Mock Next.js Image component

jest.mock('next/image', () => {jest.mock('next/image', () => {

  return function MockImage({ src, alt, ...props }) {  return function MockImage({ src, alt, ...props }) {

    return <img src={src} alt={alt} {...props} />;    return <img src={src} alt={alt} {...props} />;

  };  };

});});



// Mock Next.js Link component// Mock Next.js Link component

jest.mock('next/link', () => {jest.mock('next/link', () => {

  return function MockLink({ href, children, ...props }) {  return function MockLink({ href, children, ...props }) {

    return <a href={href} {...props}>{children}</a>;    return <a href={href} {...props}>{children}</a>;

  };  };

});});



const { showCustomToast } = require('../../components/shared/Toast');const { showCustomToast } = require('../../components/shared/Toast');



describe('ForgotPassword Success Page', () => {describe('ForgotPassword Success Page', () => {

  beforeEach(() => {  beforeEach(() => {

    jest.clearAllMocks();    jest.clearAllMocks();

  });  });



  afterEach(() => {  afterEach(() => {

    jest.restoreAllMocks();    jest.restoreAllMocks();

  });  });



  test('calls showCustomToast on mount', async () => {  test('calls showCustomToast on mount', async () => {

    render(<ForgotPasswordPage />);    render(<ForgotPasswordPage />);

        

    await waitFor(() => {    await waitFor(() => {

      expect(showCustomToast).toHaveBeenCalledWith({      expect(showCustomToast).toHaveBeenCalledWith({

        type: 'success',        type: 'success',

        title: 'Email Sent Successfully!',        title: 'Email Sent Successfully!',

        description: 'A password reset link has been sent to your inbox.',        description: 'A password reset link has been sent to your inbox.',

      });      });

    });    });

  });  });



  test('renders the forgot password success page correctly', () => {  test('renders the forgot password success page correctly', () => {

    render(<ForgotPasswordPage />);    render(<ForgotPasswordPage />);

        

    // Check main heading    // Check main heading

    expect(screen.getByText('✉️ Check Your Inbox')).toBeInTheDocument();    expect(screen.getByText('✉️ Check Your Inbox')).toBeInTheDocument();

        

    // Check instruction text    // Check instruction text

    expect(screen.getByText(/If the email address you entered is associated with an account/)).toBeInTheDocument();    expect(screen.getByText(/If the email address you entered is associated with an account/)).toBeInTheDocument();

    expect(screen.getByText(/Check the message for 5-10 minutes/)).toBeInTheDocument();    expect(screen.getByText(/Check the message for 5-10 minutes/)).toBeInTheDocument();

        

    // Check resend link    // Check resend link

    expect(screen.getByText('Resend')).toBeInTheDocument();    expect(screen.getByText('Resend')).toBeInTheDocument();

    expect(screen.getByText('Resend').closest('a')).toHaveAttribute('href', '/forgot-password');    expect(screen.getByText('Resend').closest('a')).toHaveAttribute('href', '/forgot-password');

        

    // Check continue shopping link    // Check continue shopping link

    expect(screen.getByText('Continue shopping')).toBeInTheDocument();    expect(screen.getByText('Continue shopping')).toBeInTheDocument();

    expect(screen.getByText('Continue shopping').closest('a')).toHaveAttribute('href', '/catalog');    expect(screen.getByText('Continue shopping').closest('a')).toHaveAttribute('href', '/catalog');

  });  });

});});