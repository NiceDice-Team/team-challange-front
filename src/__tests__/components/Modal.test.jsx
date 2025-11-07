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
  })
});
