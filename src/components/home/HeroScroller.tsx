"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import HERO_IMG1 from "../../../public/HeroScroller/HeroScroll1.png";
import HERO_IMG2 from "../../../public/HeroScroller/HeroScroll2.png";
import HERO_IMG3 from "../../../public/HeroScroller/HeroScroll3.png";
import Image, { StaticImageData } from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/svgs/icons";

interface ScrollerItem {
  id: number;
  image: StaticImageData;
  category: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export const HERO_SCROLLER_ITEMS: ScrollerItem[] = [
  {
    id: 1,
    image: HERO_IMG1,
    category: "NEW ARRIVALS",
    title: "Heat: Pedal to the metal - The ultimate racing board game!",
    description:
      "Experience the intensity of classic motorsport, where every turn, every decision, and every ounce of risk can make or break your victory.",
    buttonText: "BUY NOW",
    buttonHref: "/catalog?search=Heat",
  },
  {
    id: 2,
    image: HERO_IMG2,
    category: "BESTSELLERS",
    title: "CATAN – The legendary game of trading and expansion!",
    description:
      "Settle the island, trade resources, and outbuild your rivals in this classic strategy game of expansion and negotiation.",
    buttonText: "SHOP NOW",
    buttonHref: "/product/7",
  },
  {
    id: 3,
    image: HERO_IMG3,
    category: "COMING SOON",
    title: "Ticket to Ride – The classic game of railway adventure!",
    description:
      "Collect train cards, claim routes, and connect distant cities across the map. Build the most impressive rail network!",
    buttonText: "BUY NOW",
    buttonHref: "/product/8",
  },
];

export default function HeroScroller() {
  const aspectRatio = 1320 / 700;
  const scrollerData = HERO_SCROLLER_ITEMS;
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrollable, setIsScrollable] = useState(true);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function trackScroll() {
      const scrollLeft = scroller.scrollLeft; // Current scroll position
      const sectionWidth = scroller.clientWidth; // Width of each section
      const newIndex = Math.round(scrollLeft / sectionWidth); // Calculate the current section index

      if (newIndex !== currentSection) {
        // Hide the card before changing section
        setIsCardVisible(false);

        // Set a timeout to show the card again with new content
        setTimeout(() => {
          setCurrentSection(newIndex);
          setIsCardVisible(true);
        }, 300); // Match this with the transition duration
      }
    }
    trackScroll();
    scroller.addEventListener("scroll", trackScroll);
    return () => {
      scroller.removeEventListener("scroll", trackScroll);
    };
  }, [currentSection]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (!isScrollable) return;
    const timer = setInterval(() => {
      if (currentSection >= scrollerData.length - 1) {
        directionRef.current = -1;
      }
      if (currentSection <= 0) {
        directionRef.current = 1;
      }

      // Hide the card before scrolling
      setIsCardVisible(false);

      setTimeout(() => {
        const nextIndex = currentSection + directionRef.current;
        const sectionWidth = scroller.clientWidth; // Width of each section
        scroller.scrollTo({ left: sectionWidth * nextIndex, behavior: "smooth" });
        setCurrentSection(nextIndex);

        // Show the card again with new content
        setTimeout(() => {
          setIsCardVisible(true);
        }, 300);
      }, 300);
    }, 10000); // 10 seconds
    return () => {
      clearInterval(timer);
    };
  }, [currentSection, scrollerData.length]);

  function handleLeftClick() {
    if (currentSection > 0) {
      // Hide the card before scrolling
      setIsCardVisible(false);

      setTimeout(() => {
        const newIndex = Math.max(0, currentSection - 1); // 0 or previous section
        const sectionWidth = scrollerRef.current?.clientWidth || 0; // Width of each section

        setIsScrollable(false);
        scrollerRef.current?.scrollTo({ left: sectionWidth * newIndex, behavior: "smooth" });
      }, 300);
    }
  }

  const isFirstSlide = currentSection === 0;
  const isLastSlide = currentSection === scrollerData.length - 1;

  function handleRightClick() {
    if (currentSection < scrollerData.length - 1) {
      // Hide the card before scrolling
      setIsCardVisible(false);

      setTimeout(() => {
        const newIndex = Math.min(scrollerData.length - 1, currentSection + 1); // max section or next section
        const sectionWidth = scrollerRef.current?.clientWidth || 0; // Width of each section
        setIsScrollable(false);

        scrollerRef.current?.scrollTo({ left: sectionWidth * newIndex, behavior: "smooth" });
      }, 300);
    }
  }

  return (
    <section className="w-full relative max-w-[1320px] mx-auto">
      {/* Aspect ratio container */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          aspectRatio: `${aspectRatio}`,
          maxHeight: "70vh",
        }}
      >
        {/* Dynamic info card */}
        <div
          className={`hidden sm:block absolute sm:bottom-6 sm:right-6 md:bottom-8 md:right-12 lg:bottom-10 lg:right-20 z-10 bg-black/85 sm:px-6 sm:py-5 md:px-8 md:py-6 sm:max-w-md md:max-w-lg lg:max-w-xl text-white transition-opacity duration-300 ${
            isCardVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="uppercase text-sm md:text-base text-[#FF5F00] mb-3 md:mb-4">
            {scrollerData[currentSection].category}
          </h3>
          <h4 className="text-lg md:text-xl lg:text-2xl mb-3 font-semibold leading-tight line-clamp-2">
            {scrollerData[currentSection].title}
          </h4>
          <p className="text-base md:text-lg mb-4 line-clamp-3">{scrollerData[currentSection].description}</p>
          <Link
            href={scrollerData[currentSection].buttonHref}
            className="inline-block w-auto bg-white px-6 py-2.5 text-base font-medium text-slate-700 transition-all duration-150 hover:bg-[#FF5F00]/80 hover:text-white md:px-8 md:py-3"
          >
            {scrollerData[currentSection].buttonText}
          </Link>
        </div>

        <button
          type="button"
          onClick={handleLeftClick}
          className={`absolute left-2 sm:left-3 md:left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#494791] shadow-lg transition-all duration-200 p-1.5 sm:p-2 hover:bg-[#5a57a8] ${
            isFirstSlide ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Previous slide"
          aria-hidden={isFirstSlide}
          tabIndex={isFirstSlide ? -1 : 0}
        >
          <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </button>
        <button
          type="button"
          onClick={handleRightClick}
          className={`absolute right-2 sm:right-3 md:right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#494791] shadow-lg transition-all duration-200 p-1.5 sm:p-2 hover:bg-[#5a57a8] ${
            isLastSlide ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Next slide"
          aria-hidden={isLastSlide}
          tabIndex={isLastSlide ? -1 : 0}
        >
          <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </button>
        <div
          ref={scrollerRef}
          className="absolute top-0 left-0 w-full h-full flex flex-row flex-nowrap overflow-x-scroll snap-x snap-mandatory no-scrollbar"
        >
          {scrollerData.map((item) => {
            return (
              <div key={item.id} className="shrink-0 w-full h-full snap-center snap-always relative">
                <Image
                  src={item.image}
                  alt={`Slide ${item.id}`}
                  fill
                  className="object-cover"
                  priority={item.id === 1}
                  sizes="100vw"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
