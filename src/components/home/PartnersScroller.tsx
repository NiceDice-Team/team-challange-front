import Image from "next/image";
import CMON_IMG from "../../../public/Brands/brand_1.png";
import Ravensburger_IMG from "../../../public/Brands/brand_2.png";
import Mattel_IMG from "../../../public/Brands/brand_3.png";
import Hasbro_IMG from "../../../public/Brands/brand_4.png";
import Kosmos_IMG from "../../../public/Brands/brand_5.png";
import LuckyDuck_IMG from "../../../public/Brands/brand_6.png";
import FF_IMG from "../../../public/Brands/brand_7.png";
import Asmodee_IMG from "../../../public/Brands/brand_8.png";

const PARTNERS = [
  { src: CMON_IMG, alt: "CMON", id: 1 },
  { src: Ravensburger_IMG, alt: "Ravensburger", id: 2 },
  { src: Mattel_IMG, alt: "Mattel", id: 3 },
  { src: Hasbro_IMG, alt: "Hasbro", id: 4 },
  { src: Kosmos_IMG, alt: "Kosmos", id: 5 },
  { src: LuckyDuck_IMG, alt: "LuckyDuck", id: 6 },
  { src: FF_IMG, alt: "FF", id: 7 },
  { src: Asmodee_IMG, alt: "Asmodee", id: 8 },
];

const PARTNERS_SEGMENT = [...PARTNERS, ...PARTNERS];

function PartnersRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="flex gap-16 items-center shrink-0 pr-16" aria-hidden={duplicate || undefined}>
      {PARTNERS_SEGMENT.map((partner, index) => (
        <div
          key={duplicate ? `${partner.id}-dup-${index}` : `${partner.id}-${index}`}
          className="flex items-center justify-center"
        >
          <Image
            src={partner.src}
            alt={duplicate ? "" : partner.alt}
            width={88}
            height={88}
            className="object-contain"
            priority={!duplicate && index < 4}
          />
        </div>
      ))}
    </div>
  );
}

export default function PartnersScroller() {
  return (
    <section className="w-full group flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <h2 className="uppercase text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[40px]">Our Trusted Brands & Partners</h2>

      <div
        className="flex relative overflow-hidden w-full mx-auto py-4
        before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-6
        before:bg-gradient-to-r before:from-background before:to-transparent before:content-['']
        after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-6
        after:bg-gradient-to-l after:from-background after:to-transparent after:content-['']"
      >
        <div className="flex w-max animate-infiniteScroll will-change-transform">
          <PartnersRow />
          <PartnersRow duplicate />
        </div>
      </div>
    </section>
  );
}
