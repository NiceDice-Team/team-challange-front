import About from "@/components/About";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import HeroScroller from "@/components/HeroScroller";
import Navbar from "@/components/Navbar";
import NewArrivals from "@/components/NewArrivals";
import PartnersScroller from "@/components/PartnersScroller";
import ReviewSection from "@/components/ReviewSection";
import FeatureSection from "@/components/FeaturesSection";
import CommingSoonSection from "@/components/CommingSoonSection";

export default function Home() {
  return (
    <div className="py-6 lg:py-6 font-[family-name:var(--font-noto-sans)]">
      <div className="h-dvh mb-10 flex flex-col gap-4 px-8  lg:px-50">
        <Navbar />
        <HeroScroller />
        <div className=" h-14"> </div>
      </div>
      <FeatureSection />
      <NewArrivals />
      <CommingSoonSection />

      <ReviewSection />
      <BlogSection />
      <PartnersScroller />
      <About />
      <Footer />
    </div>
  );
}
