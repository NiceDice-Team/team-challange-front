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

  describe("Form Validation", () => {
    test("shows validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: /SUBMIT/i });

      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
      });
    });
    test("allows valid email submission", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });
  })

  describe("Form Submission", () => {
    test("submits form with valid email", async () => {
      const user = userEvent.setup();
      fetchAPI.mockResolvedValue({ success: true });

      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: /SUBMIT/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(fetchAPI).toHaveBeenCalledWith("users/forgot-password/", {
          method: "POST",
          body: {
            email: "test@example.com",
          },
        });
      });
    });
    test("redirects to success page after successful submission", async () => {
      const user = userEvent.setup();
      fetchAPI.mockResolvedValue({ success: true });

      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: /SUBMIT/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/forgot-password/success");
      });
    });
    test("shows error message on API failure", async () => {
      const user = userEvent.setup();
      fetchAPI.mockRejectedValue(new Error("API Error"));

      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: /SUBMIT/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Error sending reset email. Try again.")
        ).toBeInTheDocument();
      });
    });
    test("disables submit button during submission", async () => {
      const user = userEvent.setup();
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      fetchAPI.mockReturnValue(promise);

      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: /SUBMIT/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolvePromise({});
    });
  })

  describe("Form Interactions", () => {
    test("updates email input value when typing", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText("Email");

      await user.type(emailInput, "user@example.com");

      expect(emailInput).toHaveValue("user@example.com");
    });
  })

});
