import React from "react";
import { CustomInput } from "../shared/CustomInput";
import { CustomButton } from "../shared/CustomButton";

export default function SubscribeSection({ className = "" }) {
  return (
    <div
      className={`${className}px-4 md:px-0 w-full py-22  flex flex-col items-center justify-center bg-[#494791] text-white`}
    >
      <h2 className="uppercase text-center text-lg lg:text-3xl mb-8 font-semibold">
        Stay Updated & Get Exclusive Deals!
      </h2>

      <p className="text-sm  lg:text-lg text-pretty max-w-xl text-center mb-6">
        Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news
      </p>
      <div className="flex flex-col w-full max-w-3xl gap-3 items-center">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <CustomInput type="email" placeholder="Email" />
          <CustomButton className="h-12 w-38"> Subscribe</CustomButton>
        </div>

        <div className="flex items-center gap-2 self-start max-w-4xl">
          <input
            type="checkbox"
            id="marketing-consent"
            name="marketing-consent"
            className="h-5 w-5 border-2 accent-white cursor-pointer"
          />
          <label htmlFor="marketing-consent" className="text-sm md:text-base cursor-pointer">
            I agree to receiving marketing emails and special deals
          </label>
        </div>
      </div>
    </div>
  );
}
