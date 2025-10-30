import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "../../app/(auth)/forgot-password/page";

jest.mock("../../components/auth/RouteGuards", () => ({
  PublicRoute: ({ children }) => <div data-testid="public-route">{children}</div>,
}));

jest.mock("../../services/api", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ForgotPassword Page", () => {
  const { fetchAPI } = require("../../services/api");
  const { useRouter } = require("next/navigation");

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    fetchAPI.mockResolvedValue({});
  });

  describe("Rendering", () => {
    test("renders ForgotPassword component", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByTestId("public-route")).toBeInTheDocument();
      });

      expect(screen.getByText(/Forgot your password?/i)).toBeInTheDocument();
    });
    test("displays main heading and description", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByTestId("public-route")).toBeInTheDocument();
      });

      expect(screen.getByText(/🔒Forgot your password?/i)).toBeInTheDocument();
      expect(
        screen.getByText(/No problem! Just enter your email address/i)
      ).toBeInTheDocument();
    });
    test("renders email input field", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("placeholder", "Enter email address");
    });
    test("renders submit button", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /SUBMIT/i })).toBeInTheDocument();
      });
    });
  })

});
