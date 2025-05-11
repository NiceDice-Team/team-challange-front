import About from "@/components/layout/About.jsx";
import BlogSection from "@/components/home/BlogSection.jsx";
import Footer from "@/components/layout/Footer.jsx";
import HeroScroller from "@/components/home/HeroScroller.jsx";
import Navbar from "@/components/layout/Navbar.jsx";
import NewArrivals from "@/components/home/NewArrivals.jsx";
import PartnersScroller from "@/components/home/PartnersScroller.jsx";
import ReviewSection from "@/components/home/ReviewSection.jsx";
import FeatureSection from "@/components/home/FeaturesSection.jsx";
import FeatureSectionBottom from "@/components/home/FeatureSectionBottom.jsx";
import CommingSoonSection from "@/components/home/CommingSoonSection.jsx";

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
