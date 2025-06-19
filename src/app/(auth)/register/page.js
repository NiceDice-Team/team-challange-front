import Link from "next/link";
import BlogSection from "../../../components/home/BlogSection";
import FeatureSectionBottom from "../../../components/home/FeatureSectionBottom";
import FeatureSection from "../../../components/home/FeaturesSection";
import PartnersScroller from "../../../components/home/PartnersScroller";
import SubscribeSection from "../../../components/home/SubscribeSection";

export default function RegisterPage() {
  return (
    <div className="mx-auto mt-20">
      <h1 className="text-title font-normal text-center mb-9 uppercase">Create account </h1>
      <div className="text-center text-base mb-12">
        <p>Join our community of board game enthusiasts! 🎲</p>
        <p>Fill in the details below to get started</p>
      </div>
      
      <div className="flex flex-col items-center justify-center mb-28">
        <form className="flex flex-col gap-4 w-[500px] mb-12" action={signup}>
        <input
            placeholder="Name"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
           <input
            placeholder="Last Name"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
        <input
            type="email"
            placeholder="Email"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
           <input
           type="password"
            placeholder="Password"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
           <input
           type="password"
            placeholder="Confirm Password"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          />
          <button type="submit" className="w-full bg-purple text-white p-4 px-8 text-base uppercase hover:bg-gray-100 transition-all duration-150">
            REGISTER
          </button>
        </form>

        <p className="text-purple">Already have an account?</p>
        <Link  href="/login" className="underline text-purple">Log in here<span className="inline-block ml-1">→</span></Link>
      </div>
      
       <FeatureSection />
       <BlogSection />
       <FeatureSectionBottom />
       <PartnersScroller />
       <SubscribeSection className="mt-20"/>
    </div>
  );
}
