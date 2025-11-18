import Image from "next/image";
import Link from "next/link";
import Placeholder from "../../../public/700x700.svg";
import pig_img from "../../../public/pig.jpg";
import NEW_GAME1_IMG from "../../../public/New_Arrivals/New_arrivals_1.png";
import NEW_GAME2_IMG from "../../../public/New_Arrivals/New_arrivals_2.png";
import NEW_GAME3_IMG from "../../../public/New_Arrivals/New_arrivals_3.png";
import NEW_GAME4_IMG from "../../../public/New_Arrivals/New_arrivals_4.png";

interface CaptionProps {
  label: string;
}

export default function NewArrivals() {
  // Caption helper function inside the main component
  const Caption = ({ label }: CaptionProps) => (
    <div className="mt-4 text-sm">
      <p className="font-semibold">{label}</p>
      <p className="text-[#494791]">
        Shop now <span className="inline-block ml-1">→</span>
      </p>
    </div>
  );

  return (
    <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-[1320px] mx-auto">
        {/* Left Card - NEW ARRIVALS */}
        <div className="w-full">
          <Link href="/products/new-arrivals" className="flex flex-col h-64 sm:h-80 md:h-[400px] lg:h-[500px] xl:h-[648px]">
            <div className="relative flex-grow overflow-hidden">
              <Image src={NEW_GAME2_IMG} alt="New Arrivals" fill className="object-cover object-left" />
              <span className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-[#494791]">
                NEW ARRIVALS
              </span>
            </div>
            <Caption label="NEW ARRIVALS" />
          </Link>
        </div>

        {/* Right Cards Container */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 sm:gap-5 md:gap-6">
          {/* Top Row on Desktop / Stacked on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* BESTSELLERS Card */}
            <Link href="/products/bestsellers" className="flex flex-col h-48 sm:h-36 md:h-40 lg:h-48 xl:h-[312px]">
              <div className="relative flex-grow overflow-hidden">
                <Image src={NEW_GAME1_IMG} alt="Bestsellers" fill className="object-cover" />
              </div>
              <Caption label="BESTSELLERS" />
            </Link>

            {/* SALE Card */}
            <Link href="/products/sale" className="flex flex-col h-48 sm:h-36 md:h-40 lg:h-48 xl:h-[312px]">
              <div className="relative flex-grow overflow-hidden">
                <Image src={NEW_GAME3_IMG} alt="Sale" fill className="object-cover" />
              </div>
              <Caption label="SALE" />
            </Link>
          </div>

          {/* BOARD GAMES Card */}
          <Link href="/products/board-games" className="flex w-full flex-col h-48 sm:h-40 md:h-44 lg:h-52 xl:h-[312px]">
            <div className="relative flex-grow overflow-hidden">
              <Image src={NEW_GAME4_IMG} alt="Board Games" fill className="object-cover" />
            </div>
            <Caption label="BOARD GAMES" />
          </Link>
        </div>
      </div>
    </section>
  );
}
