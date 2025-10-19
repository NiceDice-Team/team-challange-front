import { CustomInput } from "@/components/shared/CustomInput";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CustomInput", () => {
  
  describe("Rendering", () => {
    test("renders input with label", () => {
      render(<CustomInput label="Test Label" id="test-input" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

 });
});