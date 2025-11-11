import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "../../app/profile/page";
import { getValidAccessToken, isAuthenticated } from "../../lib/tokenManager";
import { showCustomToast } from "../../components/shared/Toast";


const mockUserData = {
  id: "user-123",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
};

const mockFetchUserData = jest.fn();
const mockSetUserData = jest.fn();

let mockStoreState = {
  userData: mockUserData,
  isLoading: false,
  error: null,
  setUserData: mockSetUserData,
  fetchUserData: mockFetchUserData,
};

jest.mock("../../store/user", () => ({
  useUserStore: jest.fn((selector) => {
    return selector(mockStoreState);
  }),
}));


jest.mock("../../lib/tokenManager", () => ({
  getValidAccessToken: jest.fn(),
  isAuthenticated: jest.fn(),
}));


jest.mock("../../components/shared/Toast", () => ({
  showCustomToast: jest.fn(),
}));


const mockMutateAsync = jest.fn();
const mockUpdateProfile = {
  mutateAsync: mockMutateAsync,
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: null,
};

jest.mock("../../hooks/useUpdateProfile", () => ({
  useUpdateProfile: jest.fn(() => mockUpdateProfile),
}));


jest.mock("../../components/auth/RouteGuards", () => ({
  ProtectedRoute: ({ children }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));


jest.mock("../../components/shared/CustomBreadcrumb", () => ({
  CustomBreadcrumb: ({ items }) => (
    <nav data-testid="breadcrumb">
      {items.map((item, idx) => (
        <span key={idx}>{item.label}</span>
      ))}
    </nav>
  ),
}));

jest.mock("../../components/auth/LogoutButton", () => ({
  LogoutButton: () => <button data-testid="logout-button">Logout</button>,
}));

jest.mock("../../components/ui/tabs", () => ({
  Tabs: ({ children, defaultValue }) => (
    <div data-testid="tabs" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value, onClick }) => (
    <button
      data-testid={`tab-trigger-${value}`}
      onClick={onClick}
      data-value={value}
    >
      {children}
    </button>
  ),
  TabsContent: ({ children, value }) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

jest.mock("../../components/profile/OrdersTable", () => ({
  __esModule: true,
  default: () => <div data-testid="orders-table">Orders Table</div>,
}));

jest.mock("../../components/shared/Modal", () => ({
  __esModule: true,
  default: ({ children, open, onClose }) =>
    open ? (
      <div data-testid="modal">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

jest.mock("../../components/profile/ChangePass", () => ({
  __esModule: true,
  default: ({ open, onClose }) =>
    open ? (
      <div data-testid="change-pass-modal">
        <button onClick={onClose}>Close Change Pass</button>
      </div>
    ) : null,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

jest.mock("../../assets/svg-components/ProfileSVG", () => ({
  __esModule: true,
  default: () => <svg data-testid="profile-svg" />,
}));

jest.mock("../../assets/svg-components/BoxSVG", () => ({
  __esModule: true,
  default: () => <svg data-testid="box-svg" />,
}));

jest.mock("../../assets/icons/mail.svg", () => "mail-icon.svg");

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getValidAccessToken.mockReturnValue("test-token");
    isAuthenticated.mockReturnValue(true);
    mockUpdateProfile.isPending = false;
    mockUpdateProfile.isError = false;
    mockUpdateProfile.isSuccess = false;
    mockUpdateProfile.error = null;
    mockUpdateProfile.data = null;
    
    mockStoreState = {
      userData: mockUserData,
      isLoading: false,
      error: null,
      setUserData: mockSetUserData,
      fetchUserData: mockFetchUserData,
    };
  });

  describe("Rendering", () => {
    test("renders ProfilePage component", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("protected-route")).toBeInTheDocument();
    });
    test("displays welcome message with user name", () => {
      render(<ProfilePage />);

      expect(
        screen.getByText(/Welcome, John!/i)
      ).toBeInTheDocument();
    });
    test("displays account dashboard description", () => {
      render(<ProfilePage />);

      expect(
        screen.getByText(
          /🧩 Your account dashboard - manage your profile, track orders, and update your preferences/i
        )
      ).toBeInTheDocument();
    });
    test("renders breadcrumb", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("My account")).toBeInTheDocument();
    });
    test("renders logout button", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    });
    test("renders profile card with user information", () => {
      render(<ProfilePage />);

      expect(screen.getByText("Your Profile")).toBeInTheDocument();
      expect(screen.getByText("Quick view of your account details")).toBeInTheDocument();
      expect(screen.getByText("NAME")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("EMAIL")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });
    test("renders change password button", () => {
      render(<ProfilePage />);

      expect(
        screen.getByRole("button", { name: /CHANGE PASSWORD/i })
      ).toBeInTheDocument();
    });
    test("renders tabs", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("tabs-list")).toBeInTheDocument();
      expect(screen.getByTestId("tab-trigger-history")).toBeInTheDocument();
      expect(screen.getByTestId("tab-trigger-edit")).toBeInTheDocument();
    });
    test("renders order history tab by default", () => {
      render(<ProfilePage />);

      expect(screen.getByTestId("tab-content-history")).toBeInTheDocument();
      const orderHistoryHeadings = screen.getAllByText("ORDER HISTORY");
      expect(orderHistoryHeadings.length).toBeGreaterThan(0);
      expect(
        screen.getByText("View and track all your previous orders")
      ).toBeInTheDocument();
      expect(screen.getByTestId("orders-table")).toBeInTheDocument();
    });
    test("renders edit profile tab content when clicked", async () => {
      const user = userEvent.setup();
      render(<ProfilePage />);

      const editTab = screen.getByTestId("tab-trigger-edit");
      await user.click(editTab);

      await waitFor(() => {
        expect(screen.getByTestId("tab-content-edit")).toBeInTheDocument();
      });
      expect(screen.getByText("Edit Your Profile")).toBeInTheDocument();
      expect(
        screen.getByText("Update your personal information and account details")
      ).toBeInTheDocument();
    });
  })

  describe("User Data Display", () => {
    test("displays loading state when isLoading is true", () => {
      mockStoreState.isLoading = true;

      render(<ProfilePage />);

      expect(screen.getByText(/Welcome, \.\.\.!/i)).toBeInTheDocument();
      const loadingTexts = screen.getAllByText("Loading...");
      expect(loadingTexts.length).toBeGreaterThan(0);
    });
    test("displays user name correctly", () => {
      render(<ProfilePage />);

      const nameSection = screen.getByText("NAME").closest("div");
      expect(nameSection).toHaveTextContent("John Doe");
    });
    test("displays user email correctly", () => {
      render(<ProfilePage />);

      const emailSection = screen.getByText("EMAIL").closest("div");
      expect(emailSection).toHaveTextContent("john.doe@example.com");
    });
    test("handles missing user data gracefully", () => {
      mockStoreState.userData = null;

      render(<ProfilePage />);

      expect(screen.getByText(/Welcome, !/i)).toBeInTheDocument();
    });
  })

  describe("Edit Profile Form", () => {
    test("renders all form fields", async () => {
      const user = userEvent.setup();
      render(<ProfilePage />);

      const editTab = screen.getByTestId("tab-trigger-edit");
      await user.click(editTab);

      await waitFor(() => {
        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      });
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });
    test("pre-fills form with user data", async () => {
      const user = userEvent.setup();
      render(<ProfilePage />);

      const editTab = screen.getByTestId("tab-trigger-edit");
      await user.click(editTab);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText("First Name");
        expect(firstNameInput).toHaveValue("John");
      });
      
      await waitFor(() => {
        const lastNameInput = screen.getByLabelText("Last Name");
        expect(lastNameInput).toHaveValue("Doe");
      });
      
      await waitFor(() => {
        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toHaveValue("john.doe@example.com");
      });
    });
    test("allows editing form fields", async () => {
      const user = userEvent.setup();
      render(<ProfilePage />);

      const editTab = screen.getByTestId("tab-trigger-edit");
      await user.click(editTab);

      await waitFor(() => {
        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText("First Name");
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "Jane");

      expect(firstNameInput).toHaveValue("Jane");
    });
    test("renders submit button", async () => {
      const user = userEvent.setup();
      render(<ProfilePage />);

      const editTab = screen.getByTestId("tab-trigger-edit");
      await user.click(editTab);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /MAKE CHANGES/i })
        ).toBeInTheDocument();
      });
    });
    test("disables submit button when loading", async () => {
      const user = userEvent.setup();
      mockUpdateProfile.isPending = true;

      render(<ProfilePage />);

      const editTab = screen.getByTestId("tab-trigger-edit");
      await user.click(editTab);

      await waitFor(() => {
        const submitButton = screen.getByRole("button", {
          name: /UPDATING.../i,
        });
        expect(submitButton).toBeDisabled();
      });
    });

  })

});
