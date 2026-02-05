import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FeatureSection from "../../components/home/FeaturesSection";
import BlogSection from "../../components/home/BlogSection";
import FeatureSectionBottom from "../../components/home/FeatureSectionBottom";
import PartnersScroller from "../../components/home/PartnersScroller";
import SubscribeSection from "../../components/home/SubscribeSection";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Authentication layout wrapper
 * Used for login, register, and other auth pages
 */
export default function AuthLayout({ children }: AuthLayoutProps): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-8 lg:px-16 py-6"><Navbar /></div>

      <main className="flex-1 px-4 md:px-8 lg:px-16 py-4 md:py-10">
        {children}
      </main>
      <FeatureSection />
      <BlogSection />
      <FeatureSectionBottom />
      <PartnersScroller />
      <SubscribeSection className="mt-20" />
      <Footer />
    </div>
  );
}
