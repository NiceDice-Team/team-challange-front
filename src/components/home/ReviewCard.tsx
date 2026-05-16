"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

interface ReviewCardProps {
  rating?: number;
  date?: string;
  avatarSrc?: StaticImageData | string;
  name?: string;
  aboutHref?: string;
  aboutText?: string;
  title?: string;
  body: string;
  images?: (StaticImageData | string)[];
  collapsible?: boolean;
  className?: string;
  variant?: "default" | "figma";
  footer?: ReactNode;
}

export default function ReviewCard({
  rating = 5,
  date,
  avatarSrc,
  name,
  aboutHref,
  aboutText,
  title,
  body,
  images = [],
  collapsible = false,
  className = "",
  variant = "default",
  footer,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFigma = variant === "figma";

  const cutText = (text: string, maxLength = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const shouldTruncate = collapsible && body.length > 100;
  const displayBody = shouldTruncate && !isExpanded ? cutText(body) : body;
  const figmaBody = body.length > 190 ? `${body.substring(0, 190).trimEnd()} ...` : body;
  const reviewBody = isFigma ? figmaBody : displayBody;
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <article
      className={cn(
        "flex flex-col justify-between",
        isFigma && "h-[328px] w-full max-w-[396px] justify-center gap-0 px-4 py-6 sm:h-[309px] sm:max-w-none sm:p-6",
        className
      )}
    >
      <header className={cn("mb-8 flex items-center justify-between gap-4", isFigma && "mb-6 w-full gap-2 sm:mb-8")}>
        <div className={cn("flex text-[#494791]", isFigma ? "gap-0.5" : "space-x-1")}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className={cn(
                isFigma ? "h-4 w-4" : "h-5 w-5",
                i < normalizedRating ? "fill-current" : "fill-gray-500/70"
              )}
            >
              <path d="M12 17.27l6.18 3.73-1.64-7.19L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.57L5.82 21z" />
            </svg>
          ))}
        </div>

        {date && (
          <time dateTime={date} className="text-sm leading-[17px] text-[#717171]">
            {date}
          </time>
        )}
      </header>

      <div className={cn("mb-6 flex items-start justify-between gap-4", isFigma && "w-full")}>
        <div className="flex shrink-0 items-center gap-1">
          {avatarSrc && (
            <span className="relative h-6 w-6 shrink-0">
              <Image src={avatarSrc} alt={name ?? "Customer"} width={24} height={24} className="rounded-full" />
              {isFigma && (
                <span className="absolute bottom-0 right-0 flex h-2 w-2 items-center justify-center rounded-full bg-[var(--color-purple)]">
                  <svg viewBox="0 0 8 8" aria-hidden="true" className="h-2 w-2 fill-none">
                    <path d="M2 4.1 3.4 5.5 6 2.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </span>
          )}
          <h3 className="text-base leading-[19px] text-black">{name}</h3>
        </div>

        {aboutHref && aboutText && (
          <Link
            href={aboutHref}
            className={cn(
              "min-w-0 text-base leading-[19px] decoration-2 underline-offset-2 hover:text-indigo-800",
              isFigma && "flex items-start gap-2"
            )}
          >
            <span className="text-black">About</span>
            <span className="truncate text-[color:var(--color-purple)] underline underline-offset-2">{aboutText}</span>
          </Link>
        )}
      </div>

      <div className={cn(isFigma && "flex h-[159px] w-full flex-col gap-2 sm:h-[164px]")}>
        <h4 className={cn("mb-2 text-base font-bold text-black", isFigma && "mb-0 h-[19px] truncate leading-[19px]")}>{title}</h4>
        <div className={cn("mb-4 text-base leading-[22px] text-black", isFigma && "mb-0")}>
          <p className={cn("whitespace-pre-line", isFigma && "h-[132px] overflow-hidden sm:h-[110px]")}>
            {reviewBody}
            {shouldTruncate && !isExpanded && "..."}
            {isFigma && !collapsible && (
              <Link href={aboutHref ?? "#"} className="inline text-[color:var(--color-purple)] underline underline-offset-2 sm:hidden">
                {" "}
                Read more
              </Link>
            )}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 block text-[color:var(--color-purple)] underline underline-offset-2 hover:text-[color:var(--color-light-purple)]"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
          {isFigma && !collapsible && (
            <Link
              href={aboutHref ?? "#"}
              className="mt-2 hidden h-[19px] leading-[19px] text-[color:var(--color-purple)] underline underline-offset-2 sm:block"
            >
              Read more
            </Link>
          )}
        </div>
      </div>

      {isFigma && footer && <div className="mt-6 flex h-2 w-full items-center justify-center sm:hidden">{footer}</div>}

      {!isFigma && images.length > 0 && (!collapsible || isExpanded) && (
        <div className="flex gap-4">
          {images.slice(0, 4).map((src, idx) => (
            <div key={idx} className="relative aspect-square flex-1 overflow-hidden">
              <Image
                src={src}
                alt={`review image ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
