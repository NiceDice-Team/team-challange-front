import Image from "next/image";
import Link from "next/link";

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
}) {
  return (
    <article className=" bg-[#EEEEEE] p-6 shadow flex flex-col justify-between">
      {/* ─ Rating + Date ─────────────────────────────────── */}
      <header className="mb-4 flex items-start justify-between">
        <div className="flex space-x-1 text-[#494791]">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className={`h-5 w-5 ${i < rating ? "fill-current" : "fill-gray-500/70"}`}>
              <path d="M12 17.27l6.18 3.73-1.64-7.19L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.57L5.82 21z" />
            </svg>
          ))}
        </div>

        {date && (
          <time dateTime={date} className="text-sm text-gray-400">
            {date}
          </time>
        )}
      </header>

      {/* ─ Author row ────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-3">
        {avatarSrc && <Image src={avatarSrc} alt={name} width={40} height={40} className="rounded-full" />}
        <h3 className="font-semibold">{name}</h3>
        {aboutHref && aboutText && (
          <Link href={aboutHref} className="ml-auto   decoration-2 underline-offset-2 hover:text-indigo-800">
            About&nbsp;<span className="underline">{aboutText}</span>
          </Link>
        )}
      </div>

      {/* ─ Review text ───────────────────────────────────── */}
      <h4 className="mb-2 text-xl font-bold">{title}</h4>
      <p className="mb-4 leading-relaxed">{body}</p>

      {/* ─ Thumbnail gallery (max 4) ─────────────────────── */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((src, idx) => (
            <div key={idx} className="relative h-16 w-16 ">
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
