import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

describe("Login Page", () => {
  describe("Rendering", () => {
    test("renders the login page", () => {
      render(<LoginPage />);
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
});