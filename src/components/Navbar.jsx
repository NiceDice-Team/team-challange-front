"use client";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between ">
        <h1>BOARD GAMES</h1>
        <div> Search bar</div>
        <div className="flex flex-row gap-4">
          {/* Language Selector */}
          <LanguageSelector />
          {/* Profile Logo */}
          <div>
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <path
                d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z"
                stroke="black"
                stroke-width="1.5"
              />
              <path
                d="M17 16.5C17 18.985 17 21 9 21C1 21 1 18.985 1 16.5C1 14.015 4.582 12 9 12C13.418 12 17 14.015 17 16.5Z"
                stroke="black"
                stroke-width="1.5"
              />
            </svg>
          </div>
          {/* Cart Logo */}
          <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 15H9M7.5 8.25V6.75C7.5 5.55653 7.97411 4.41193 8.81802 3.56802C9.66193 2.72411 10.8065 2.25 12 2.25C13.1935 2.25 14.3381 2.72411 15.182 3.56802C16.0259 4.41193 16.5 5.55653 16.5 6.75V8.25M3.75 8.25C3.55109 8.25 3.36032 8.32902 3.21967 8.46967C3.07902 8.61032 3 8.80109 3 9V19.125C3 20.5425 4.2075 21.75 5.625 21.75H18.375C19.7925 21.75 21 20.6011 21 19.1836V9C21 8.80109 20.921 8.61032 20.7803 8.46967C20.6397 8.32902 20.4489 8.25 20.25 8.25H3.75Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
