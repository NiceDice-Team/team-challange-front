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

  const productName = product?.name || "PRODUCT NAME";

  const parsedStock = parseInt(String(product.stock ?? 0), 10);
  const stock = Number.isNaN(parsedStock) ? 0 : parsedStock;
  const isOutOfStock = stock <= 0;
  let stockCircle;
  let stockMessage;
  let stockStyle;
  if (stock === 0) {
    stockMessage = "Sold out";
    stockCircle = <img src={CircleGrayIcon} alt="sold out" className="h-2 w-2" />;
    stockStyle = "text-[#717171]";
  } else if (stock <= 5) {
    stockMessage = "Very low stock (1-5 units)";
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
    } catch {
      // Error feedback is handled in the cart mutation hook.
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <article className="mx-auto flex min-h-[539px] w-full max-w-[396px] min-w-0 flex-col bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.1)] sm:h-[427px] sm:max-w-[240px] sm:min-h-0 sm:min-w-[200px]">
        <div className="relative isolate flex h-[307px] w-full flex-col items-center gap-4 pt-4 sm:h-[190px]">
          {/* Image gallery container - hiding scrollbar */}
          <div
            ref={galleryRef}
            className="z-0 flex h-[275px] w-full flex-grow snap-x snap-mandatory overflow-x-scroll sm:h-[158px]"
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-start">
            <div className="flex min-w-0 flex-col gap-2 sm:w-[145px]">
              <h3
                className="min-h-[38px] text-base font-medium uppercase leading-[19px] text-black sm:min-h-[44px] sm:w-[145px] sm:text-lg sm:font-normal sm:leading-[22px]"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {productName}
              </h3>

              {/* Stars and Reviews */}
              <div className="flex h-[19px] w-fit items-center gap-1">
                <div className="flex h-4 w-[80px] items-start">{renderStars()}</div>
                <span className="h-[19px] w-5 text-base uppercase leading-[19px] text-black">
                  ({product?.reviews?.length || 0})
                </span>
              </div>
            </div>

            <div className="flex min-w-[150px] flex-col items-end gap-2 text-right sm:min-w-0 sm:w-full sm:items-start sm:text-left">
              <div className="flex h-6 items-end justify-end gap-2 sm:h-[29px]">
                <p className="text-[20px] font-bold uppercase leading-6 text-black sm:text-2xl sm:leading-[29px]">{displayPrice}</p>
              </div>

              {/* Stock status */}
              <div className={`flex min-h-[17px] max-w-[166px] items-center justify-end gap-2 text-sm ${stockStyle} sm:justify-start`}>
                {stockCircle}
                <span className="text-sm leading-[17px]">{stockMessage}</span>
              </div>
            </div>
          </div>

          {/* Add to cart button */}
          <CustomButton
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || isOutOfStock}
            styleType="productCart"
            className="mt-auto h-12 w-full gap-2 bg-[#494791] px-8 py-4 text-center"
          >
            <span className="text-base font-medium leading-[19px] text-white uppercase">
              {isOutOfStock ? "SOLD OUT" : addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
            </span>
          </CustomButton>
        </div>
      </article>
    </Link>
  );
}
