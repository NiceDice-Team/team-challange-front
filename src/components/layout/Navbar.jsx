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

export default function Navbar() {
  const { userData, fetchUserData } = useUserStore((state) => state);
  const { userId } = useAuthStore((state) => state);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCartSummary();

  useEffect(() => {
    if (!userData) {
      if (userId) {
        fetchUserData(userId);
        return;
      } else {
        const { refreshToken } = getTokens();
        if (refreshToken) {
          decodeToken(refreshToken);
        }
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
    <div className="flex flex-col px-8 lg:px-16">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="flex flex-row justify-between items-center gap-2 lg:gap-0">
          <div className="">
            <img src={LogoIcon} alt="DICE DECKS Logo" className="h-auto w-auto" />
          </div>
          <form className="flex flex-row flex-1 justify-between items-center p-1 border-[#494791] border-2 max-w-lg">
            <input
              type="search"
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
              <p className="text-xs">{userData?.first_name || "Sign in"}</p>
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
        </div>
        {/* Pagination list */}
        <div className="mt-6">
          <ul className="flex flex-row flex-wrap justify-center gap-4 lg:gap-14 text-sm lg:text-lg uppercase">
            <li className="cursor-pointer">new arrivals</li>
            <li className="cursor-pointer">bestsellers</li>
            <li className="cursor-pointer">board games</li>
            <li className="text-red-500 cursor-pointer">sale</li>
            <li className="cursor-pointer">comming soon</li>
            <li className="cursor-pointer">reviews</li>
            <li className="cursor-pointer">about</li>
          </ul>
          <div className="bg-[#494791] mt-3 w-full h-px"></div>
        </div>
      </div>

      {/* Cart Dropdown */}
      <CartDropdown isOpen={isCartOpen} onClose={handleCloseCart} />
    </div>
  );
}
