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
    test("renders checkbox with checked state", () => {
      render(<CustomCheckbox id="test-checkbox" checked />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });
    test("renders checkbox with error styling", () => {
      render(<CustomCheckbox id="test-checkbox" error="Test error" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("border-error");
    });
  });

  describe("Functionality", () => {
     test("checkbox can be checked and unchecked", async () => {
      const user = userEvent.setup();
      render(<CustomCheckbox id="test-checkbox" />);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
    test("calls onCheckedChange when clicked", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CustomCheckbox id="test-checkbox" onCheckedChange={handleChange} />
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });
    test("respects checked prop", () => {
      render(<CustomCheckbox id="test-checkbox" checked={true} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });
    test("checkbox can be disabled", async () => {
      const user = userEvent.setup();
      render(<CustomCheckbox id="test-checkbox" disabled />);
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toBeDisabled();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
    test("checkbox can be disabled and checked", async () => {
      const user = userEvent.setup();
      render(<CustomCheckbox id="test-checkbox" disabled checked />);
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toBeDisabled();
      expect(checkbox).toBeChecked();
    });
    test("onCheckedChange is not called when disabled", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(
        <CustomCheckbox
          id="test-checkbox"
          disabled
          onCheckedChange={handleChange}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });
  })

  describe("Label Association", () => {
    test("associates label with checkbox using id", () => {
      render(<CustomCheckbox label="Agree to terms" id="terms-checkbox" />);
      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Agree to terms");

      expect(label).toHaveAttribute("for", "terms-checkbox");
      expect(checkbox).toHaveAttribute("id", "terms-checkbox");
    });
  })
});