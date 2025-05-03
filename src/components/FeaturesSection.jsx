import CAR_IMG from "../../public/Features/car.png";
import LOCK_IMG from "../../public/Features/lock.png";
import ARROWS_IMG from "../../public/Features/arrows.png";

import Image from "next/image";

export default function FeatureSection() {
  return (
    <section className=" mb-25">
      <div className="flex flex-row flex-wrap justify-around items-center w-full text-center text-pretty">
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <Image src={CAR_IMG} width={64} height={64} alt="Car icon" />
          <h3 className="text-lg lg:text-2xl mt-1">24-Hour Fast Shipping</h3>
          <p className="text-sm lg:text-lg text-pretty max-w-3xl text-[#848484]">
            Get your games delivered quickly and safely
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <Image src={LOCK_IMG} width={64} height={64} alt="Lock icon" />
          <h3 className="text-lg lg:text-2xl mt-1">Secure Payment</h3>
          <p className="text-sm lg:text-lg text-pretty max-w-3xl text-[#848484]">
            Shop with confidence, using trusted payment methods
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <Image src={ARROWS_IMG} width={64} height={64} alt="Arrows  icon" />
          <h3 className="text-lg lg:text-2xl mt-1">Easy Returns and Exchanges</h3>
          <p className="text-sm lg:text-lg text-pretty max-w-3xl  text-[#848484]">Hassle-free shopping experience</p>
        </div>
      </div>
    </section>
  );
}
