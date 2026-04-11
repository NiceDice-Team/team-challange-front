"use client";
import LanguageSelector from "./LanguageSelector";
import MobileMenuOverlay from "./MobileMenuOverlay";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user";
import { LogoIcon, ProfileIcon, CartIcon, BurgerMenuIcon, CloseIcon, SearchOutlineIcon } from "@/svgs/icons";
import { useState, useEffect, useRef } from "react";
import CartDropdown from "@/components/cart/CartDropdown";
import { useCartSummary } from "@/hooks/useCartQuery";
import { getTokens } from "@/lib/tokenManager";
import decodeToken from "@/lib/decodeToken";
import SearchBar from "@/components/shared/SearchBar";
import { cn } from "@/lib/utils";
import { navigationLinks } from "./navigationLinks";

export default function Navbar({ isPagination = true, hideMobilePaginationChrome = false, enableMobileInlineSearch = false }) {
  const { userData } = useUserStore((state) => state);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileInlineSearchOpen, setIsMobileInlineSearchOpen] = useState(false);
  const [mobileMenuTopOffset, setMobileMenuTopOffset] = useState(0);
  const { itemCount } = useCartSummary();
  const { refreshToken } = getTokens();
  const pathname = usePathname();
  const mobileHeaderRef = useRef(null);

  useEffect(() => {
    if (!userData && refreshToken) {
      decodeToken(refreshToken);
    }
  }, [userData, refreshToken]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileInlineSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const handleViewportChange = (event) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
        setIsMobileInlineSearchOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const updateMobileMenuOffset = () => {
      const headerBounds = mobileHeaderRef.current?.getBoundingClientRect();

      if (!headerBounds) return;

      setMobileMenuTopOffset(headerBounds.bottom);
    };

    updateMobileMenuOffset();
    window.addEventListener("resize", updateMobileMenuOffset);
    window.addEventListener("orientationchange", updateMobileMenuOffset);

    return () => {
      window.removeEventListener("resize", updateMobileMenuOffset);
      window.removeEventListener("orientationchange", updateMobileMenuOffset);
    };
  }, [isMobileMenuOpen]);

  const getMobileHeaderBottom = () => {
    const headerBounds = mobileHeaderRef.current?.getBoundingClientRect();
    return headerBounds?.bottom ?? 0;
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
    setIsMobileMenuOpen(false);
    setIsMobileInlineSearchOpen(false);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleOpenMobileMenu = () => {
    setIsCartOpen(false);
    setIsMobileInlineSearchOpen(false);
    setMobileMenuTopOffset(getMobileHeaderBottom());
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleToggleMobileSearch = () => {
    if (!enableMobileInlineSearch) return;

    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileInlineSearchOpen((currentState) => !currentState);
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1320px]">
        <div ref={mobileHeaderRef} className="flex flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
          <Link href="/" className="flex-shrink-0">
            <img src={LogoIcon} alt="DICE DECKS Logo" className="w-auto h-8 sm:h-10 md:h-12" />
          </Link>
          <SearchBar className="hidden sm:flex flex-1 max-w-xs md:max-w-md lg:max-w-lg mx-2 md:mx-4" />
          <div className="flex flex-row items-center gap-2 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Mobile Search Icon */}
            <button
              type="button"
              className={cn(
                "sm:hidden flex justify-center items-center p-1 rounded transition-colors cursor-pointer",
                enableMobileInlineSearch && isMobileInlineSearchOpen ? "text-[var(--color-purple)]" : "text-black"
              )}
              aria-label={enableMobileInlineSearch ? (isMobileInlineSearchOpen ? "Hide mobile search" : "Show mobile search") : "Search"}
              aria-pressed={enableMobileInlineSearch ? isMobileInlineSearchOpen : undefined}
              onClick={handleToggleMobileSearch}
            >
              <SearchOutlineIcon className="w-6 h-6" />
            </button>
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            {/* Profile Logo */}
            <Link
              href={userData ? "/profile" : "/login"}
              className="flex flex-col items-center gap-1 hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer"
            >
              <img src={ProfileIcon} alt="Profile" className="w-6 h-6" />
            </Link>
            {/* Cart Button */}
            <div className="relative">
              <button
                type="button"
                onClick={handleCartToggle}
                aria-label="Open cart"
                className="flex justify-center items-center hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer"
              >
                <img src={CartIcon} alt="Cart" className="w-6 h-6" />
                {itemCount > 0 && (
                  <span
                    key={itemCount} // This triggers re-render with animation on count change
                    className="-top-2 -right-2 absolute flex justify-center items-center bg-[#494791] rounded-full w-5 h-5 font-medium text-white text-xs transition-all animate-bounce duration-300 ease-out"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
            {/* Mobile Menu Icon */}
            <button
              type="button"
              className="sm:hidden flex justify-center items-center hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              onClick={isMobileMenuOpen ? handleCloseMobileMenu : handleOpenMobileMenu}
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
              ) : (
                <img src={BurgerMenuIcon} alt="Menu" className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {enableMobileInlineSearch && isMobileInlineSearchOpen && (
          <div className="mt-4 sm:hidden">
            <div className="mx-auto max-w-[392px]">
              <SearchBar
                variant="catalog-mobile"
                placeholder="Search games"
                className="w-full"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Navigation list */}
        {isPagination && (
          <div className={cn("mt-4 sm:mt-5 md:mt-6", hideMobilePaginationChrome && "hidden sm:block")}>
            <ul className="hidden sm:flex flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 text-xs sm:text-sm md:text-base lg:text-lg uppercase">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors cursor-pointer",
                      item.isSale ? "text-red-500 hover:text-red-600" : "hover:text-[#494791]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-[#A4A3C8] mt-4 sm:mt-3 w-full h-px"></div>
          </div>
        )}
      </div>

      {/* Cart Dropdown */}
      <CartDropdown isOpen={isCartOpen} onClose={handleCloseCart} />
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        topOffset={mobileMenuTopOffset}
        onClose={handleCloseMobileMenu}
      />
    </div>
  );
}
