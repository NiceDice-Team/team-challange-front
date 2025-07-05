import Image from "next/image";
import React from "react";
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

export default function ProductCard({ product = {} }) {
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef(null);

  // Create star rating display
  const renderStars = () => {
    const rating = parseFloat(product?.stars || 0);
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
  const displayPrice = product?.price ? `$${parseFloat(product.price).toFixed(2)}` : "$35.99";

  const stock = parseInt(product.stock, 10);
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

  const goToPrevImage = () => {
    if (activeImage > 0) {
      scrollToImage(activeImage - 1);
    }
  };

  const goToNextImage = () => {
    if (activeImage < 2) {
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
      const imageIndex = Math.round(scrollPosition / imageWidth);
      setActiveImage(imageIndex);
    };

    gallery.addEventListener("scroll", handleScroll);
    return () => gallery.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to a specific image
  const scrollToImage = (index) => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({
        left: index * galleryRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <article className="flex flex-col w-[240px] h-[427px] bg-white shadow-md p-4">
        <div className="relative w-full h-[192px] mb-2">
          {/* Image gallery container - hiding scrollbar */}
          <div
            ref={galleryRef}
            className="flex overflow-x-scroll snap-x snap-mandatory h-full"
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

            {/* Individual images */}
            <div className="min-w-full h-full flex-shrink-0 relative snap-center">
              <Image 
                src={product?.image || "/FirstPlaceholder.svg"} 
                alt={product?.name || "Product"} 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="min-w-full h-full flex-shrink-0 relative snap-center">
              <Image 
                src={product?.image || "/SecondPlaceholder.svg"} 
                alt={product?.name || "Product"} 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="min-w-full h-full flex-shrink-0 relative snap-center">
              <Image 
                src={product?.image || "/ThirdPlaceholder.svg"} 
                alt={product?.name || "Product"} 
                fill 
                className="object-contain" 
              />
            </div>
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

          {/* Navigation lines */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-0.5">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToImage(index);
                }}
                className={`w-20 h-1 transition-colors ${activeImage === index ? "bg-[#494791]" : "bg-gray-300"}`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Product Card Details */}
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem]">
            {(product?.name || "PRODUCT NAME").toUpperCase()}
          </h3>

          {/* Stars and Reviews */}
          <div className="flex items-center mt-1 h-5">
            {renderStars()}
            <span className="ml-1 text-sm">({product?.reviews?.length || 0})</span>
          </div>

          {/* Price */}
          <p className="text-xl font-bold mt-2 h-7">{displayPrice}</p>

          {/* Stock status */}
          <p className={`flex flex-row flex-nowrap items-center gap-2 text-sm ${stockStyle} h-5`}>
            {stockCircle}
            {stockMessage}
          </p>

          {/* Add to cart button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
            className="mt-4 w-full border-2 border-[#494791] text-[#494791] text-center py-2 text-base font-medium hover:bg-gray-100 transition h-10"
          >
            ADD TO CART
          </button>
        </div>
      </article>
    </Link>
  );
}
