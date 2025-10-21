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
});
