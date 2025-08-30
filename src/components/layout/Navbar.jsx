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
import { useAuthStore } from "@/store/auth";

export default function Navbar({isPagination = true}) {
  const { userData, fetchUserData } = useUserStore((state) => state);
  const { userId } = useAuthStore((state) => state);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCartSummary();

  useEffect(() => {
    const { refreshToken } = getTokens();
    if (!userData && refreshToken) {
      if (userId) {
        fetchUserData(userId);
        return;
      } else {
        decodeToken(refreshToken);
      }
    }
  }, [userId, userData, fetchUserData]);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="flex flex-col ">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="flex flex-row justify-between items-center gap-2 lg:gap-0">
          <div className="">
            <img src={LogoIcon} alt="DICE DECKS Logo" className="h-auto w-auto" />
          </div>
          <form
            className="flex flex-row flex-1 justify-between items-center p-1 border-[#494791] border max-w-lg"
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
              className="ml-1 outline-[#494791] outline-0 w-full"
              placeholder="Search games..."
            />
            <button className="p-1 rounded-[2px] bg-[#494791] hover:bg-[#4a479170]" type="submit">
              <img src={SearchIcon} alt="Search" className="h-6 w-6" />
            </button>
          </form>
          <div className="flex flex-row items-center gap-1 lg:gap-4">
            {/* Language Selector */}
            <LanguageSelector />
            {/* Profile Logo */}
            <Link
              href={userData ? "/profile" : "/login"}
              className="flex flex-col items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <img src={ProfileIcon} alt="Profile" className="h-6 w-6" />
              <p className="text-xs">{userData?.first_name}</p>
            </Link>
            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={handleCartToggle}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
              >
                <img src={CartIcon} alt="Cart" className="h-6 w-6" />
                {itemCount > 0 && (
                  <span
                    key={itemCount} // This triggers re-render with animation on count change
                    className="absolute -top-2 -right-2 bg-[#494791] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-bounce transition-all duration-300 ease-out"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
        </div>
        {/* Navigation list */}
        {isPagination && (
          <div className="mt-6">
            <ul className="flex flex-row flex-wrap justify-center gap-4 lg:gap-14 text-sm lg:text-lg uppercase">
              <li>
                <Link href="/catalog?categories=1" className="cursor-pointer hover:text-[#494791] transition-colors">
                  new arrivals
                </Link>
              </li>
              <li>
                <Link href="/catalog?categories=2" className="cursor-pointer hover:text-[#494791] transition-colors">
                  bestsellers
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="cursor-pointer hover:text-[#494791] transition-colors">
                  board games
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?categories=4"
                  className="text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                >
                  sale
                </Link>
              </li>
              <li>
                <Link href="/catalog?categories=5" className="cursor-pointer hover:text-[#494791] transition-colors">
                  coming soon
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="cursor-pointer hover:text-[#494791] transition-colors">
                  reviews
                </Link>
              </li>
              <li>
                <Link href="/#about" className="cursor-pointer hover:text-[#494791] transition-colors">
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
