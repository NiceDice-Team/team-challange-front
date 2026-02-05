import { InstagramIcon, TikTokIcon, FacebookIcon, XTwitterIcon, LogoFullIcon } from "@/svgs/icons";

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 pb-5 sm:pb-6 md:pb-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-full overflow-hidden">
      <div className="w-full lg:w-auto flex-shrink-0">
        <LogoFullIcon className="w-48 sm:w-56 md:w-64 lg:w-80 h-auto" />
      </div>
      <div className="flex flex-row justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-20 flex-wrap lg:flex-nowrap w-full lg:w-auto">
        <div>
          <h3 className="uppercase mb-2 font-bold text-sm sm:text-base">products</h3>
          <ul className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <li>New Arrivals</li>
            <li>Bestsellers</li>
            <li>Board Games</li>
            <li>Coming soon</li>
            <li>Sale</li>
          </ul>
        </div>
        <div>
          <h3 className="uppercase mb-2 font-bold text-sm sm:text-base">clients</h3>
          <ul className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <li>Blog</li>
            <li>Reviews</li>
            <li>Shipping</li>
            <li>Returns</li>
          </ul>
        </div>
        <div>
          <h3 className="uppercase mb-2 font-bold text-sm sm:text-base">company</h3>
          <ul className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <li>About</li>
            <li>Contact Us</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="flex-shrink-0">
        <h3 className="uppercase mb-2 font-bold text-sm sm:text-base">follow us</h3>
        <div className="flex flex-row gap-3">
          <InstagramIcon className="w-6 h-6" />
          <TikTokIcon className="w-6 h-6" />
          <FacebookIcon className="w-6 h-6" />
          <XTwitterIcon className="w-6 h-6" />
        </div>
      </div>
    </footer>
  );
}
