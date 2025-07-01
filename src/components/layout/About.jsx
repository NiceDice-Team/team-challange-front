import DICE_IMG from "../../../public/About/dice.png";
import MEDAL_IMG from "../../../public/About/medal.png";
import QUESTION_IMG from "../../../public/About/question.png";

import Image from "next/image";
import SubscribeSection from "../home/SubscribeSection";

export default function About() {
  return (
    <section className="flex flex-col items-center justify-center ">
      <h2 className="uppercase   text-center  text-lg lg:mt-20 lg:text-title mb-8">About us</h2>
      <div className="text-center text-sm lg:text-lg text-pretty max-w-3xl mb-6">
        We are passionate board game enthusiasts dedicated to bringing you the best tabletop experiences. Our store
        offers a carefully selected range of games, from timeless classics to the latest innovations. We believe in the
        power of board games to bring people together, spark creativity, and create unforgettable moments. Our goal is
        to provide high-quality games for every type of player, whsther you’re a beginner or a seasoned strategist.
      </div>

      {/* Sign up for deals form */}
      <SubscribeSection />
    </section>
  );
}
