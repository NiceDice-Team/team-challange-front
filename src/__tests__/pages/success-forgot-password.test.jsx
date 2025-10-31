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

});

