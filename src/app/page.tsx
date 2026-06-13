import About from "../components/layout/About";
import BlogSection from "../components/home/BlogSection";
import Footer from "../components/layout/Footer";
import HeroScroller from "../components/home/HeroScroller";
import MobileFooter from "../components/layout/MobileFooter";
import Navbar from "../components/layout/Navbar";
import NewArrivals from "../components/home/NewArrivals";
import PartnersScroller from "../components/home/PartnersScroller";
import ReviewSection from "../components/home/ReviewSection";
import FeatureSection from "../components/home/FeaturesSection";
import FeatureSectionBottom from "../components/home/FeatureSectionBottom";
import CommingSoonSection from "../components/home/CommingSoonSection";

/**
 * Home page component
 * Main landing page with hero, features, products, and other sections
 */
export default function Home(): React.ReactElement {
  return (
    <div className="py-4 sm:py-6 font-[family-name:var(--font-noto-sans)]">
      <div className="sticky top-0 z-40 bg-white px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-24 xl:px-16">
        <Navbar enableMobileInlineSearch />
      </div>
      <div className="px-4 pt-4 sm:px-6 md:px-8 lg:px-12 2xl:px-24 xl:px-16 pb-8 sm:pb-12 md:pb-16">
        <HeroScroller />
      </div>
      <FeatureSection />
      <NewArrivals />
      <CommingSoonSection />
      <FeatureSectionBottom />
      <ReviewSection />
      <BlogSection />
      <PartnersScroller />
      <About />
      <div className="hidden sm:block">
        <Footer />
      </div>
      <MobileFooter />
    </div>
  );
}
