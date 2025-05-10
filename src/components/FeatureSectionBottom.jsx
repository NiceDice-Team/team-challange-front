import PUZZLE_IMG from "../../public//Features/puzzle.png";
import PRIZE_IMG from "../../public/Features/prize.png";
import CHAT_IMG from "../../public/Features/chat.png";

import Image from "next/image";

export default function FeatureSectionBottom() {
  return (
    <section className="mb-25">
      <div className="flex flex-row flex-wrap justify-around items-center w-full text-center text-pretty bg-[#494791] text-white py-10 px-8 lg:px-50">
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src={PUZZLE_IMG} alt="Puzzle icon" />
          </div>
          <h3 className="text-lg lg:text-2xl mt-1">Wide Selection</h3>
          <p className="text-sm lg:text-base text-pretty max-w-3xl">
            From party games to deep strategy, we have something for everyone
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src={PRIZE_IMG} alt="Prize icon" />
          </div>
          <h3 className="text-lg lg:text-2xl mt-1">High-Quality Games</h3>
          <p className="text-sm lg:text-base text-pretty max-w-3xl">We source directly from trusted manufacturers</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-80">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src={CHAT_IMG} alt="Chat icon" />
          </div>
          <h3 className="text-lg lg:text-2xl mt-1">Support</h3>
          <p className="text-sm lg:text-base text-pretty max-w-3xl">
            Our team is here to help you find the perfect game
          </p>
        </div>
      </div>
    </section>
  );
}
