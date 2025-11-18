"use client";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { useUserStore } from "@/store/user";
import { LogoIcon, SearchIcon, ProfileIcon, CartIcon } from "@/svgs/icons";
import { useState, useEffect } from "react";
import CartDropdown from "@/components/cart/CartDropdown";
import { useCartSummary } from "@/hooks/useCartQuery";
import { getTokens } from "@/lib/tokenManager";
import decodeToken from "@/lib/decodeToken";

export default function Navbar({isPagination = true}) {
  const { userData } = useUserStore((state) => state);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCartSummary();
  const { refreshToken } = getTokens();

  useEffect(() => {
    if (!userData && refreshToken) {
      decodeToken(refreshToken);
    }
  }, [userData, refreshToken]);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
          <Link href="/" className="flex-shrink-0">
            <img src={LogoIcon} alt="DICE DECKS Logo" className="w-auto h-8 sm:h-10 md:h-12" />
          </Link>
          <form
            className="hidden sm:flex flex-row flex-1 justify-between items-center p-1 border border-[#494791] max-w-xs md:max-w-md lg:max-w-lg mx-2 md:mx-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const searchQuery = formData.get("search");
              if (searchQuery.trim()) {
                window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
          >
            <input
              type="search"
              name="search"
              id="default-search"
              className="ml-1 outline-[#494791] outline-0 w-full text-sm md:text-base"
              placeholder="Search games..."
            />
            <button className="bg-[#494791] hover:bg-[#4a479170] p-1 rounded-[2px]" type="submit">
              <img src={SearchIcon} alt="Search" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
          <div className="flex flex-row items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Language Selector */}
            <LanguageSelector />
            {/* Profile Logo */}
            <Link
              href={userData ? "/profile" : "/login"}
              className="flex flex-col items-center gap-1 hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer"
            >
              <img src={ProfileIcon} alt="Profile" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={handleCartToggle}
                className="flex justify-center items-center hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer"
              >
                <img src={CartIcon} alt="Cart" className="w-5 h-5 sm:w-6 sm:h-6" />
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
          </div>
        </div>
        
        {/* Navigation list */}
        {isPagination && (
          <div className="mt-4 sm:mt-5 md:mt-6">
            <ul className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 text-xs sm:text-sm md:text-base lg:text-lg uppercase">
              <li>
                <Link href="/catalog?categories=1" className="hover:text-[#494791] transition-colors cursor-pointer">
                  new arrivals
                </Link>
              </li>
              <li>
                <Link href="/catalog?categories=2" className="hover:text-[#494791] transition-colors cursor-pointer">
                  bestsellers
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-[#494791] transition-colors cursor-pointer">
                  board games
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?categories=4"
                  className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  sale
                </Link>
              </li>
              <li>
                <Link href="/catalog?categories=5" className="hover:text-[#494791] transition-colors cursor-pointer">
                  coming soon
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-[#494791] transition-colors cursor-pointer">
                  reviews
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#494791] transition-colors cursor-pointer">
                  about
                </Link>
              </li>
            </ul>
            <div className="bg-[#494791] mt-3 w-full h-px"></div>
          </div>
        )}
      </div>

      {/* Cart Dropdown */}
      <CartDropdown isOpen={isCartOpen} onClose={handleCloseCart} />
    </div>
  );
}
