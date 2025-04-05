"use client";
import next from "next";
import { useEffect, useState, useRef } from "react";

export default function HeroScroller() {
  const scrollerData = [
    { id: 1, color: "bg-amber-300" },
    { id: 2, color: "bg-green-300" },
    { id: 3, color: "bg-red-300" },
    { id: 4, color: "bg-blue-300" },
  ];
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrollable, setIsScrollable] = useState(true);
  const scrollerRef = useRef(null);
  const directionRef = useRef(1);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function trackScroll() {
      const scrollLeft = scroller.scrollLeft; // Current scroll position
      const sectionWidth = scroller.clientWidth; // Width of each section
      const newIndex = Math.round(scrollLeft / sectionWidth); // Calculate the current section index

      setCurrentSection(newIndex);
    }
    trackScroll();
    scroller.addEventListener("scroll", trackScroll);
    return () => {
      scroller.removeEventListener("scroll", trackScroll);
    };
  }, []);
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
      const nextIndex = currentSection + directionRef.current;

      const sectionWidth = scroller.clientWidth; // Width of each section
      scroller.scrollTo({ left: sectionWidth * nextIndex, behavior: "smooth" });
      setCurrentSection(nextIndex);
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, [currentSection, scrollerData.length]);

  function handleLeftClick() {
    const newIndex = Math.max(0, currentSection - 1); // 0 or previous section
    const sectionWidth = scrollerRef.current.clientWidth; // Width of each section

    setIsScrollable(false);
    scrollerRef.current.scrollTo({ left: sectionWidth * newIndex, behavior: "smooth" });
  }
  function handleRightClick() {
    const newIndex = Math.min(scrollerData.length - 1, currentSection + 1); // max section or next section
    const sectionWidth = scrollerRef.current.clientWidth; // Width of each section
    setIsScrollable(false);

    scrollerRef.current.scrollTo({ left: sectionWidth * newIndex, behavior: "smooth" });
  }

  return (
    <div className="w-full flex-1 relative">
      <button
        onClick={handleLeftClick}
        className={`absolute left-0 top-1/2 z-10  rounded-full  shadow-lg transition-all duration-200 p-1 ml-2 lg:p-2 lg:ml-4 ${
          currentSection === 0 ? "bg-[#4a479189]" : "bg-[#494791]"
        }`}
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleRightClick}
        className={`absolute right-0 top-1/2 z-10   rounded-full  shadow-lg transition-all duration-200 p-1 mr-2  lg:p-2 lg:mr-4 ${
          currentSection === scrollerData.length - 1 ? "bg-[#4a479189]" : "bg-[#494791]"
        }`}
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div
        ref={scrollerRef}
        className="w-full h-full flex flex-row flex-nowrap overflow-x-scroll snap-x snap-mandatory no-scrollbar "
      >
        {scrollerData.map((item) => {
          return <div key={item.id} className={` shrink-0 w-full h-full snap-center snap-always ${item.color}`}></div>;
        })}
      </div>
    </div>
  );
}
