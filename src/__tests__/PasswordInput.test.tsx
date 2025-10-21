import { PasswordInput } from "@/components/shared/PasswordInput";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const getPasswordInput = () => {
  return screen.getByDisplayValue("");
};

describe("PasswordInput", () => {
  describe("Rendering", () => {
    test("renders input with label", () => {
      render(<PasswordInput label="Test Label" id="test-input" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });
    test("render with placeholder", () => {
      render(<PasswordInput id="test-input" placeholder="Enter password" />);
      expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    });
    test("render with custom className", () => {
      render(<PasswordInput className="custom-class" id="test-input" />);
      const passInput = getPasswordInput();
      expect(passInput).toHaveClass("custom-class");
    });
    test("renders with disabled state", () => {
      render(<PasswordInput disabled id="test-input" />);
      const input = getPasswordInput();
      expect(input).toBeDisabled();
    });
    test("renders with value", () => {
      render(
        <PasswordInput
          value="test-password"
          onChange={() => {}}
          id="test-input"
        />
      );
      expect(screen.getByDisplayValue("test-password")).toBeInTheDocument();
    });
  });

  describe("Password Visibility Toggle", () => {
    test("renders toggle button by default", () => {
      render(<PasswordInput id="test-input" />);
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });
    test("hides toggle button when hideToggle is true", () => {
      render(<PasswordInput hideToggle id="test-input" />);
      const toggleButton = screen.queryByRole("button", {
        name: /show password/i,
      });
      expect(toggleButton).not.toBeInTheDocument();
    });
    test("shows eye icon when password is hidden", () => {
      render(<PasswordInput id="test-input" />);
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });
    test("shows eye-off icon when password is visible", async () => {
      const user = userEvent.setup();
      render(<PasswordInput id="test-input" />);
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      await user.click(toggleButton);
      expect(
        screen.getByRole("button", { name: /hide password/i })
      ).toBeInTheDocument();
    });

    test("toggles input type between password and text", async () => {
      const user = userEvent.setup();
      render(<PasswordInput id="test-input" />);
      const input = getPasswordInput();
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      expect(input).toHaveAttribute("type", "password");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("Error Handling", () => {
    test("renders single error message", () => {
      render(
        <PasswordInput error={["Password is required"]} id="test-input" />
      );
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(getPasswordInput()).toHaveClass("border-error");
    });

    test("renders multiple error messages", () => {
      render(
        <PasswordInput
          error={["Error 1", "Error 2", "Error 3"]}
          id="test-input"
        />
      );
      expect(screen.getByText("Error 1")).toBeInTheDocument();
      expect(screen.getByText("Error 2")).toBeInTheDocument();
      expect(screen.getByText("Error 3")).toBeInTheDocument();
    });
  });
});
