import Link from "next/link";
import BlogSection from "../../../components/home/BlogSection";
import FeatureSectionBottom from "../../../components/home/FeatureSectionBottom";
import FeatureSection from "../../../components/home/FeaturesSection";
import PartnersScroller from "../../../components/home/PartnersScroller";
import SubscribeSection from "../../../components/home/SubscribeSection";

export default function RegisterPage() {
  return (
    <div className="mx-auto mt-20">
      <h1 className="text-4xl font-normal text-center mb-9 uppercase">Create account </h1>
      <div className="text-center text-base mb-12">
        <p>Join our community of board game enthusiasts! 🎲</p>
        <p>Fill in the details below to get started</p>
      </div>
      
      <div className="flex flex-col items-center justify-center mb-28">
        <p className="text-gray-500"> form </p>

        <p className="text-[#494791]">Already have an account?</p>
        <Link  href="/login" className="underline text-[#494791]">Log in here<span className="inline-block ml-1">→</span></Link>
      </div>
      
       <FeatureSection />
       <BlogSection />
       <FeatureSectionBottom />
       <PartnersScroller />
       <SubscribeSection className="mt-20"/>
    </div>
  );
}
