import DICE_IMG from "../../public/About/dice.png";
import MEDAL_IMG from "../../public/About/medal.png";
import QUESTION_IMG from "../../public/About/question.png";

import Image from "next/image";

export default function About() {
  return (
    <section className="flex flex-col items-center justify-center ">
      <h2 className="uppercase   text-center  text-lg lg:mt-20 lg:text-3xl mb-8">About us</h2>
      <div className="text-center text-sm lg:text-lg text-pretty max-w-3xl mb-6">
        We are passionate board game enthusiasts dedicated to bringing you the best tabletop experiences. Our store
        offers a carefully selected range of games, from timeless classics to the latest innovations. We believe in the
        power of board games to bring people together, spark creativity, and create unforgettable moments. Our goal is
        to provide high-quality games for every type of player, whsther you’re a beginner or a seasoned strategist.
      </div>

      {/* Sign up for deals form */}
      <div className="w-full py-22  flex flex-col items-center justify-center bg-[#494791] text-white">
        <h2 className="uppercase text-lg  lg:text-3xl mb-8 font-semibold">Stay Updated & Get Exclusive Deals!</h2>

        <p className="text-sm lg:text-lg text-pretty max-w-xl text-center mb-6">
          Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news
        </p>
        <div className="flex flex-col w-full max-w-3xl gap-3 items-center">
          <div className="flex flex-col md:flex-row w-full gap-4">
            <input type="email" placeholder="Email" className="w-full md:flex-1 p-4 bg-white text-black outline-none" />
            <button className="w-full md:w-auto bg-white text-[#494791] p-4 px-8 text-lg font-semibold uppercase hover:bg-gray-100 transition-all duration-150">
              Subscribe
            </button>
          </div>

          <div className="flex items-center gap-2 self-start max-w-4xl">
            <input
              type="checkbox"
              id="marketing-consent"
              name="marketing-consent"
              className="h-5 w-5 border-2 accent-white cursor-pointer"
            />
            <label htmlFor="marketing-consent" className="text-sm md:text-base cursor-pointer">
              I agree to receiving marketing emails and special deals
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
