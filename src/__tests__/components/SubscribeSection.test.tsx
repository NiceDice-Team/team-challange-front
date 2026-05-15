import { fireEvent, render, screen } from "@testing-library/react";
import SubscribeSection from "@/components/home/SubscribeSection";
import MobileFooter from "@/components/layout/MobileFooter";
import { showCustomToast } from "@/components/shared/Toast";

jest.mock("@/components/shared/Toast", () => ({
  showCustomToast: jest.fn(),
}));

const mockedShowCustomToast = showCustomToast as jest.Mock;

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

describe("Newsletter subscription feedback", () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  });

  beforeEach(() => {
    mockedShowCustomToast.mockClear();
  });

  test("shows the existing toast popup after desktop subscribe submit", () => {
    render(<SubscribeSection variant="homeDesktop" />);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    const consentCheckbox = screen.getByRole("checkbox", {
      name: /i agree to receiving marketing emails/i,
    });

    fireEvent.change(emailInput, { target: { value: "player@example.com" } });
    fireEvent.click(consentCheckbox);
    expect(consentCheckbox).toHaveClass("w-6", "h-6", "rounded-none", "border-white");
    expect(consentCheckbox).toHaveAttribute("aria-checked", "true");
    fireEvent.submit(emailInput.closest("form") as HTMLFormElement);

    expect(submitButton).toHaveClass("hover:bg-[#FF5F00]");
    expect(mockedShowCustomToast).toHaveBeenCalledWith({
      type: "success",
      title: "Thank you for subscribing!",
      description: "We will send updates and special deals to your email.",
    });
    expect(emailInput).toHaveValue("");
  });

  test("shows the existing toast popup after mobile footer subscribe submit", () => {
    render(<MobileFooter />);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    const consentCheckbox = screen.getByRole("checkbox", {
      name: /i agree to receiving marketing emails/i,
    });

    fireEvent.change(emailInput, { target: { value: "player@example.com" } });
    fireEvent.click(consentCheckbox);
    expect(consentCheckbox).toHaveClass("w-6", "h-6", "rounded-none", "border-white");
    expect(consentCheckbox).toHaveAttribute("aria-checked", "true");
    fireEvent.submit(emailInput.closest("form") as HTMLFormElement);

    expect(submitButton).toHaveClass("hover:bg-[#FF5F00]");
    expect(mockedShowCustomToast).toHaveBeenCalledWith({
      type: "success",
      title: "Thank you for subscribing!",
      description: "We will send updates and special deals to your email.",
    });
    expect(emailInput).toHaveValue("");
  });

  test("asks for consent before showing the success popup", () => {
    render(<SubscribeSection variant="homeDesktop" />);

    const emailInput = screen.getByPlaceholderText("Email");

    fireEvent.change(emailInput, { target: { value: "player@example.com" } });
    fireEvent.submit(emailInput.closest("form") as HTMLFormElement);

    expect(mockedShowCustomToast).toHaveBeenCalledWith({
      type: "info",
      title: "Please confirm your subscription consent.",
      description: "Check the marketing emails consent box to subscribe.",
    });
  });
});
