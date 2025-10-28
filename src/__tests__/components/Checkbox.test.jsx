import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomCheckbox from "../../components/shared/CustomCheckbox";

describe("CustomCheckbox", () => {
  describe("Rendering", () => {
    test("renders checkbox with label", () => {
      render(<CustomCheckbox label="Test Label" id="test-checkbox" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });
    test("renders checkbox without label", () => {
      render(<CustomCheckbox id="test-checkbox" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });
    test("renders checkbox with custom className", () => {
      render(<CustomCheckbox id="test-checkbox" className="custom-class" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("custom-class");
    });

  });

});