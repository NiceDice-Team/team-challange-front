"use client";
import LanguageSelector from "./LanguageSelector";
import Image from "next/image";
import Placeholder_Square from "../../../public/700x700.svg";
import Link from "next/link";
import { LogoIcon, SearchIcon, ProfileIcon, CartIcon } from "@/svgs/icons";

export default function Navbar({ className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-row items-center justify-between gap-2 lg:gap-0">
        <div className="">
          <img src={LogoIcon} alt="DICE DECKS Logo" className="h-auto w-auto" />
        </div>
        <form className="flex flex-row p-1 max-w-lg flex-1 justify-between items-center border-2 border-[#494791] ">
          <input
            type="search"
            id="default-search"
            className="ml-1 w-full outline-[#494791] outline-0"
            placeholder="Search games..."
          />
          <button className="p-1 rounded-[2px]  bg-[#494791] hover:bg-[#4a479170]" type="submit">
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
      <div className=" mt-6">
        <ul className="flex flex-row text-sm flex-wrap gap-4 justify-center   uppercase  lg:text-lg lg:gap-14">
          <li className="  cursor-pointer ">new arrivals</li>
          <li className="  cursor-pointer ">bestsellers</li>
          <li className="  cursor-pointer ">board games</li>
          <li className="  cursor-pointer  text-red-500">sale</li>
          <li className="  cursor-pointer ">comming soon</li>
          <li className="  cursor-pointer ">reviews</li>
          <li className="  cursor-pointer ">about</li>
        </ul>
        <div className="h-px w-full bg-[#494791] mt-3"></div>
      </div>
    </div>
  );
}
