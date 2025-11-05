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
  })

});
