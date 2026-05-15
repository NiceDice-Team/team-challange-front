import { cn } from "@/lib/utils";
import { CustomInput } from "../shared/CustomInput";
import { CustomButton } from "../shared/CustomButton";

interface SubscribeSectionProps {
  className?: string;
  variant?: "default" | "homeDesktop";
}

export default function SubscribeSection({
  className = "",
  variant = "default",
}: SubscribeSectionProps) {
  if (variant === "homeDesktop") {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center gap-2.5 bg-[#494791] px-6 py-20 text-white md:px-16 lg:px-[180px] lg:py-28 2xl:px-[300px]",
          className
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

            <div className="flex w-full max-w-[600px] flex-col items-start gap-[14px]">
              <div className="flex h-12 w-full items-center gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 w-full max-w-[424px] border-0 bg-[#EAEAEA] p-4 text-base leading-[19px] text-black placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />

                <button
                  type="button"
                  className="flex h-12 w-[152px] shrink-0 items-center justify-center gap-2.5 bg-[var(--color-orange)] px-8 py-4 text-base font-medium leading-[19px] uppercase text-white"
                >
                  Subscribe
                </button>
              </div>

              <label className="flex w-full max-w-[433px] items-start gap-2 text-base leading-[19px]">
                <input
                  type="checkbox"
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none border border-white bg-transparent checked:bg-white focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <span className="w-[405px] text-center">I agree to receiving marketing emails and special deals</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full bg-[#494791] px-4 py-22 text-white md:px-0 flex flex-col items-center justify-center",
        className
      )}
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
          <CustomButton className="h-12 w-38">Subscribe</CustomButton>
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
