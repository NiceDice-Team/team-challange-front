import { PasswordInput } from "@/components/shared/PasswordInput";
import { render, screen } from "@testing-library/react";

describe("PasswordInput", () => {
  describe("Rendering", () => {
    test("renders input with label", () => {
      render(<PasswordInput label="Test Label" id="test-input" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });
  });
});
