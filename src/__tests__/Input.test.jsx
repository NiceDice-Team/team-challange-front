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
 });
});