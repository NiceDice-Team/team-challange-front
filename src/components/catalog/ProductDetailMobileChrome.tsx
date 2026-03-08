"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CartDropdown from "@/components/cart/CartDropdown";
import { useCartSummary } from "@/hooks/useCartQuery";
import { getTokens } from "@/lib/tokenManager";
import decodeToken from "@/lib/decodeToken";
import { useUserStore } from "@/store/user";
import {
  BurgerMenuIcon,
  CartIcon,
  LogoIcon,
  PoshukovaLupaIcon,
  ProfileIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XTwitterIcon,
} from "@/svgs/icons";

export function ProductDetailMobileHeader() {
  const { userData } = useUserStore((state) => state);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCartSummary();
  const { refreshToken } = getTokens();

  useEffect(() => {
    if (!userData && refreshToken) {
      decodeToken(refreshToken);
    }
  }, [userData, refreshToken]);

  return (
    <div className="sm:hidden px-4 pt-6">
      <div className="mx-auto flex max-w-[396px] flex-col gap-6">
        <div className="rounded-lg bg-[rgba(252,251,249,0.3)] py-4 backdrop-blur-[5px]">
          <div className="flex h-11 w-full items-center justify-between">
            <Link href="/" className="flex h-9 w-[220px] shrink-0 items-center">
              <Image src={LogoIcon} alt="Dice & Decks" width={220} height={36} className="h-9 w-auto" priority />
            </Link>

            <div className="flex h-11 w-44 shrink-0 items-center">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Search"
              >
                <Image src={PoshukovaLupaIcon} alt="" width={24} height={24} className="h-6 w-6" />
              </button>

              <Link
                href={userData ? "/profile" : "/login"}
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Profile"
              >
                <Image src={ProfileIcon} alt="" width={24} height={24} className="h-6 w-6" />
              </Link>

              <div className="relative h-11 w-11">
                <button
                  type="button"
                  onClick={() => setIsCartOpen((prev) => !prev)}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Cart"
                >
                  <Image src={CartIcon} alt="" width={24} height={24} className="h-6 w-6" />
                </button>

                {itemCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-purple)] px-1 text-[10px] font-medium text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Menu"
              >
                <Image src={BurgerMenuIcon} alt="" width={24} height={24} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[var(--color-light-purple-2)]" />
      </div>

      <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export function ProductDetailMobileFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sm:hidden mt-10 bg-[var(--color-purple)] px-4 py-5 text-white">
      <div className="mx-auto flex max-w-[396px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Image
            src={LogoIcon}
            alt="Dice & Decks"
            width={220}
            height={36}
            className="h-9 w-auto self-start brightness-0 invert"
          />
          <p className="max-w-[309px] text-base leading-5">
            Your trusted online gaming destination with quality dice, cards, and board games
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium uppercase">Products</h3>
            <ul className="flex flex-col gap-2 text-base">
              <li>New arrivals</li>
              <li>Bestsellers</li>
              <li>Board games</li>
              <li>Coming soon</li>
              <li>Sale</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium uppercase">Clients</h3>
            <ul className="flex flex-col gap-2 text-base">
              <li>Blog</li>
              <li>Reviews</li>
              <li>Shipping</li>
              <li>Returns</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium uppercase">Company</h3>
            <ul className="flex flex-col gap-2 text-base">
              <li>About</li>
              <li>Contact us</li>
              <li>Terms of service</li>
              <li>Privacy policy</li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-[var(--color-light-purple-2)]" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium uppercase">Stay Updated &amp; Get Exclusive Deals!</h3>
            <p className="max-w-[324px] text-base leading-5">
              Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="h-12 w-full border border-white bg-white px-4 text-base text-black placeholder:text-[var(--color-placeholder)] focus:outline-none"
            />

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center bg-[var(--color-orange)] px-8 text-base font-medium uppercase text-white"
            >
              Subscribe
            </button>

            <label className="flex items-start gap-2 text-base leading-5">
              <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 border border-white accent-white" />
              <span>I agree to receiving marketing emails and special deals</span>
            </label>
          </div>
        </div>

        <div className="h-px w-full bg-[var(--color-light-purple-2)]" />

        <p className="text-center text-base leading-5">
          {currentYear} Dice &amp; Decks. All rights reserved. Privacy Policy | Terms of Service
        </p>

        <div className="flex items-center justify-center gap-6">
          <InstagramIcon className="h-6 w-6" />
          <TikTokIcon className="h-6 w-6" />
          <FacebookIcon className="h-6 w-6" />
          <span className="brightness-0 invert">
            <XTwitterIcon className="h-6 w-6" />
          </span>
        </div>
      </div>
    </footer>
  );
}
