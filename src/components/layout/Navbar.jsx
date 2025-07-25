"use client";
import LanguageSelector from "./LanguageSelector";
import Image from "next/image";
import Placeholder_Square from "../../../public/700x700.svg";
import logo from "../../../public/icons/Logo.svg";
import Link from "next/link";
import { useUserStore } from "@/store/user";


export default function Navbar() {
  const user = useUserStore((state) => state.userData);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center gap-2 lg:gap-0">
        <div className="">
          <Image src={logo} alt="logo" />
        </div>
        <form className="flex flex-row flex-1 justify-between items-center p-1 border-[#494791] border-2 max-w-lg">
          <input
            type="search"
            id="default-search"
            className="ml-1 outline-[#494791] outline-0 w-full"
            placeholder="Search games..."
          />
          <button className="bg-[#494791] hover:bg-[#4a479170] p-1 rounded-[2px]" type="submit">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.4456 2.186C10.0902 2.18612 8.75443 2.51037 7.54982 3.1317C6.34522 3.75303 5.30666 4.65342 4.5208 5.75776C3.73495 6.86209 3.22458 8.13835 3.03227 9.48005C2.83997 10.8217 2.97132 12.19 3.41534 13.4706C3.85937 14.7512 4.60321 15.9071 5.5848 16.8417C6.56639 17.7764 7.75727 18.4628 9.05808 18.8436C10.3589 19.2244 11.7319 19.2887 13.0626 19.0309C14.3933 18.7732 15.643 18.201 16.7076 17.362L20.3596 21.014C20.5482 21.1962 20.8008 21.297 21.063 21.2947C21.3252 21.2924 21.576 21.1872 21.7614 21.0018C21.9468 20.8164 22.052 20.5656 22.0542 20.3034C22.0565 20.0412 21.9557 19.7886 21.7736 19.6L18.1216 15.948C19.1096 14.6946 19.7247 13.1884 19.8967 11.6017C20.0686 10.0151 19.7904 8.41202 19.0938 6.9761C18.3972 5.54017 17.3105 4.32936 15.9579 3.48224C14.6053 2.63511 13.0415 2.1859 11.4456 2.186ZM4.94557 10.686C4.94557 8.9621 5.63039 7.3088 6.84937 6.08981C8.06836 4.87082 9.72166 4.186 11.4456 4.186C13.1695 4.186 14.8228 4.87082 16.0418 6.08981C17.2607 7.3088 17.9456 8.9621 17.9456 10.686C17.9456 12.4099 17.2607 14.0632 16.0418 15.2822C14.8228 16.5012 13.1695 17.186 11.4456 17.186C9.72166 17.186 8.06836 16.5012 6.84937 15.2822C5.63039 14.0632 4.94557 12.4099 4.94557 10.686Z"
                fill="white"
              />
            </svg>
          </button>
        </form>
        <div className="flex flex-row gap-1 lg:gap-4">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Profile Logo */}
          <Link 
            href={user ? "/profile" : "/login"} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <path
                d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z"
                stroke="black"
                strokeWidth="1.5"
              />
              <path
                d="M17 16.5C17 18.985 17 21 9 21C1 21 1 18.985 1 16.5C1 14.015 4.582 12 9 12C13.418 12 17 14.015 17 16.5Z"
                stroke="black"
                strokeWidth="1.5"
              />
            </svg>
            <p>{user?.first_name || "Profile"}</p>
          </Link>
          {/* Cart Logo */}
          <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 15H9M7.5 8.25V6.75C7.5 5.55653 7.97411 4.41193 8.81802 3.56802C9.66193 2.72411 10.8065 2.25 12 2.25C13.1935 2.25 14.3381 2.72411 15.182 3.56802C16.0259 4.41193 16.5 5.55653 16.5 6.75V8.25M3.75 8.25C3.55109 8.25 3.36032 8.32902 3.21967 8.46967C3.07902 8.61032 3 8.80109 3 9V19.125C3 20.5425 4.2075 21.75 5.625 21.75H18.375C19.7925 21.75 21 20.6011 21 19.1836V9C21 8.80109 20.921 8.61032 20.7803 8.46967C20.6397 8.32902 20.4489 8.25 20.25 8.25H3.75Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
