import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { render, screen } from "@testing-library/react";

describe("CustomCheckbox", () => {
  describe("Rendering", () => {
    test("renders checkbox with label", () => {
      render(<CustomCheckbox label="Test Label" id="test-checkbox" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });
  });
});