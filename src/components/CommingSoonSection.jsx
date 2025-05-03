import placeholder from "../../public/700x700.svg";
import Image from "next/image";

// Demo data
const demoGames = [
  { id: 1, title: "Game Title 1", image: placeholder, url: "/games/game-1" },
  { id: 2, title: "Game Title 2", image: placeholder, url: "/games/game-2" },
  { id: 3, title: "Game Title 3", image: placeholder, url: "/games/game-3" },
  { id: 4, title: "Game Title 4", image: placeholder, url: "/games/game-4" },
];

// Card component
const ComingSoonCard = ({ image, title, url }) => {
  return (
    <div className="flex flex-col gap-2">
      <Image src={image || placeholder} alt={title || "Placeholder Image"} />
      <h3 className="uppercase">{title || "Name of the game"}</h3>
      <a href={url} className="text-[#494791]">
        Learn more<span className="inline-block ml-1">→</span>
      </a>
    </div>
  );
};

export default function CommingSoonSection() {
  return (
    <section className="mb-25 flex flex-col items-center">
      <h2 className="text-4xl font-semibold tracking-wide mb-8 uppercase self-start">Coming soon</h2>
      <div className="flex flex-row gap-6">
        {demoGames.map((game) => (
          <ComingSoonCard key={game.id} title={game.title} image={game.image} url={game.url} />
        ))}
      </div>
    </section>
  );
}
