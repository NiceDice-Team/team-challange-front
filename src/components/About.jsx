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
      {/* Icons */}
      <div className="flex flex-row justify-around items-center w-full mb-10 text-center">
        <div className="flex flex-col items-center justify-center gap-2 max-w-3xs">
          <Image width={64} height={64} src={DICE_IMG} alt="Dice icon" />
          <h3 className="text-lg lg:text-2xl">Wide Selection</h3>
          <p className="text-sm lg:text-lg text-pretty max-w-3xl text-[#848484]">
            From party games to deep strategy, we have something for everyone
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-3xs">
          <Image width={64} height={64} src={MEDAL_IMG} alt="Medal icon" />
          <h3 className="text-lg lg:text-2xl">High-Quality Games</h3>
          <p className="text-sm lg:text-lg text-pretty max-w-3xl text-[#848484]">
            We source directly from trusted manufacturers
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-3xs">
          <Image width={64} height={64} src={QUESTION_IMG} alt="Question marc icon" />
          <h3 className="text-lg lg:text-2xl">Support</h3>
          <p className="text-sm lg:text-lg text-pretty max-w-3xl  text-[#848484]">
            Our team is here to help you find the perfect game
          </p>
        </div>
      </div>

      {/* Sign up for deals form */}
      <div className="w-full py-22 bg-[#E6E6E6] flex flex-col items-center justify-center">
        <h2 className="uppercase text-lg  lg:text-3xl mb-8 font-semibold">Stay Updated & Get Exclusive Deals!</h2>

        <p className="text-sm lg:text-lg text-pretty max-w-xl text-center mb-6">
          Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news
        </p>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full max-w-md p-2 border  border-black py-4 outline-gray-400"
          />
          <button className="bg-white text-[#494791] py-4 px-8  hover:bg-[#494791] hover:text-white transition-all duration-150">
            Sign Up
          </button>
        </div>
      </div>
    </section>
  );
}
