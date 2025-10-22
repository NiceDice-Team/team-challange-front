import { CustomInput } from "@/components/shared/CustomInput";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CustomInput", () => {
  describe("Rendering", () => {
    test("renders input with label", () => {
      render(<CustomInput label="Test Label" id="test-input" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

    test("renders input with placeholder", () => {
      render(<CustomInput placeholder="Enter text here" />);
      expect(
        screen.getByPlaceholderText("Enter text here")
      ).toBeInTheDocument();
    });

    test("renders input with custom className", () => {
      render(<CustomInput className="custom-class" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-class");
    });

    test("renders input with labelStyle", () => {
      render(
        <CustomInput
          label="Test"
          labelStyle="custom-label-style"
          id="test-input"
        />
      );
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

    test("renders input with id and name", () => {
      render(<CustomInput id="test-id" name="test-name" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "test-id");
      expect(input).toHaveAttribute("name", "test-name");
    });

    test("renders disabled input", () => {
      render(<CustomInput disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("Error Handling", () => {
    test("renders single error message", () => {
      render(<CustomInput error={["This field is required"]} />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveClass("border-error");
    });

    test("renders multiple error messages", () => {
      render(<CustomInput error={["Error 1", "Error 2", "Error 3"]} />);
      expect(screen.getByText("Error 1")).toBeInTheDocument();
      expect(screen.getByText("Error 2")).toBeInTheDocument();
      expect(screen.getByText("Error 3")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    test("handles onChange events", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<CustomInput onChange={handleChange} />);
      const input = screen.getByRole("textbox");

      await user.type(input, "test");
      expect(handleChange).toHaveBeenCalledTimes(4);
    });

    test("handles onBlur events", async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();

      render(<CustomInput onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");

      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
    test("does not call onChange when disabled", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<CustomInput onChange={handleChange} disabled />);
      const input = screen.getByRole("textbox");

      await user.type(input, "test");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("associates label with input using htmlFor", () => {
      render(<CustomInput label="Test Label" id="test-input" />);
      const label = screen.getByText("Test Label");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
    });
  });

  test("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<CustomInput />);
    const input = screen.getByRole("textbox");

    await user.tab();
    expect(input).toHaveFocus();
  });

  describe("Edge Cases", () => {
    test("renders with empty string label", () => {
      render(<CustomInput label="" />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
    test("renders with undefined error", () => {
      render(<CustomInput error={undefined} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).not.toHaveClass("border-error");
    });
    test("renders with null error", () => {
      render(<CustomInput error={null} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).not.toHaveClass("border-error");
    });
  });
  describe("Performance", () => {
    test("does not re-render unnecessarily", () => {
      const renderSpy = jest.fn();
      const TestComponent = ({ value }) => {
        renderSpy();
        return <CustomInput value={value} onChange={() => {}} />;
      };

      const { rerender } = render(<TestComponent value="test" />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(<TestComponent value="test" />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
