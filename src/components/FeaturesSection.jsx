import ARROW_IMG from "../../public/Features/arrow.png";
import LOCK_IMG from "../../public/Features/lock.png";
import PHONE_IMG from "../../public/Features/phone.png";

import Image from "next/image";

export default function FeatureSection() {
  return (
    <section className=" mb-25 ">
      <div className="flex flex-row flex-wrap justify-around items-center w-full text-center text-pretty bg-[#494791] text-white py-10 px-8  lg:px-50">
        <div className="flex flex-col items-center justify-center gap-2 max-w-80 ">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src={ARROW_IMG} alt="Car icon" />
          </div>
          <h3 className="text-lg lg:text-2xl mt-1">24-Hour Fast Shipping</h3>
          <p className="text-sm lg:text-base text-pretty max-w-3xl ">Get your games delivered quickly and safely</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src={LOCK_IMG} alt="Lock icon" />
          </div>
          <h3 className="text-lg lg:text-2xl mt-1">Secure Payment</h3>
          <p className="text-sm lg:text-base text-pretty max-w-3xl ">
            Shop with confidence, using trusted payment methods
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src={PHONE_IMG} alt="Arrows  icon" />
          </div>
          <h3 className="text-lg lg:text-2xl mt-1">Easy Returns and Exchanges</h3>
          <p className="text-sm lg:text-base text-pretty max-w-3xl  ">Hassle-free shopping experience</p>
        </div>
      </div>
    </section>
  );
}
