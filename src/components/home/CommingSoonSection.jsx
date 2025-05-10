import placeholder from "../../../public/700x700.svg";
import GAME_IMG1 from "../../../public/ComingSoon/Img1.png";
import GAME_IMG2 from "../../../public/ComingSoon/Img2.png";
import GAME_IMG3 from "../../../public/ComingSoon/Img3.png";
import GAME_IMG4 from "../../../public/ComingSoon/Img4.png";
import Image from "next/image";

// Demo data
const demoGames = [
  { id: 1, title: "Game Title 1", image: GAME_IMG4, url: "/games/game-1" },
  { id: 2, title: "Game Title 2", image: GAME_IMG2, url: "/games/game-2" },
  { id: 3, title: "Game Title 3", image: GAME_IMG3, url: "/games/game-3" },
  { id: 4, title: "Game Title 4", image: GAME_IMG1, url: "/games/game-4" },
];

// Card component
const ComingSoonCard = ({ image, title, url }) => {
  return (
    <div className="flex gap-2 flex-col ">
      <div className="relative w-full aspect-square">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <h3 className="uppercase">{title}</h3>
      <a href={url} className="text-[#494791]">
        Learn more<span className="inline-block ml-1">→</span>
      </a>
    </div>
  );
};

export default function CommingSoonSection() {
  return (
    <section className="mb-25 flex flex-col items-center px-8  lg:px-50">
      <h2 className="text-4xl font-semibold tracking-wide mb-8 uppercase self-start">Coming soon</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full ">
        {demoGames.map((game) => (
          <ComingSoonCard key={game.id} title={game.title} image={game.image} url={game.url} />
        ))}
      </div>
    </section>
  );
}
