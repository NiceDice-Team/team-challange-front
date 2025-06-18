import Image from "next/image";
import Link from "next/link";
import Placeholder from "../../../public/700x700.svg";
import pig_img from "../../../public/pig.jpg";
import NEW_GAME1_IMG from "../../../public/New_Arrivals/New_arrivals_1.png";
import NEW_GAME2_IMG from "../../../public/New_Arrivals/New_arrivals_2.png";
import NEW_GAME3_IMG from "../../../public/New_Arrivals/New_arrivals_3.png";
import NEW_GAME4_IMG from "../../../public/New_Arrivals/New_arrivals_4.png";

export default function NewArrivals() {
  // Caption helper function inside the main component
  const Caption = ({ label }) => (
    <div className="mt-4 text-sm">
      <p className="font-semibold">{label}</p>
      <p className="text-[#494791]">
        Shop now <span className="inline-block ml-1">→</span>
      </p>
    </div>
  );

  return (
    <section className="mb-25 px-8  lg:px-50">
      <div className="flex gap-6 justify-center">
        <div className="w-[648px]">
          {/*  Left Card */}
          <Link href="/products/new-arrivals" className="flex h-[648px] flex-col">
            <div className="relative flex-grow overflow-hidden">
              <Image src={NEW_GAME2_IMG} alt="" fill className="object-cover" />
              <span className="absolute top-6 left-6 bg-white px-4 py-2 text-title font-medium text-[#494791]">
                NEW ARRIVALS
              </span>
            </div>
            <Caption label="NEW ARRIVALS" />
          </Link>
        </div>

        {/* RIGHT Card*/}
        <div className="flex w-[648px] flex-col gap-6">
          <div className="flex gap-6">
            {/* First Right Card */}
            <Link href="/products/bestsellers" className="flex h-[312px] flex-1 flex-col">
              <div className="relative flex-grow overflow-hidden">
                <Image src={NEW_GAME1_IMG} alt="" fill className="object-cover" />
              </div>
              <Caption label="BESTSELLERS" />
            </Link>

            {/* Second Right Card */}
            <Link href="/products/sale" className="flex h-[312px] flex-1 flex-col">
              <div className="relative flex-grow overflow-hidden">
                <Image src={NEW_GAME3_IMG} alt="" fill className="object-cover" />
              </div>
              <Caption label="SALE" />
            </Link>
          </div>

          {/* Right Bottom Card */}
          <Link href="/products/board-games" className="flex h-[312px] w-full flex-col">
            <div className="relative flex-grow overflow-hidden">
              <Image src={NEW_GAME4_IMG} alt="" fill className="object-cover" />
            </div>
            <Caption label="BOARD GAMES" />
          </Link>
        </div>
      </div>
    </section>
  );
}
