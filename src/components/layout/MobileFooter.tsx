"use client";

import type React from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LogoFullIcon,
  TikTokIcon,
  XTwitterIcon,
} from "@/svgs/icons";
import {
  footerBrand,
  footerLegal,
  footerNewsletter,
  footerSections,
} from "./footerLinks";

export default function MobileFooter(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sm:hidden mt-10 bg-[var(--color-purple)] px-4 py-5 text-white">
      <div className="mx-auto flex max-w-[396px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <LogoFullIcon className="h-9 w-auto self-start" />
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

        <div className="flex w-full flex-col items-center gap-6">
          <h3 className="w-full text-base font-medium leading-6 uppercase">
            {footerNewsletter.title}
          </h3>

          <div className="flex w-full flex-col items-start gap-4">
            <p className="max-w-[324px] text-base leading-[19px]">
              {footerNewsletter.description}
            </p>

            <div className="flex w-full flex-col items-center justify-between gap-2">
              <div className="flex w-full flex-col justify-center gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 w-full border-0 bg-white p-4 text-base leading-[19px] text-black shadow-none placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />

                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2.5 bg-[var(--color-orange)] px-8 py-4 text-base font-medium leading-[19px] uppercase text-white"
                >
                  Subscribe
                </button>
              </div>

              <label className="flex w-full max-w-[390px] items-start gap-2 text-base leading-[19px]">
                <input
                  type="checkbox"
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none border border-white bg-transparent checked:bg-white focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <span>
                  {footerNewsletter.consentMobileLines.map((line, index) => (
                    <span key={line}>
                      {index > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
              </label>
            </div>
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
