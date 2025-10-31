import { render, screen, waitFor } from "@testing-library/react";
import ForgotPasswordSuccess from "../../app/(auth)/forgot-password/success/page";

jest.mock("../../components/shared/Toast", () => ({
  showCustomToast: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

jest.mock("../../../../../public/icons/ArrowNext.svg", () => "ArrowNext.svg");

describe("ForgotPassword Success Page", () => {
  const { showCustomToast } = require("../../components/shared/Toast");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ForgotPasswordSuccess component", async () => {
    render(<ForgotPasswordSuccess />);

    await waitFor(() => {
      expect(screen.getByText(/Check Your Inbox/i)).toBeInTheDocument();
    });
  });

  test('displays main heading', async () => {
        render(<ForgotPasswordSuccess />);

        await waitFor(() => {
            expect(
                screen.getByText(/✉️ Check Your Inbox/i)
            ).toBeInTheDocument();
        });
    });

    test('displays success messages', async () => {
        render(<ForgotPasswordSuccess />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /If the email address you entered is associated with an account/i
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByText(/Check the message for 5-10 minutes/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/If you don't find the list/i)
        ).toBeInTheDocument();
    });

    test('displays resend link', async () => {
        render(<ForgotPasswordSuccess />);

        await waitFor(() => {
            expect(screen.getByText('Resend')).toBeInTheDocument();
        });

        const resendLink = screen.getByText('Resend').closest('a');
        expect(resendLink).toHaveAttribute('href', '/forgot-password');
    });

    test('displays continue shopping link', async () => {
        render(<ForgotPasswordSuccess />);

        await waitFor(() => {
            expect(screen.getByText('Continue shopping')).toBeInTheDocument();
        });

        const catalogLink = screen.getByText('Continue shopping').closest('a');
        expect(catalogLink).toHaveAttribute('href', '/catalog');
    });

    test('calls showCustomToast on mount', async () => {
        render(<ForgotPasswordSuccess />);

        await waitFor(() => {
            expect(showCustomToast).toHaveBeenCalledWith({
                type: 'success',
                title: 'Success! You are logged.',
                description:
                    'A password reset link has been sent to your inbox.',
            });
        });
    });

});

