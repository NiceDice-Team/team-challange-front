"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactElement } from "react";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { showCustomToast } from "@/components/shared/Toast";
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

export default function MobileFooter(): ReactElement {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    if (!consentAccepted) {
      showCustomToast({
        type: "info",
        title: "Please confirm your subscription consent.",
        description: "Check the marketing emails consent box to subscribe.",
      });
      return;
    }

    showCustomToast({
      type: "success",
      title: "Thank you for subscribing!",
      description: "We will send updates and special deals to your email.",
    });
    setEmail("");
    setConsentAccepted(false);
  };

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
                  <li key={item.label}>
                    {item.isLinkable ? (
                      <Link href={item.href}>{item.mobileLabel ?? item.label}</Link>
                    ) : (
                      item.mobileLabel ?? item.label
                    )}
                  </li>
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

          <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-4">
            <p className="max-w-[324px] text-base leading-[19px]">
              {footerNewsletter.description}
            </p>

            <div className="flex w-full flex-col items-center justify-between gap-2">
              <div className="flex w-full flex-col justify-center gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 w-full border-0 bg-white p-4 text-base leading-[19px] text-black shadow-none placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2.5 bg-[var(--color-orange)] px-8 py-4 text-base font-medium leading-[19px] uppercase text-white transition-colors duration-150 hover:bg-[#FF5F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Subscribe
                </button>
              </div>

              <CustomCheckbox
                id="mobile-newsletter-consent"
                checked={consentAccepted}
                onCheckedChange={setConsentAccepted}
                variant="inverse"
                label={
                  <span>
                    {footerNewsletter.consentMobileLines.map((line, index) => (
                      <span key={line}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                }
              />
            </div>
          </form>
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
