import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "../../app/(auth)/reset-password/page";

jest.mock("../../services/api", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../../components/shared/Toast", () => ({
  showCustomToast: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("ResetPassword Page", () => {
  const { fetchAPI } = require("../../services/api");
  const { useRouter, useSearchParams } = require("next/navigation");
  const { showCustomToast } = require("../../components/shared/Toast");

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    const mockSearchParams = new URLSearchParams();
    useSearchParams.mockReturnValue(mockSearchParams);
    fetchAPI.mockResolvedValue({});
  });
  describe("Rendering", () => {
    test("renders ResetPassword component", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(
          screen.getByText(/🔐 Reset Your Password/i)
        ).toBeInTheDocument();
      });
    });
    test("displays main heading", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(
          screen.getByText(/🔐 Reset Your Password/i)
        ).toBeInTheDocument();
      });
    });
  })
    test("displays description text", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByText(/You've made it!/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Now enter a new password to continue your quest/i)
        ).toBeInTheDocument();
      });
    });
    test("renders password input field", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("placeholder", "Enter password");
    });
    test("renders confirm password input field", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      });

      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute(
        "placeholder",
        "Enter password"
      );
    });
    test("renders submit button", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /RESET/i })).toBeInTheDocument();
      });
    });
    test("renders sign in link", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
      });

      const signInLink = screen.getByText(/Sign in/i).closest("a");
      expect(signInLink).toHaveAttribute("href", "/login");
    });

});
