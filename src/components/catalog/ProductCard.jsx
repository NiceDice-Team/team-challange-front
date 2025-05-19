import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ date, readingTime, name, category, imageSrc, blogUrl }) {
  return (
    <article className=" flex flex-col ">
      {/* Product Card Image */}
      <div className="relative h-48 w-full">
        <Image src={imageSrc} alt={name} fill className="object-cover" />
      </div>
      {/* Product Card Details */}
      <div className="flex flex-col justify-between mt-1">
        <p className="text-sm text-gray-500 mt-3">
          {date} - {readingTime} min read
        </p>
        <h3 className="text-lg font-medium ">{name}</h3>

        <Link href={blogUrl} className="text-sm mt-3  inline-block text-indigo-600 hover:underline">
          Read full article<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}
