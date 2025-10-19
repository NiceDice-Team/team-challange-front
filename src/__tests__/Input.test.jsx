import { CustomInput } from "@/components/shared/CustomInput";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CustomInput", () => {
  
  describe("Rendering", () => {
    test("renders input with label", () => {
      render(<CustomInput label="Test Label" id="test-input" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

    test("renders input with placeholder", () => {
      render(<CustomInput placeholder="Enter text here" />);
      expect(screen.getByPlaceholderText("Enter text here")).toBeInTheDocument();
    });

      test("renders input with custom className", () => {
      render(<CustomInput className="custom-class" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-class");
    });

     test("renders input with labelStyle", () => {
      render(<CustomInput label="Test" labelStyle="custom-label-style" id="test-input" />);
      const label = screen.getByText("Test");
      expect(label).toHaveClass("custom-label-style");
    });

    test("renders input with different types", () => {
      const { rerender } = render(<CustomInput type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

      rerender(<CustomInput type="password" />);
      expect(screen.getByDisplayValue("")).toHaveAttribute("type", "password");

      rerender(<CustomInput type="number" />);
      expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
    });

    test("renders input with value", () => {
      render(<CustomInput value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
    });


 });
});