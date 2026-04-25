"use client";

import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import {
  footerBrand,
  footerLegal,
  footerNewsletter,
  footerSections,
} from "@/components/layout/footerLinks";
import {
  LogoIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XTwitterIcon,
} from "@/svgs/icons";

export function ProductDetailMobileHeader() {
  return (
    <div className="sm:hidden px-4 pt-6">
      <Navbar hideMobilePaginationChrome />
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
            alt={footerBrand.name}
            width={220}
            height={36}
            className="h-9 w-auto self-start brightness-0 invert"
          />
          <p className="max-w-[309px] text-base leading-5">
            {footerBrand.description}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="text-base font-medium uppercase">{section.title}</h3>
              <ul className="flex flex-col gap-2 text-base">
                {section.links.map((item) => (
                  <li key={item.label}>{item.mobileLabel ?? item.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-[var(--color-light-purple-2)]" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium uppercase">{footerNewsletter.title}</h3>
            <p className="max-w-[324px] text-base leading-5">
              {footerNewsletter.description}
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
              <span>{footerNewsletter.consentLabel}</span>
            </label>
          </div>
        </div>

        <div className="h-px w-full bg-[var(--color-light-purple-2)]" />

        <p className="text-center text-base leading-5">
          {currentYear} {footerLegal.owner}. All rights reserved. {footerLegal.privacyLabel} | {footerLegal.termsLabel}
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
