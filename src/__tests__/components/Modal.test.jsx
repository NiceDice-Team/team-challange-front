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
  })

});
