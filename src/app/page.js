import Footer from "@/components/Footer";
import HeroScroller from "@/components/HeroScroller";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="px-8 py-6  lg:py-6 lg:px-50  font-[family-name:var(--font-noto-sans)]">
      <div className="h-dvh mb-10 flex flex-col gap-4">
        <Navbar />
        <HeroScroller />
        <div className=" h-14"> </div>
      </div>
      <Footer />
    </div>
  );
}
