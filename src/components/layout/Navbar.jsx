"use client";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { useUserStore } from "@/store/user";
import { LogoIcon, SearchIcon, ProfileIcon, CartIcon } from "@/svgs/icons";
import { useEffect } from "react";
import { getTokens } from "@/lib/tokenManager";
import decodeToken from "@/lib/decodeToken";
import { useAuthStore } from "@/store/auth";

export default function Navbar({isPagination = true}) {
  const {userData, fetchUserData} = useUserStore((state) => state);
  const {userId} = useAuthStore((state) => state);

   useEffect(() => {
    const {refreshToken} = getTokens()
    if (!userData && refreshToken) {
      if(userId) {
         fetchUserData(userId)
         return
      } else {
          decodeToken(refreshToken);
      }
    }
  }, [userId, userData, fetchUserData]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center gap-2 lg:gap-0">
        <div className="">
          <img src={LogoIcon} alt="DICE DECKS Logo" className="w-auto h-auto" />
        </div>
        <form className="flex flex-row flex-1 justify-between items-center p-1 border-[#494791] border-2 max-w-lg">
          <input
            type="search"
            id="default-search"
            className="ml-1 outline-[#494791] outline-0 w-full"
            placeholder="Search games..."
          />
          <button className="bg-[#494791] hover:bg-[#4a479170] p-1 rounded-[2px]" type="submit">
            <img src={SearchIcon} alt="Search" className="w-6 h-6" />
          </button>
        </form>
        <div className="flex flex-row gap-1 lg:gap-4">
          {/* Language Selector */}
          <LanguageSelector />
          {/* Profile Logo */}
          <Link href={userData ? "/profile" : "/login"} className="flex flex-col items-center gap-1 cursor-pointer">
            <img src={ProfileIcon} alt="Profile" className="w-auto h-6" />
          </Link>
          {/* Cart Logo */}
          <div>
            <img src={CartIcon} alt="Cart" className="w-6 h-6" />
          </div>
        </div>
      </div>
      {/* Pagination list */}
      {isPagination && (
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
        )}
    </div>
  );
}
