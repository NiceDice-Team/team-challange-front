import Footer from "@/components/Footer";
import HeroScroller from "@/components/HeroScroller";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="py-6 px-50  font-[family-name:var(--font-geist-sans)]">
      <div className="h-dvh mb-10 flex flex-col gap-4">
        <Navbar />
        <HeroScroller />
      </div>
      <Footer />
    </div>
  );
}
