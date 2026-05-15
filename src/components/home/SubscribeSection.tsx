"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { CustomInput } from "../shared/CustomInput";
import { CustomButton } from "../shared/CustomButton";
import CustomCheckbox from "../shared/CustomCheckbox";
import { showCustomToast } from "../shared/Toast";

interface SubscribeSectionProps {
  className?: string;
  variant?: "default" | "homeDesktop";
}

export default function SubscribeSection({ className = "", variant = "default" }: SubscribeSectionProps) {
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

  if (variant === "homeDesktop") {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center gap-2.5 bg-[#494791] px-6 py-20 text-white md:px-16 lg:px-[180px] lg:py-28 2xl:px-[300px]",
          className,
        )}
      >
        <div className="flex w-full max-w-[766px] flex-col items-center gap-8">
          <h2 className="w-full text-center text-3xl font-normal leading-[150%] uppercase md:text-[40px]">
            Stay Updated & Get Exclusive Deals!
          </h2>

          <div className="flex w-full max-w-[600px] flex-col items-center gap-8">
            <p className="max-w-[447px] text-center text-base leading-[19px]">
              Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news
            </p>

            <form onSubmit={handleSubmit} className="flex w-full max-w-[600px] flex-col items-start gap-[14px]">
              <div className="flex h-12 w-full items-center gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 w-full max-w-[424px] border-0 bg-[#EAEAEA] p-4 text-base leading-[19px] text-black placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />

                <button
                  type="submit"
                  className="flex h-12 w-[152px] shrink-0 items-center justify-center gap-2.5 bg-[var(--color-orange)] px-8 py-4 text-base font-medium leading-[19px] uppercase text-white transition-colors duration-150 hover:bg-[#FF5F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Subscribe
                </button>
              </div>

              <CustomCheckbox
                id="home-newsletter-consent"
                checked={consentAccepted}
                onCheckedChange={setConsentAccepted}
                variant="inverse"
                label={
                  <span className="block w-[405px] text-center">
                    I agree to receiving marketing emails and special deals
                  </span>
                }
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full bg-[#494791] px-4 py-22 text-white md:px-0 flex flex-col items-center justify-center",
        className,
      )}
    >
      <h2 className="uppercase text-center text-lg lg:text-3xl mb-8 font-semibold">
        Stay Updated & Get Exclusive Deals!
      </h2>

      <p className="text-sm  lg:text-lg text-pretty max-w-xl text-center mb-6">
        Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-3xl gap-3 items-center">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <CustomInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <CustomButton type="submit" className="h-12 w-38">
            Subscribe
          </CustomButton>
        </div>

        <div className="self-start">
          <CustomCheckbox
            id="newsletter-consent"
            checked={consentAccepted}
            onCheckedChange={setConsentAccepted}
            variant="inverse"
            label="I agree to receiving marketing emails and special deals"
          />
        </div>
      </form>
    </div>
  );
}
