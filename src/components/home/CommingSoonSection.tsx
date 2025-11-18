import placeholder from "../../../public/700x700.svg";
import GAME_IMG1 from "../../../public/ComingSoon/Img1.png";
import GAME_IMG2 from "../../../public/ComingSoon/Img2.png";
import GAME_IMG3 from "../../../public/ComingSoon/Img3.png";
import GAME_IMG4 from "../../../public/ComingSoon/Img4.png";
import Image, { StaticImageData } from "next/image";

interface Game {
  id: number;
  title: string;
  image: StaticImageData;
  url: string;
}

// Demo data
const demoGames: Game[] = [
  { id: 1, title: "Game Title 1", image: GAME_IMG4, url: "/games/game-1" },
  { id: 2, title: "Game Title 2", image: GAME_IMG2, url: "/games/game-2" },
  { id: 3, title: "Game Title 3", image: GAME_IMG3, url: "/games/game-3" },
  { id: 4, title: "Game Title 4", image: GAME_IMG1, url: "/games/game-4" },
];

interface ComingSoonCardProps {
  image: StaticImageData;
  title: string;
  url: string;
}

// Card component
const ComingSoonCard = ({ image, title, url }: ComingSoonCardProps) => {
  return (
    <div className="flex gap-2 sm:gap-2.5 md:gap-3 flex-col">
      <div className="relative w-full aspect-square">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <h3 className="uppercase text-sm sm:text-base font-medium">{title}</h3>
      <a href={url} className="text-[#494791] text-sm sm:text-base hover:underline transition-all">
        Learn more<span className="inline-block ml-1">→</span>
      </a>
    </div>
  );
};

export default function CommingSoonSection() {
  return (
    <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-wide mb-6 sm:mb-7 md:mb-8 uppercase self-start">Coming soon</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-[1320px]">
        {demoGames.map((game) => (
          <ComingSoonCard key={game.id} title={game.title} image={game.image} url={game.url} />
        ))}
      </div>
    </section>
  );
}
