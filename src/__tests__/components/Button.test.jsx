import { CustomButton } from "@/components/shared/CustomButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CustomButton", () => {

  describe("Rendering", () => {
    test("renders button with children text", () => {
      render(<CustomButton>Click me</CustomButton>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    test("renders button with custom className", () => {
      render(<CustomButton className="custom-class">Test</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    test("renders button with default props", () => {
      render(<CustomButton>Default Button</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full", "h-12", "bg-purple", "text-white");
      expect(button).not.toBeDisabled();
    });
  });


  describe("Style Types", () => {
    test("renders linkButton style correctly", () => {
      render(<CustomButton styleType="linkButton">Link Button</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-fit", "text-purple", "bg-transparent", "underline");
    });

    test("renders whiteButton style correctly", () => {
      render(<CustomButton styleType="whiteButton">White Button</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white", "text-purple", "border", "border-purple");
    });

    test("renders productCart style correctly", () => {
      render(<CustomButton styleType="productCart">Add to Cart</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-2", "border-[#494791]", "bg-transparent", "text-[#494791]");
    });

    test("renders wishlist style correctly", () => {
      render(<CustomButton styleType="wishlist">❤</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-8", "h-8", "bg-white", "rounded-full");
    });

    test("renders navigation style correctly", () => {
      render(<CustomButton styleType="navigation">•</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-20", "h-1", "bg-gray-300");
    });
  });

  describe("States", () => {
    test("renders disabled state correctly", () => {
      render(<CustomButton disabled>Disabled Button</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:bg-gray-2", "disabled:cursor-auto");
    });

    test("renders loading state correctly", () => {
      render(<CustomButton loading>Loading Button</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("loader");
    });
  });

  describe("Interactions", () => {
    test("handles click events", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<CustomButton onClick={handleClick}>Click me</CustomButton>);
      const button = screen.getByRole("button");
      
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("does not call onClick when disabled", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<CustomButton onClick={handleClick} disabled>Disabled</CustomButton>);
      const button = screen.getByRole("button");
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test("handles focus events", async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();
      
      render(<CustomButton onFocus={handleFocus}>Focus me</CustomButton>);
      const button = screen.getByRole("button");
      
      await user.tab();
      expect(button).toHaveFocus();
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test("handles blur events", async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      
      render(<CustomButton onBlur={handleBlur}>Blur me</CustomButton>);
      const button = screen.getByRole("button");
      
      await user.tab();
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA attributes", () => {
      render(<CustomButton aria-label="Custom label">Button</CustomButton>);
      const button = screen.getByRole("button", { name: /custom label/i });
      expect(button).toBeInTheDocument();
    });

    test("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<CustomButton>Keyboard accessible</CustomButton>);
      const button = screen.getByRole("button");
      
      await user.tab();
      expect(button).toHaveFocus();
    });

    test("has proper focus styles", () => {
      render(<CustomButton>Focus test</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-visible:ring-0", "focus-visible:outline-none");
    });
  });

  describe("Props Handling", () => {
    test("passes through additional props", () => {
      render(
        <CustomButton data-testid="custom-button" id="test-id">
          Props test
        </CustomButton>
      );
      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("id", "test-id");
    });

    test("combines custom className with default styles", () => {
      render(<CustomButton className="custom-style">Combined</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full", "h-12", "custom-style");
    });
  });

  describe("Edge Cases", () => {
    test("renders with empty children", () => {
      render(<CustomButton></CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("");
    });

    test("renders with complex children", () => {
      render(
        <CustomButton>
          <span>Complex</span> <strong>Content</strong>
        </CustomButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Complex Content");
    });

    test("handles undefined styleType", () => {
      render(<CustomButton styleType={undefined}>Undefined style</CustomButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full", "h-12", "bg-purple");
    });
  });

  describe("Performance", () => {
    test("does not re-render unnecessarily", () => {
      const renderSpy = jest.fn();
      const TestComponent = ({ children }) => {
        renderSpy();
        return <CustomButton>{children}</CustomButton>;
      };

      const { rerender } = render(<TestComponent>Test</TestComponent>);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender(<TestComponent>Test</TestComponent>);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});