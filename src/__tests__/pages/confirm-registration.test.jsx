import { render, screen, waitFor } from "@testing-library/react";
import ConfirmSignUpPage from "../../app/(auth)/confirm-signup/page";

jest.mock("../../components/auth/RouteGuards", () => ({
  PublicRoute: ({ children }) => <div data-testid="public-route">{children}</div>,
}));

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

jest.mock("../../../../public/icons/ArrowNext.svg", () => "ArrowNext.svg");

describe("ConfirmSignUp Page", () => {
  const { showCustomToast } = require("../../components/shared/Toast");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ConfirmSignUp component", async () => {
    render(<ConfirmSignUpPage />);

    await waitFor(() => {
      expect(screen.getByTestId("public-route")).toBeInTheDocument();
    });

    expect(screen.getByText("Thank you for registering!")).toBeInTheDocument();
  });

  test('displays confirmation message', async () => {
        render(<ConfirmSignUpPage />);

        await waitFor(() => {
            expect(screen.getByTestId('public-route')).toBeInTheDocument();
        });

        expect(
            screen.getByText(
                'A confirmation email has been sent to your inbox.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Please click the link in that email to activate your account/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Check the message for 5-10 minutes/i)
        ).toBeInTheDocument();
    });

    test('displays link to browse games', async () => {
        render(<ConfirmSignUpPage />);

        await waitFor(() => {
            expect(screen.getByText('Browse games')).toBeInTheDocument();
        });

        const browseLink = screen.getByText('Browse games').closest('a');
        expect(browseLink).toHaveAttribute('href', '/catalog');
    });

    test('calls showCustomToast on mount', async () => {
        render(<ConfirmSignUpPage />);

        await waitFor(() => {
            expect(showCustomToast).toHaveBeenCalledWith({
                type: 'success',
                title: 'Success! You are registered.',
                description:
                    'A confirmation email has been sent to your inbox.',
            });
        });
    });
});
