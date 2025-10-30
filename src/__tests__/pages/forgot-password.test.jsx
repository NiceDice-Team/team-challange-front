import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "../../app/(auth)/forgot-password/page";

jest.mock("../../components/auth/RouteGuards", () => ({
  PublicRoute: ({ children }) => <div data-testid="public-route">{children}</div>,
}));

jest.mock("../../services/api", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ForgotPassword Page", () => {
  const { fetchAPI } = require("../../services/api");
  const { useRouter } = require("next/navigation");

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    fetchAPI.mockResolvedValue({});
  });

});
