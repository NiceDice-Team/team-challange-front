import ARROW_IMG from "../../../public/Features/arrow.png";
import LOCK_IMG from "../../../public/Features/lock.png";
import PHONE_IMG from "../../../public/Features/phone.png";

import Image from "next/image";

export default function FeatureSection() {
  return (
    <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
      <div className="flex flex-col sm:flex-row flex-wrap justify-around items-center gap-8 sm:gap-6 md:gap-8 lg:gap-10 w-full text-center text-pretty bg-[#494791] text-white py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={ARROW_IMG} alt="Car icon" className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">24-Hour Fast Shipping</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">Get your games delivered quickly and safely</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={LOCK_IMG} alt="Lock icon" className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">Secure Payment</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">
            Shop with confidence, using trusted payment methods
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
            <Image src={PHONE_IMG} alt="Arrows  icon" className="w-full h-full" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-1">Easy Returns and Exchanges</h3>
          <p className="text-xs sm:text-sm md:text-base text-pretty">Hassle-free shopping experience</p>
        </div>
      </div>
    </section>
  );
}
