import DICE_IMG from "../../../public/About/dice.png";
import MEDAL_IMG from "../../../public/About/medal.png";
import QUESTION_IMG from "../../../public/About/question.png";
import Image from "next/image";
import SubscribeSection from "../home/SubscribeSection";

export default function About() {
  return (
    <section id="about" className="flex flex-col items-center justify-center ">
      <h2 className="uppercase text-center text-xl sm:text-2xl md:text-3xl lg:text-[40px] mt-8 sm:mt-12 md:mt-16 lg:mt-20 mb-6 sm:mb-7 md:mb-8">
        About us
      </h2>
      <div className="text-center text-sm sm:text-base md:text-lg text-pretty max-w-3xl mb-6 sm:mb-8 md:mb-10">
        We are passionate board game enthusiasts dedicated to bringing you the best tabletop experiences. Our store
        offers a carefully selected range of games, from timeless classics to the latest innovations. We believe in the
        power of board games to bring people together, spark creativity, and create unforgettable moments. Our goal is
        to provide high-quality games for every type of player, whether you're a beginner or a seasoned strategist.
      </div>

      {/* Sign up for deals form */}
      <SubscribeSection />
    </section>
  );
}
