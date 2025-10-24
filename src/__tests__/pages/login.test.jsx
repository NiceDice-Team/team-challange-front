
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

    test("shows password validation error for short password", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText("password");
      
      await user.type(passwordInput, "123");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
      });
    });

    test("shows password validation error for password without letters and numbers", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText("password");
      
      await user.type(passwordInput, "12345678");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText("Contain at least one letter and one number.")).toBeInTheDocument();
      });
    });

    test("clears validation errors when valid input is entered", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const emailInput = screen.getByLabelText("Email");
      
      await user.type(emailInput, "invalid-email");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
      });
      
      await user.clear(emailInput);
      await user.type(emailInput, "test@example.com");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
      });
    });
  });
  
  describe("Form Interactions", () => {
    test("updates input values when typing", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("password");
      
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      
      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("password123");
    });

    test("submits form with valid data", async () => {
      const user = userEvent.setup();
      const mockSignin = require("../../app/actions/auth").signin;
      mockSignin.mockResolvedValue({ refreshToken: "test-token", errors: {} });
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "SIGN IN" });
      
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      
      await user.click(submitButton);
      
      expect(mockSignin).toHaveBeenCalled();
    });

    test("submit button is initially enabled", () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByRole("button", { name: "SIGN IN" });
      expect(submitButton).not.toBeDisabled();
    });
  })

  describe("Navigation and Links", () => {
    test("forgot password link navigates to correct page", () => {
      render(<LoginPage />);
      
      const forgotPasswordLink = screen.getByText("Forgot your password?");
      expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
    });

    test("redirects to home page after successful login", async () => {
      getTokens.mockReturnValue({
        refreshToken: "test-token",
      });
      
      render(<LoginPage />);
      
      await waitFor(() => {
        expect(showCustomToast).toHaveBeenCalledWith({
          type: "success",
          title: "Success! You are logged in.",
          description: "You can now continue your adventure",
        });
      });
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      }, { timeout: 2000 });
    });
  });

  describe("Error Handling", () => {
    test("displays server error message", async () => {
      const user = userEvent.setup();
      const mockSignin = require("../../app/actions/auth").signin;
      mockSignin.mockResolvedValue({
        errors: { serverError: "Invalid credentials" },
      });
      
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("password");
      const submitButton = screen.getByRole("button", { name: "SIGN IN" });
      
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

      test("displays field error messages", async () => {
      const user = userEvent.setup();
      const mockSignin = require("../../app/actions/auth").signin;
      mockSignin.mockResolvedValue({
        errors: { 
          email: "Email is required",
          password: "Password is required" 
        },
      });
      
      render(<LoginPage />);
      
      const submitButton = screen.getByRole("button", { name: "SIGN IN" });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });
    });

  })

   describe("URL Parameters Handling", () => {
    test("shows success toast for successful activation", async () => {
      mockSearchParams.set("message", "activation");
      mockSearchParams.set("activation_status", "success");
      
      render(<LoginPage />);
      
      await waitFor(() => {
        expect(showCustomToast).toHaveBeenCalledWith({
          type: "success",
          title: "Success! You are logged in.",
        });
      });
    });
   })

});