import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import path from "path";
import fs from "fs";
import ResetPassword from "@/app/(auth)/reset-password/page";

const resetPassCopy = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "public/locales/en/common.json"), "utf8"),
).resetPass;

const headingMatcher = new RegExp(
  resetPassCopy.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  "i",
);
const submitButtonQuery = { name: new RegExp(resetPassCopy.reset, "i") };

jest.mock("@/services/api", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/shared/Toast", () => ({
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
  const { fetchAPI } = require("@/services/api");
  const { useRouter, useSearchParams } = require("next/navigation");
  const { showCustomToast } = require("@/components/shared/Toast");

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
        expect(screen.getByRole("heading", { name: headingMatcher })).toBeInTheDocument();
      });
    });
    test("displays main heading", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: headingMatcher })).toBeInTheDocument();
      });
    });
    test("displays description text", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        const heading = screen.getByRole("heading", { name: headingMatcher });
        const intro = heading.nextElementSibling;
        expect(intro).not.toBeNull();
        expect(intro).toHaveTextContent(resetPassCopy.descriptionLine1);
        expect(intro).toHaveTextContent(resetPassCopy.descriptionLine2);
      });
    });
    test("renders password input field", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("placeholder", resetPassCopy.placeholderPassword);
    });
    test("renders confirm password input field", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelConfirmPassword)).toBeInTheDocument();
      });

      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toHaveAttribute(
        "placeholder",
        resetPassCopy.placeholderConfirmPassword
      );
    });
    test("renders submit button", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("button", submitButtonQuery)).toBeInTheDocument();
      });
    });
    test("renders sign in link", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
      });

      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toHaveAttribute("href", "/login");
    });
  })

    describe("Form Validation", () => {
      test("shows validation error for empty password", async () => {
        const user = userEvent.setup();
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token");
        mockSearchParams.set("uid", btoa("test-user-id"));
        useSearchParams.mockReturnValue(mockSearchParams);

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const submitButton = screen.getByRole("button", submitButtonQuery);
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/Password must be at least 8 characters/i)
          ).toBeInTheDocument();
        });
      });
      test("shows validation error for short password", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
      });
      test("shows validation error for password without letters and numbers", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "12345678");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Contain at least one letter and one number./i
          )
        ).toBeInTheDocument();
      });
      });
      test("shows validation error when passwords do not match", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password456");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
      });
      test("allows valid password submission", async () => {
        const user = userEvent.setup();
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token");
        mockSearchParams.set("uid", btoa("test-user-id"));
        useSearchParams.mockReturnValue(mockSearchParams);

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);

        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");

        expect(passwordInput).toHaveValue("password123");
        expect(confirmPasswordInput).toHaveValue("password123");
      });
    })

    describe("Form Submission", () => {
      test("submits form with valid password", async () => {
        const user = userEvent.setup();
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token");
        mockSearchParams.set("uid", btoa("test-user-id"));
        useSearchParams.mockReturnValue(mockSearchParams);
        fetchAPI.mockResolvedValue({ success: true });

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
        const submitButton = screen.getByRole("button", submitButtonQuery);

        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          expect(fetchAPI).toHaveBeenCalledWith("users/reset-password/", {
            method: "POST",
            body: {
              uid: btoa("test-user-id"),
              access_token: "test-token",
              new_password: "password123",
            },
          });
        });
      });
    })

    describe("URL Parameters Handling", () => {
      test("extracts token from URL parameters", async () => {
        const user = userEvent.setup();
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token-123");
        mockSearchParams.set("uid", btoa("test-user-id"));
        useSearchParams.mockReturnValue(mockSearchParams);
        fetchAPI.mockResolvedValue({ success: true });

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
        const submitButton = screen.getByRole("button", submitButtonQuery);

        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          expect(fetchAPI).toHaveBeenCalledWith("users/reset-password/", {
            method: "POST",
            body: {
              uid: btoa("test-user-id"),
              access_token: "test-token-123",
              new_password: "password123",
            },
          });
        });
      });
      test("passes uid from URL parameters as is", async () => {
        const user = userEvent.setup();
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token");
        mockSearchParams.set("uid", btoa("user-123-abc"));
        useSearchParams.mockReturnValue(mockSearchParams);
        fetchAPI.mockResolvedValue({ success: true });

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
        const submitButton = screen.getByRole("button", submitButtonQuery);

        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          expect(fetchAPI).toHaveBeenCalledWith("users/reset-password/", {
            method: "POST",
            body: {
              uid: btoa("user-123-abc"),
              access_token: "test-token",
              new_password: "password123",
            },
          });
        });
      });
      test("handles missing token parameter", async () => {
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("uid", btoa("test-user-id"));
        useSearchParams.mockReturnValue(mockSearchParams);

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
        const submitButton = screen.getByRole("button", submitButtonQuery);

        const user = userEvent.setup();
        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          expect(fetchAPI).toHaveBeenCalledWith("users/reset-password/", {
            method: "POST",
            body: {
              uid: btoa("test-user-id"),
              access_token: null,
              new_password: "password123",
            },
          });
        });
      });
      test("handles missing uid parameter", async () => {
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token");
        useSearchParams.mockReturnValue(mockSearchParams);

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
        const submitButton = screen.getByRole("button", submitButtonQuery);

        const user = userEvent.setup();
        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          expect(fetchAPI).toHaveBeenCalledWith("users/reset-password/", {
            method: "POST",
            body: {
              uid: null,
              access_token: "test-token",
              new_password: "password123",
            },
          });
        });
      });
      test("handles non-base64 uid value", async () => {
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set("token", "test-token");
        mockSearchParams.set("uid", "invalid-base64!!!");
        useSearchParams.mockReturnValue(mockSearchParams);

        render(<ResetPassword />);

        await waitFor(() => {
          expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
        const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
        const submitButton = screen.getByRole("button", submitButtonQuery);

        const user = userEvent.setup();
        await user.type(passwordInput, "password123");
        await user.type(confirmPasswordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          expect(fetchAPI).toHaveBeenCalledWith("users/reset-password/", {
            method: "POST",
            body: {
              uid: "invalid-base64!!!",
              access_token: "test-token",
              new_password: "password123",
            },
          });
        });
      });
    })

    describe("Form Interactions", () => {
    test("updates password input value when typing", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);

      await user.type(passwordInput, "newpassword123");

      expect(passwordInput).toHaveValue("newpassword123");
    }); 
    test("updates confirm password input value when typing", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelConfirmPassword)).toBeInTheDocument();
      });

      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);

      await user.type(confirmPasswordInput, "newpassword123");

      expect(confirmPasswordInput).toHaveValue("newpassword123");
    });
    test("clears error when resubmitting after error", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);
      fetchAPI
        .mockRejectedValueOnce({
          errors: [{ detail: "Token has expired" }],
        })
        .mockResolvedValueOnce({ success: true });

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Token has expired")).toBeInTheDocument();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Token has expired")
        ).not.toBeInTheDocument();
      });
    });
  })
  describe("Accessibility", () => {
    test("has proper form labels", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
        expect(screen.getByLabelText(resetPassCopy.labelConfirmPassword)).toBeInTheDocument();
      });
    });
    test("has proper button roles", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("button", submitButtonQuery)).toBeInTheDocument();
      });
    });
    test("has proper link accessibility", async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
      });

      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toHaveAttribute("href", "/login");
    });
  })
  describe("Edge Cases", () => {
    test("handles empty form submission", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByRole("button", submitButtonQuery)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", submitButtonQuery);
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });
    test("handles network errors gracefully", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);
      fetchAPI.mockRejectedValue(new Error("Network error"));

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(resetPassCopy.errorResettingPassword)
        ).toBeInTheDocument();
      });
    });
    test("handles API error without detail", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);
      fetchAPI.mockRejectedValue({
        errors: [{ message: "Some error" }],
      });

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(resetPassCopy.errorResettingPassword)
        ).toBeInTheDocument();
      });
    });
    test("handles API error without errors array", async () => {
      const user = userEvent.setup();
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("token", "test-token");
      mockSearchParams.set("uid", btoa("test-user-id"));
      useSearchParams.mockReturnValue(mockSearchParams);
      fetchAPI.mockRejectedValue({ message: "Some error" });

      render(<ResetPassword />);

      await waitFor(() => {
        expect(screen.getByLabelText(resetPassCopy.labelPassword)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(resetPassCopy.labelPassword);
      const confirmPasswordInput = screen.getByLabelText(resetPassCopy.labelConfirmPassword);
      const submitButton = screen.getByRole("button", submitButtonQuery);

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(resetPassCopy.errorResettingPassword)
        ).toBeInTheDocument();
      });
    });
  })
});
