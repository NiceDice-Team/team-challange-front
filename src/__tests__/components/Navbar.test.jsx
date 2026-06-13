import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/layout/Navbar";
import { MobileHeaderBreadcrumbs } from "@/components/catalog/ProductDetailMobileChrome";

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

    expect(screen.queryByTestId("language-selector")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open mobile menu/i }));

    const dialog = screen.getByRole("dialog", { name: /mobile menu/i });

    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("link", { name: /new arrival/i })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: /select language/i })).not.toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: /select language/i, hidden: true }).closest("[hidden]")).toBeInTheDocument();
    expect(within(dialog).getByTestId("mobile-search-bar")).toHaveTextContent("Search games");

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

  test("keeps mobile action icons from shrinking on narrow viewports", () => {
    render(<Navbar isPagination={false} enableMobileInlineSearch />);

    expect(screen.getByAltText("DICE DECKS Logo").parentElement).toHaveClass("min-w-0", "shrink");
    expect(screen.getByAltText("DICE DECKS Logo")).toHaveClass("h-auto", "w-[min(13.75rem,calc(100vw-13rem))]");
    expect(screen.getByRole("button", { name: /show mobile search/i })).toHaveClass("h-11", "w-11", "shrink-0");
    expect(screen.getByTestId("search-outline-icon")).toHaveClass("w-6", "h-6", "shrink-0");
    expect(screen.getByRole("link", { name: /profile/i })).toHaveClass("h-11", "w-11", "shrink-0");
    expect(screen.getByAltText("Profile")).toHaveClass("w-6", "h-6", "shrink-0");
    expect(screen.getByRole("button", { name: /open cart/i })).toHaveClass("h-11", "w-11", "shrink-0");
    expect(screen.getByAltText("Cart")).toHaveClass("w-6", "h-6", "shrink-0");
    expect(screen.getByRole("button", { name: /open mobile menu/i })).toHaveClass("h-11", "w-11", "shrink-0");
    expect(screen.getByAltText("Menu")).toHaveClass("w-6", "h-6", "shrink-0");
  });

  test("keeps the requested divider inside the mobile sticky header", () => {
    render(
      <Navbar
        hideMobilePaginationChrome
        showMobileDivider
      />
    );

    const divider = screen.getByTestId("navbar-divider");
    const navigationContainer = divider.parentElement;

    expect(divider).toHaveClass("border-[#A4A3C8]", "border-t", "mt-4", "w-full", "h-0");
    expect(navigationContainer).toHaveAttribute("data-mobile-pagination-hidden", "true");
    expect(navigationContainer).not.toHaveClass("hidden");
    expect(screen.queryByTestId("navbar-mobile-breadcrumb")).not.toBeInTheDocument();
  });

  test("renders mobile breadcrumbs outside the sticky navbar", () => {
    render(
      <MobileHeaderBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Board games", current: true },
        ]}
      />
    );

    expect(screen.getByTestId("navbar-mobile-breadcrumb")).toHaveTextContent("Home");
    expect(screen.getByTestId("navbar-mobile-breadcrumb")).toHaveTextContent("Board games");
    expect(screen.getByTestId("navbar-mobile-breadcrumb")).toHaveClass("px-4", "pt-6", "sm:hidden");
    expect(screen.getByTestId("navbar-mobile-breadcrumb-divider")).toHaveClass("mt-6", "h-0", "w-full", "border-t");
  });

  test("does not show the mobile divider when there are no mobile breadcrumbs", () => {
    render(<Navbar hideMobilePaginationChrome />);

    expect(screen.getByTestId("navbar-divider")).toHaveClass("hidden", "sm:block");
    expect(screen.queryByTestId("navbar-mobile-breadcrumb")).not.toBeInTheDocument();
  });
});
