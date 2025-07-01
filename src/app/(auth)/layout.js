import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import FeatureSection from "../../components/home/FeaturesSection.jsx";
import BlogSection from "../../components/home/BlogSection.jsx";
import FeatureSectionBottom from "../../components/home/FeatureSectionBottom.jsx";
import PartnersScroller from "../../components/home/PartnersScroller.jsx";
import SubscribeSection from "../../components/home/SubscribeSection.jsx";


export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-8 lg:px-16 py-6">
        <Navbar />
      </div>
      
      <main className="flex-1 px-8 lg:px-16 py-10">
        {children}
        
      </main>
      <FeatureSection />
      <BlogSection />
      <FeatureSectionBottom />
      <PartnersScroller />
      <SubscribeSection className="mt-20"/>
      <Footer />
    </div>
  );
}
