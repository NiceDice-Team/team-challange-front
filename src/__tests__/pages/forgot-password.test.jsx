import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import path from "path";
import fs from "fs";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

const forgotPassCopy =
  JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "public/locales/en/common.json"), "utf8"),
  )["forgot-pass"];

const headingMatcher = new RegExp(
  forgotPassCopy.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  "i",
);
const submitButtonQuery = { name: new RegExp(forgotPassCopy.submit, "i") };

jest.mock("@/components/auth/RouteGuards", () => ({
  PublicRoute: ({ children }) => <div data-testid="public-route">{children}</div>,
}));

jest.mock("@/services/api", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ForgotPassword Page", () => {
  const { fetchAPI } = require("@/services/api");
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

      expect(screen.getByRole("heading", { name: headingMatcher })).toBeInTheDocument();
    });
    test("displays main heading and description", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByTestId("public-route")).toBeInTheDocument();
      });

      expect(screen.getByRole("heading", { name: headingMatcher })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(forgotPassCopy.descriptionLine1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeInTheDocument();
    });
    test("renders email input field", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("placeholder", forgotPassCopy.placeholderEmail);
    });
    test("renders submit button", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", submitButtonQuery)).toBeInTheDocument();
      });
    });
  })

  describe("Form Validation", () => {
    test("shows validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

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
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
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
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

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
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

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
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(forgotPassCopy.errorSendingResetEmail)).toBeInTheDocument();
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
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

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
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);

      await user.type(emailInput, "user@example.com");

      expect(emailInput).toHaveValue("user@example.com");
    });
    test("clears error when resubmitting after error", async () => {
      const user = userEvent.setup();
      fetchAPI
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({ success: true });

      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(forgotPassCopy.errorSendingResetEmail)).toBeInTheDocument();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(forgotPassCopy.errorSendingResetEmail)).not.toBeInTheDocument();
      });
    });
  })

  describe("Accessibility", () => {
    test("has proper form labels", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });
    });
    test("has proper button roles", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", submitButtonQuery)).toBeInTheDocument();
      });
    });
    test("has proper link accessibility", async () => {
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        const loginLink = screen.getByRole("link", {
          name: new RegExp(forgotPassCopy.signIn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        });
        expect(loginLink).toHaveAttribute("href", "/login");
      });
    });
  })

  describe("Edge Cases", () => {
    test("handles empty form submission", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", submitButtonQuery)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", submitButtonQuery);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
      });
    });

    test("handles network errors gracefully", async () => {
      const user = userEvent.setup();
      fetchAPI.mockRejectedValue(new Error("Network error"));

      render(<ForgotPasswordPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(forgotPassCopy.labelEmail)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(forgotPassCopy.labelEmail);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(forgotPassCopy.errorSendingResetEmail)).toBeInTheDocument();
      });
    });
  })

});
