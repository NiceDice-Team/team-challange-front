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

export default function PartnersScroller() {
  return (
    <section className="w-full group flex flex-col gap-2 lg:gap-10 px-8  lg:px-50">
      <h2 className="uppercase text-lg lg:text-title">Our Trusted Brands & Partners</h2>

      <div
        className="flex relative overflow-hidden w-full mx-auto group py-4  
        before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-6
        before:bg-gradient-to-r before:from-background before:to-transparent before:content-[''] 
        after:absolute after:right-0 after:top-0 after:h-full after:w-6 
        after:bg-gradient-to-l after:from-background after:to-transparent after:content-['']"
      >
        <div className="flex gap-16 items-center justify-center animate-infiniteScroll will-change-transform shrink-0 pr-16">
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="flex items-center justify-center">
              <Image
                src={partner.src}
                alt={partner.alt}
                width={88}
                height={88}
                className=" object-contain"
                priority={partner.id <= 4}
              />
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="flex gap-16 items-center justify-center animate-infiniteScroll will-change-transform shrink-0 pr-16"
        >
          {PARTNERS.map((partner) => (
            <div key={`${partner.id}-duplicate-1`} className="flex items-center justify-center">
              <Image src={partner.src} alt={partner.alt} width={88} height={88} className=" object-contain" />
            </div>
          ))}
        </div>

        {/* <div
          aria-hidden="true"
          className="flex gap-16 items-center justify-center animate-infiniteScroll will-change-transform shrink-0 pr-16"
        >
          {PARTNERS.map((partner) => (
            <div key={`${partner.id}-duplicate-2`} className="flex items-center justify-center">
              <Image src={partner.src} alt={partner.alt} width={88} height={88} className=" object-contain" />
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
