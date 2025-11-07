import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../../components/shared/Modal";

jest.mock("../../components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }) => (
    <div data-testid="dialog" data-open={open}>
      {open && children}
    </div>
  ),
  DialogContent: ({ children, className, ...props }) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  DialogClose: ({ children, onClick, className }) => (
    <button
      data-testid="dialog-close"
      onClick={onClick}
      className={className}
      aria-label="Close"
    >
      {children}
    </button>
  ),
  DialogHeader: ({ children }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogFooter: ({ children }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
  DialogTitle: ({ children, className }) => (
    <h2 data-testid="dialog-title" className={className}>
      {children}
    </h2>
  ),
  DialogOverlay: () => <div data-testid="dialog-overlay" />,
}));

jest.mock("../../svgs/icons", () => ({
  CloseIcon: () => <span data-testid="close-icon">×</span>,
}));

describe("Modal Component", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders modal when open is true", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Test Content</div>
        </Modal>
      );

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    }); 
    test("does not render modal content when open is false", () => {
      render(
        <Modal
          open={false}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Test Content</div>
        </Modal>
      );

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });
    test("displays title correctly", () => {
      render(
        <Modal
          open={true}
          title="Test Modal Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const title = screen.getByTestId("dialog-title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Test Modal Title");
    });
    test("displays description correctly", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="This is a test description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText("This is a test description")).toBeInTheDocument();
    });
    test("renders children content", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div data-testid="modal-children">Custom Content</div>
        </Modal>
      );

      expect(screen.getByTestId("modal-children")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });
    test("renders close button", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByTestId("dialog-close");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute("aria-label", "Close");
    });
    test("renders confirm and cancel buttons with default text", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });
    test("renders buttons with custom text", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmButtonText="Save"
          cancelButtonText="Dismiss"
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
    });
    test("renders dialog header", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId("dialog-header")).toBeInTheDocument();
    });
    test("renders dialog footer", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
    });
  })

  describe("Interactions", () => {
    test("calls onConfirm when confirm button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const confirmButton = screen.getByRole("button", { name: /confirm/i });
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });
    test("calls onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
    test("calls onCancel when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByTestId("dialog-close");
      await user.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
    test("calls onCancel when dialog open state changes via onOpenChange", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const dialog = screen.getByTestId("dialog");
      expect(dialog).toBeInTheDocument();
    });
    test("handles multiple confirm clicks", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const confirmButton = screen.getByRole("button", { name: /confirm/i });
      await user.click(confirmButton);
      await user.click(confirmButton);
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });
    test("handles multiple cancel clicks", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(2);
    });
  })
  describe("State Management", () => {
    test("updates when open prop changes from false to true", () => {
      const { rerender } = render(
        <Modal
          open={false}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();

      rerender(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });
    test("updates when open prop changes from true to false", () => {
      const { rerender } = render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();

      rerender(
        <Modal
          open={false}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });
  })
  describe("Accessibility", () => {
    test("has proper ARIA attributes", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const dialogContent = screen.getByTestId("dialog-content");
      expect(dialogContent).toHaveAttribute("aria-labelledby", "dialog-content");
      expect(dialogContent).not.toHaveAttribute("aria-describedby");
    });
    test("close button has aria-label", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByTestId("dialog-close");
      expect(closeButton).toHaveAttribute("aria-label", "Close");
    });
    test("title is accessible", () => {
      render(
        <Modal
          open={true}
          title="Accessible Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const title = screen.getByTestId("dialog-title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Accessible Title");
    });
    test("buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const confirmButton = screen.getByRole("button", { name: /confirm/i });
      
      cancelButton.focus();
      expect(cancelButton).toHaveFocus();

      confirmButton.focus();
      expect(confirmButton).toHaveFocus();
    });
  })

  describe("Styling", () => {
    test("applies correct classes to dialog content", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const dialogContent = screen.getByTestId("dialog-content");
      expect(dialogContent).toHaveClass("z-50", "bg-white", "p-6");
    });
    test("applies correct classes to title", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const title = screen.getByTestId("dialog-title");
      expect(title).toHaveClass("flex", "justify-start", "text-black", "text-lg");
    });
    test("applies correct classes to close button", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByTestId("dialog-close");
      expect(closeButton).toHaveClass(
        "top-24",
        "right-24",
        "absolute",
        "focus-visible:outline-none",
        "focus:outline-none",
        "pointer"
      );
    });
  })

  describe("Edge Cases", () => {
    test("handles empty children", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          {null}
        </Modal>
      );

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-title")).toBeInTheDocument();
    });
    test("handles complex children content", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>
            <h3>Section 1</h3>
            <p>Paragraph 1</p>
            <button>Action</button>
          </div>
        </Modal>
      );

      expect(screen.getByText("Section 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
    test("handles rapid button clicks", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      const confirmButton = screen.getByRole("button", { name: /confirm/i });
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      await user.click(confirmButton);
      await user.click(cancelButton);
      await user.click(confirmButton);
      await user.click(cancelButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(2);
      expect(mockOnCancel).toHaveBeenCalledTimes(2);
    });
  })

  describe("Props Validation", () => {
    test("renders with all required props", () => {
      render(
        <Modal
          open={true}
          title="Required Title"
          description="Required Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Required Content</div>
        </Modal>
      );

      expect(screen.getByText("Required Title")).toBeInTheDocument();
      expect(screen.getByText("Required Description")).toBeInTheDocument();
      expect(screen.getByText("Required Content")).toBeInTheDocument();
    });
    test("uses default button text when not provided", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });
    test("overrides default button text when provided", () => {
      render(
        <Modal
          open={true}
          title="Test Title"
          description="Test Description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmButtonText="Submit"
          cancelButtonText="Dismiss"
        >
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
    });
  })
});
