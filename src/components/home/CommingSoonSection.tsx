import Image from "next/image";
import Link from "next/link";
import { catalogServices } from "@/services/catalogServices";
import { productServices } from "@/services/productServices";
import type { Category } from "@/types/catalog";
import type { Product, ProductImage } from "@/types/product";

const COMING_SOON_LIMIT = 4;
const COMING_SOON_EMPTY_MESSAGE = "There are no games coming soon right now.";

interface ComingSoonGame {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
  url: string;
}

interface ComingSoonCardProps {
  image: string;
  imageAlt: string;
  title: string;
  url: string;
}

const normalizeCategoryName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

const getProductImage = (images: ProductImage[] | undefined): ProductImage | null => {
  const image = images?.find((item) => item.url_sm || item.url_md || item.url_lg || item.url_original);
  return image || null;
};

const mapProductToComingSoonGame = (product: Product): ComingSoonGame | null => {
  const productImage = getProductImage(product.images);
  const image = productImage?.url_sm || productImage?.url_md || productImage?.url_lg || productImage?.url_original || null;
  if (!image) return null;

  return {
    id: product.id,
    title: product.name,
    image,
    imageAlt: productImage.alt || product.name,
    url: `/product/${product.id}`,
  };
};

const getComingSoonGames = async (): Promise<ComingSoonGame[]> => {
  try {
    const categoriesResponse = await catalogServices.getCategories();
    const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];
    const comingSoonCategory = categories.find(
      (category: Category) => normalizeCategoryName(category.name) === "coming soon",
    );

    if (!comingSoonCategory?.id) return [];

    const productsData = await productServices.getProductsWithFilters(
      1,
      COMING_SOON_LIMIT,
      "relevance",
      { categories: [comingSoonCategory.id] },
    );
    const products = Array.isArray(productsData?.results) ? productsData.results : [];

    return products
      .map((product: Product) => mapProductToComingSoonGame(product))
      .filter((game: ComingSoonGame | null): game is ComingSoonGame => game !== null);
  } catch {
    return [];
  }
};

const ComingSoonCard = ({ image, imageAlt, title, url }: ComingSoonCardProps) => {
  return (
    <div className="flex gap-2 sm:gap-2.5 md:gap-3 flex-col">
      <Link href={url} className="relative w-full aspect-square">
        <Image src={image} alt={imageAlt} fill className="object-contain" />
      </Link>
      <h3 className="uppercase text-sm sm:text-base font-medium">{title}</h3>
      <Link href={url} className="text-[#494791] text-sm sm:text-base hover:underline transition-all">
        Learn more<span className="inline-block ml-1">→</span>
      </Link>
    </div>
  );
};

export default async function CommingSoonSection() {
  const games = await getComingSoonGames();

  return (
    <section className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-wide mb-6 sm:mb-7 md:mb-8 uppercase self-start">Coming soon</h2>
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-[1320px]">
          {games.map((game) => (
            <ComingSoonCard
              key={game.id}
              title={game.title}
              image={game.image}
              imageAlt={game.imageAlt}
              url={game.url}
            />
          ))}
        </div>
      ) : (
        <p className="w-full max-w-[1320px] text-sm sm:text-base text-[#717171]">
          {COMING_SOON_EMPTY_MESSAGE}
        </p>
      )}
    </section>
  );
}
