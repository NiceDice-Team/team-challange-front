"use client";
import LanguageSelector from "./LanguageSelector";
import Image from "next/image";
import logo from "../../../public/icons/logo.svg";
import Link from "next/link";
import { useUserStore } from "@/store/user";
import { LogoIcon, SearchIcon, ProfileIcon, CartIcon } from "@/svgs/icons";

export default function Navbar() {
  const user = useUserStore((state) => state.userData);

  return (
    <div className="flex flex-col">
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
        <div className="flex flex-row gap-1 lg:gap-4">
          {/* Language Selector */}
          <LanguageSelector />
          {/* Profile Logo */}
          <Link href="/login" className="cursor-pointer">
            <img src={ProfileIcon} alt="Profile" className="h-6 w-auto" />
          </Link>
          {/* Cart Logo */}
          <div>
            <img src={CartIcon} alt="Cart" className="h-6 w-6" />
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
  );
}
