"use client";
import { useEffect, useState, useRef } from "react";
import HERO_IMG1 from "../../../public/HeroScroller/HeroScroll1.png";
import HERO_IMG2 from "../../../public/HeroScroller/HeroScroll2.png";
import HERO_IMG3 from "../../../public/HeroScroller/HeroScroll3.png";
import Image from "next/image";

export default function HeroScroller() {
  const aspectRatio = 1320 / 704;

  const scrollerData = [
    {
      id: 1,
      image: HERO_IMG1,
      category: "NEW ARRIVALS",
      title: "Heat: Pedal to the metal - The ultimate racing board game!",
      description:
        "Experience the intensity of classic motorsport, where every turn, every decision, and every ounce of risk can make or break your victory.",
      buttonText: "BUY NOW",
    },
    {
      id: 2,
      image: HERO_IMG2,
      category: "BESTSELLERS",
      title: "CATAN – The legendary game of trading and expansion!",
      description:
        "Settle the island, trade resources, and outbuild your rivals in this classic strategy game of expansion and negotiation.",
      buttonText: "SHOP NOW",
    },
    {
      id: 3,
      image: HERO_IMG3,
      category: "COMING SOON",
      title: "Ticket to Ride – The classic game of railway adventure!",
      description:
        "Collect train cards, claim routes, and connect distant cities across the map. Build the most impressive rail network!",
      buttonText: "BUY NOW",
    },
  ];
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrollable, setIsScrollable] = useState(true);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const scrollerRef = useRef(null);
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
        const sectionWidth = scrollerRef.current.clientWidth; // Width of each section

        setIsScrollable(false);
        scrollerRef.current.scrollTo({ left: sectionWidth * newIndex, behavior: "smooth" });
      }, 300);
    }
  }

  function handleRightClick() {
    if (currentSection < scrollerData.length - 1) {
      // Hide the card before scrolling
      setIsCardVisible(false);

      setTimeout(() => {
        const newIndex = Math.min(scrollerData.length - 1, currentSection + 1); // max section or next section
        const sectionWidth = scrollerRef.current.clientWidth; // Width of each section
        setIsScrollable(false);

        scrollerRef.current.scrollTo({ left: sectionWidth * newIndex, behavior: "smooth" });
      }, 300);
    }
  }

  return (
    <section className="w-full h-full relative">
      {/* Aspect ratio container */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          paddingBottom: `min(${(1 / aspectRatio) * 100}%, 80vh)`, // Creates the aspect ratio with max height
        }}
      >
        {/* Dynamic info card */}
        <div
          className={`absolute bottom-10 right-20 z-10 bg-black/85 px-8 py-6 max-w-sm text-white transition-opacity duration-300 ${
            isCardVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="uppercase text-base text-[#FF5F00] mb-4">{scrollerData[currentSection].category}</h3>
          <h4 className="text-xl mb-3">{scrollerData[currentSection].title}</h4>
          <p className="text-lg mb-3">{scrollerData[currentSection].description}</p>
          <button className="bg-white text-slate-700 py-3 px-8 font-medium hover:bg-[#FF5F00]/80 hover:text-white transition-all duration-150">
            {scrollerData[currentSection].buttonText}
          </button>
        </div>

        <button
          onClick={handleLeftClick}
          className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-all duration-200 p-2 ${
            currentSection === 0 ? "bg-[#4a479189]" : "bg-[#494791]"
          }`}
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleRightClick}
          className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-all duration-200 p-2 ${
            currentSection === scrollerData.length - 1 ? "bg-[#4a479189]" : "bg-[#494791]"
          }`}
          aria-label="Next slide"
        >
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
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
