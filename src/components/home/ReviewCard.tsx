"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ReviewCard({
  rating = 5, // Integer 0‑5
  date, // ISO or display string
  avatarSrc,
  name,
  aboutHref,
  aboutText,
  title,
  body,
  images = [], // Up to 4 image URLs
  collapsible = false, //to make the comment collapsible
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to cut the text
  const cutText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const CutTruncate = collapsible && body.length > 100;
  const displayBody = CutTruncate && !isExpanded ? cutText(body) : body;
  return (
    <article className={`p-5 flex flex-col justify-between ${className}`}>
      {/* ─ Rating + Date ─────────────────────────────────── */}
      <header className="mb-6 flex items-start justify-between">
        <div className="flex space-x-1 text-[#494791]">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className={`h-5 w-5 ${i < rating ? "fill-current" : "fill-gray-500/70"}`}>
              <path d="M12 17.27l6.18 3.73-1.64-7.19L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.57L5.82 21z" />
            </svg>
          ))}
        </div>

        {date && (
          <time dateTime={date} className="text-sm text-gray-500">
            {date}
          </time>
        )}
      </header>

      {/* ─ Author row ────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
        {avatarSrc && <Image src={avatarSrc} alt={name} width={40} height={40} className="rounded-full" />}
        <h3 className="font-semibold">{name}</h3>
        {aboutHref && aboutText && (
          <Link href={aboutHref} className=" ml-auto   decoration-2 underline-offset-2 hover:text-indigo-800">
            About&nbsp;
            <span className="underline underline-offset-2 text-[color:var(--color-purple)]">{aboutText}</span>
          </Link>
        )}
      </div>

      {/* ─ Review text ───────────────────────────────────── */}
      <h4 className="mb-2 text-xl font-bold">{title}</h4>
      <div className="mb-4 leading-relaxed">
        <p>
          {displayBody}
          {CutTruncate && !isExpanded && "..."}
        </p>
        {CutTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[color:var(--color-purple)] hover:text-[color:var(--color-light-purple)] underline underline-offset-2 mt-1 block"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* ─ Thumbnail gallery (max 4) - only show when expanded or not collapsible ─ */}
      {images.length > 0 && (!collapsible || isExpanded) && (
        <div className="flex gap-3">
          {images.slice(0, 4).map((src, idx) => (
            <div key={idx} className="relative aspect-square flex-1">
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
