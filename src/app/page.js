import About from "@/components/layout/About";
import BlogSection from "@/components/home/BlogSection";
import Footer from "@/components/layout/Footer";
import HeroScroller from "@/components/home/HeroScroller";
import Navbar from "@/components/layout/Navbar";
import NewArrivals from "@/components/home/NewArrivals";
import PartnersScroller from "@/components/home/PartnersScroller";
import ReviewSection from "@/components/home/ReviewSection";
import FeatureSection from "@/components/home/FeaturesSection";
import FeatureSectionBottom from "@/components/home/FeatureSectionBottom";
import CommingSoonSection from "@/components/home/CommingSoonSection";

export default function Home() {
  return (
    <div className="py-6 lg:py-6 font-[family-name:var(--font-noto-sans)]">
      <div className="h-dvh  flex flex-col gap-4 px-8  lg:px-50">
        <Navbar />
        <HeroScroller />
        <div className=" h-14"> </div>
      </div>
      <FeatureSection />
      <NewArrivals />
      <CommingSoonSection />
      <FeatureSectionBottom />
      <ReviewSection />
      <BlogSection />
      <PartnersScroller />
      <About />
      <Footer />
    </div>
  );
}
