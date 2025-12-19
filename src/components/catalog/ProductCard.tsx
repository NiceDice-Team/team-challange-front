import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  StarEmptyIcon,
  StarFilledIcon,
  CircleRedIcon,
  CircleOrangeIcon,
  CircleGreenIcon,
  CircleGrayIcon,
} from "@/svgs/icons";
import { Heart } from "lucide-react";
import { useAddToCart } from "@/hooks/useCartQuery";
import { CustomButton } from "@/components/shared/CustomButton";
import type { Product } from "@/types/product";

// Component props
interface ProductCardProps {
  product?: Product;
}

export default function ProductCard({ product = {} as Product }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const galleryRef = useRef(null);
  const addToCartMutation = useAddToCart();

  // Create star rating display
  const renderStars = () => {
    const rating = parseFloat(String(product?.stars || 0));
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="text-blue-800">
          {i <= rating ? (
            <img src={StarFilledIcon} alt="filled star" className="h-4 w-4" />
          ) : (
            <img src={StarEmptyIcon} alt="empty star" className="h-4 w-4" />
          )}
        </span>
      );
    }
    return stars;
  };

  // Format price
  const displayPrice = product?.price ? `$${parseFloat(String(product.price)).toFixed(2)}` : "$35.99";

  // Truncate product name if too long (approximately 30 characters for 2 lines)
  const truncateName = (name: string | undefined): string => {
    const maxLength = 20;
    if (!name) return "PRODUCT NAME";
    return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
  };

  const stock = parseInt(String(product.stock), 10);
  let stockCircle;
  let stockMessage;
  let stockStyle;
  if (stock === 0) {
    stockMessage = "Sold out";
    stockCircle = <img src={CircleGrayIcon} alt="sold out" className="h-2 w-2" />;
    stockStyle = "text-[#717171]";
  } else if (stock <= 5) {
    stockMessage = `Very low stock(1-5 units)`;
    stockCircle = <img src={CircleRedIcon} alt="very low stock" className="h-2 w-2" />;
    stockStyle = "text-[#EC3535]";
  } else if (stock <= 10) {
    stockMessage = `Low stock (6-10 units)`;
    stockCircle = <img src={CircleOrangeIcon} alt="low stock" className="h-2 w-2" />;
    stockStyle = "text-[#FF7C40]";
  } else {
    stockMessage = `In stock (>11)`;
    stockCircle = <img src={CircleGreenIcon} alt="in stock" className="h-2 w-2" />;
    stockStyle = "text-[#3A9B25]";
  }

  const availableImages = product?.images?.slice(0, 3) || [];
  const imageCount = availableImages.length;

  // Reset active image when product changes
  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  const goToPrevImage = () => {
    if (activeImage > 0) {
      scrollToImage(activeImage - 1);
    }
  };

  const goToNextImage = () => {
    if (activeImage < imageCount - 1) {
      scrollToImage(activeImage + 1);
    }
  };

  // Setup scroll listener to update active image indicator
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const handleScroll = () => {
      const scrollPosition = gallery.scrollLeft;
      const imageWidth = gallery.clientWidth;
      const imageIndex = Math.min(Math.round(scrollPosition / imageWidth), imageCount - 1);
      setActiveImage(imageIndex);
    };

    gallery.addEventListener("scroll", handleScroll);
    return () => gallery.removeEventListener("scroll", handleScroll);
  }, [imageCount]);

  // Function to scroll to a specific image
  const scrollToImage = (index: number): void => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({
        left: index * galleryRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Handler for adding product to cart
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (addToCartMutation.isPending) return; // Prevent multiple rapid clicks

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
        productData: product,
      });

      // TODO: console.log убрать и добавить Toast (в будущем)
      console.log(`"${product.name || "Product"}" added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <article className="flex flex-col w-full max-w-[240px] min-w-[200px] h-[427px] bg-white shadow-md mx-auto">
        <div className="relative w-full h-[190px] pt-4 flex flex-col items-center gap-4 isolate">
          {/* Image gallery container - hiding scrollbar */}
          <div
            ref={galleryRef}
            className="flex overflow-x-scroll snap-x snap-mandatory w-full h-[158px] flex-grow z-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Individual images - show only available images (max 3) */}
            {availableImages.length > 0 ? (
              availableImages.map((image, index) => (
                <div key={image.id || index} className="min-w-full h-full flex-shrink-0 relative snap-center">
                  <Image
                    src={image.url_sm}
                    alt={image.alt || product?.name || "Product"}
                    fill
                    className="object-contain"
                    unoptimized={image.url_sm?.includes("placehold.co")}
                  />
                </div>
              ))
            ) : (
              <div className="min-w-full h-full flex-shrink-0 relative snap-center flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          {/* Left click area */}
          <div
            className="absolute left-0 top-0 w-1/4 h-full cursor-pointer z-10"
            onClick={(e) => {
              e.preventDefault();
              goToPrevImage();
            }}
            aria-label="Previous image"
          />

          {/* Right click area */}
          <div
            className="absolute right-0 top-0 w-1/4 h-full cursor-pointer z-10"
            onClick={(e) => {
              e.preventDefault();
              goToNextImage();
            }}
            aria-label="Next image"
          />

          {/* Heart icon - positioned absolutely in upper right */}
          <CustomButton
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
              console.log("Toggle wishlist:", product.name, !isFavorite);
            }}
            styleType="wishlist"
            className="absolute top-2 right-2 z-20"
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#494791] text-[#494791]" : "text-[#494791]"}`} />
          </CustomButton>

          {/* Navigation lines - positioned within image container */}
          {imageCount > 1 && (
            <div className="absolute bottom-0 left-0 right-0 w-full h-0 flex justify-center items-start z-10">
              <div className="flex justify-center items-start gap-0">
                {availableImages.map((_, index) => {
                  const isLast = index === imageCount - 1;
                  const width = isLast ? "w-[84px]" : "w-[78px]";
                  return (
                    <CustomButton
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToImage(index);
                      }}
                      styleType="navigation"
                      className={`${width} h-[3px] border-0 ${activeImage === index ? "bg-[#494791]" : "bg-[#A4A3C8]"}`}
                      aria-label={`View image ${index + 1}`}
                    >
                      {""}
                    </CustomButton>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Product Card Details */}
        <div className="flex flex-col p-4 gap-4 w-full h-[237px]">
          {/* Product name and rating section */}
          <div className="flex items-start gap-2 w-full h-[71px]">
            <div className="flex flex-col gap-2 w-[145px] h-[71px]">
              <h3 className="text-lg font-normal text-black uppercase w-[145px] h-[44px] leading-[22px] overflow-hidden">
                {truncateName(product?.name)}
              </h3>

              {/* Stars and Reviews */}
              <div className="flex items-center gap-1 w-[104px] h-[19px]">
                <div className="flex items-start w-[80px] h-4">{renderStars()}</div>
                <span className="text-base uppercase text-black w-5 h-[19px] leading-[19px]">
                  ({product?.reviews?.length || 0})
                </span>
              </div>
            </div>
          </div>

          {/* Price and stock section */}
          <div className="flex flex-col gap-2 w-full h-[54px]">
            {/* Price */}
            <div className="flex justify-end items-end gap-2 w-[79px] h-[29px]">
              <p className="text-2xl font-bold uppercase text-black w-[79px] h-[29px] leading-[29px]">{displayPrice}</p>
            </div>

            {/* Stock status */}
            <div className={`flex items-center gap-2 text-sm ${stockStyle} w-full h-[17px]`}>
              {stockCircle}
              <span className="text-sm leading-[17px]">{stockMessage}</span>
            </div>
          </div>

          {/* Add to cart button */}
          <CustomButton
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            styleType="productCart"
            className="w-full h-12 px-8 py-4 gap-2 bg-[#494791] text-center"
          >
            <span className="text-base font-medium leading-[19px] text-white uppercase">
              {addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
            </span>
          </CustomButton>
        </div>
      </article>
    </Link>
  );
}
