
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../app/(auth)/login/page";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokens } from "../../lib/tokenManager";
import { showCustomToast } from "../../components/shared/Toast";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock token manager
jest.mock("../../lib/tokenManager", () => ({
  getTokens: jest.fn(),
}));

// Mock toast
jest.mock("../../components/shared/Toast", () => ({
  showCustomToast: jest.fn(),
}));

// Mock auth actions
jest.mock("../../app/actions/auth", () => ({
  signin: jest.fn(),
}));

// Mock OAuth components
jest.mock("../../components/auth/GoogleLogin", () => ({
  GoogleAuthButton: () => <button data-testid="google-auth-button">Login with Google</button>,
}));

jest.mock("../../components/auth/FacebookLogin", () => ({
  FacebookAuthButton: () => <button data-testid="facebook-auth-button">Login with Facebook</button>,
}));

// Mock RouteGuards
jest.mock("../../components/auth/RouteGuards", () => ({
  PublicRoute: ({ children }) => <div data-testid="public-route">{children}</div>,
}));

describe("Login Page", () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useRouter.mockReturnValue({
      push: mockPush,
    });
    
    useSearchParams.mockReturnValue(mockSearchParams);
    
    getTokens.mockReturnValue({
      refreshToken: null,
    });
  });

  describe("Rendering", () => {
    test("renders login page with all main elements", () => {
      render(<LoginPage />);
      
      expect(screen.getByTestId("public-route")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    });

    test("renders OAuth buttons", () => {
      render(<LoginPage />);
      
      expect(screen.getByTestId("google-auth-button")).toBeInTheDocument();
      expect(screen.getByTestId("facebook-auth-button")).toBeInTheDocument();
    });

    test("renders form with correct structure", () => {
      render(<LoginPage />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "SIGN IN" });
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

  });

  describe("Form Validation", () => {
    test("shows email validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      
      await user.type(emailInput, "invalid-email");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
      });
    });
  })
});