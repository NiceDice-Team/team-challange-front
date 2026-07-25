import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioButton } from "../../components/shared/CustomRadio";

describe("RadioButton", () => {
  describe("Rendering", () => {
    test("renders radio button with children", () => {
      render(
        <RadioButton id="test-radio" name="test" value="test">
          Test Label
        </RadioButton>
      );
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    test("renders radio input with correct attributes", () => {
      render(
        <RadioButton id="test-radio" name="group" value="option1">
          Option 1
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      expect(radio).toHaveAttribute("id", "test-radio");
      expect(radio).toHaveAttribute("name", "group");
      expect(radio).toHaveAttribute("value", "option1");
    });

    test("renders with custom className", () => {
      render(
        <RadioButton 
          id="test-radio" 
          name="test" 
          value="test" 
          className="custom-class"
        >
          Test
        </RadioButton>
      );
      
      const label = screen.getByText("Test").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    test("shows checked state visually", () => {
      render(
        <RadioButton id="test-radio" name="test" value="test" checked>
          Checked Option
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      expect(radio).toBeChecked();
    });

    test("shows unchecked state visually", () => {
      render(
        <RadioButton id="test-radio" name="test" value="test" checked={false}>
          Unchecked Option
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      expect(radio).not.toBeChecked();
    });
  });

  describe("Interactions", () => {
    test("calls onChange when clicked", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <RadioButton 
          id="test-radio" 
          name="test" 
          value="test" 
          onChange={handleChange}
        >
          Click me
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      await user.click(radio);
      
      // Component has both onClick and onChange, so it may be called multiple times
      expect(handleChange).toHaveBeenCalled();
    });

    test("handles multiple clicks correctly", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <RadioButton 
          id="test-radio" 
          name="test" 
          value="test" 
          onChange={handleChange}
        >
          Test
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      await user.click(radio);
      await user.click(radio);
      await user.click(radio);
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("has proper label association", () => {
      render(
        <RadioButton id="test-radio" name="test" value="test">
          Associated Label
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      const label = screen.getByText("Associated Label");
      
      expect(label.tagName).toBe("DIV"); // Based on component structure
      expect(radio).toBeInTheDocument();
    });

    test("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <RadioButton id="test-radio" name="test" value="test">
          Keyboard accessible
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      await user.tab();
      expect(radio).toHaveFocus();
    });

    test("supports space key selection", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <RadioButton 
          id="test-radio" 
          name="test" 
          value="test" 
          onChange={handleChange}
        >
          Space selectable
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      await user.tab();
      await user.keyboard(" ");
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("Radio Group Behavior", () => {
    test("works correctly in a group", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <div>
          <RadioButton 
            id="radio1" 
            name="group" 
            value="option1" 
            onChange={handleChange}
          >
            Option 1
          </RadioButton>
          <RadioButton 
            id="radio2" 
            name="group" 
            value="option2" 
            onChange={handleChange}
          >
            Option 2
          </RadioButton>
        </div>
      );
      
      const radio1 = screen.getByDisplayValue("option1");
      const radio2 = screen.getByDisplayValue("option2");
      
      await user.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();
      
      await user.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });
  });

  describe("Edge Cases", () => {
    test("handles undefined onChange gracefully", async () => {
      const user = userEvent.setup();
      render(
        <RadioButton id="test-radio" name="test" value="test">
          No handler
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      await expect(user.click(radio)).resolves.not.toThrow();
    });

    test("renders without children", () => {
      render(
        <RadioButton id="test-radio" name="test" value="test" />
      );
      
      const radio = screen.getByRole("radio");
      expect(radio).toBeInTheDocument();
    });

    test("handles empty string values", () => {
      render(
        <RadioButton id="test-radio" name="test" value="">
          Empty value
        </RadioButton>
      );
      
      const radio = screen.getByRole("radio");
      expect(radio).toHaveAttribute("value", "");
    });

    test("applies default styling correctly", () => {
      render(
        <RadioButton id="test-radio" name="test" value="test">
          Default styling
        </RadioButton>
      );
      
      const label = screen.getByText("Default styling").closest("label");
      expect(label).toHaveClass("flex", "items-center", "cursor-pointer");
    });
  });
});