import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/layout/Navbar";

jest.mock("next/link", () => {
  return ({ children, href, onClick, ...props }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
});

jest.mock("@/store/user", () => ({
  useUserStore: jest.fn((selector) => selector({ userData: null })),
}));

jest.mock("@/hooks/useCartQuery", () => ({
  useCartSummary: jest.fn(() => ({ itemCount: 0 })),
}));

jest.mock("@/lib/tokenManager", () => ({
  getTokens: jest.fn(() => ({ refreshToken: null })),
}));

jest.mock("@/lib/decodeToken", () => jest.fn());

jest.mock("@/components/cart/CartDropdown", () => ({
  __esModule: true,
  default: ({ isOpen }) => <div data-testid="cart-dropdown" data-open={isOpen ? "true" : "false"} />,
}));

jest.mock("@/components/layout/LanguageSelector", () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector">Language selector</div>,
}));

jest.mock("@/components/shared/SearchBar", () => ({
  __esModule: true,
  default: ({ autoFocus = false, placeholder, variant }) => (
    <div
      data-testid={variant === "catalog-mobile" ? "mobile-search-bar" : "search-bar"}
      data-autofocus={autoFocus ? "true" : "false"}
      data-variant={variant}
    >
      {placeholder}
    </div>
  ),
}));

jest.mock("@/svgs/icons", () => ({
  LogoIcon: "/logo.svg",
  ProfileIcon: "/profile.svg",
  CartIcon: "/cart.svg",
  PoshukovaLupaIcon: "/search.svg",
  BurgerMenuIcon: "/burger.svg",
  CloseIcon: ({ className }) => <svg data-testid="close-icon" className={className} />,
  ChevronDownIcon: ({ className }) => <svg data-testid="chevron-icon" className={className} />,
  SearchOutlineIcon: ({ className }) => <svg data-testid="search-outline-icon" className={className} />,
}));

describe("Navbar mobile menu", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  test("opens and closes the mobile menu overlay from the hamburger button", async () => {
    const user = userEvent.setup();

    render(<Navbar isPagination={false} />);

    await user.click(screen.getByRole("button", { name: /open mobile menu/i }));

    const dialog = screen.getByRole("dialog", { name: /mobile menu/i });

    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("link", { name: /new arrival/i })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: /select language/i })).toBeInTheDocument();
    expect(within(dialog).queryByTestId("mobile-search-bar")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close mobile menu/i }));

    expect(screen.queryByRole("dialog", { name: /mobile menu/i })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  test("toggles the inline mobile search bar from the search icon on pages that enable it", async () => {
    const user = userEvent.setup();

    render(<Navbar isPagination={false} enableMobileInlineSearch />);

    const searchToggle = screen.getByRole("button", { name: /show mobile search/i });

    expect(searchToggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByTestId("mobile-search-bar")).not.toBeInTheDocument();

    await user.click(searchToggle);

    const searchBar = screen.getByTestId("mobile-search-bar");

    expect(searchBar).toHaveAttribute("data-variant", "catalog-mobile");
    expect(searchBar).toHaveAttribute("data-autofocus", "true");
    expect(searchBar).toHaveTextContent("Search games");
    expect(screen.getByRole("button", { name: /hide mobile search/i })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: /hide mobile search/i }));

    expect(screen.queryByTestId("mobile-search-bar")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show mobile search/i })).toHaveAttribute("aria-pressed", "false");
  });
});
