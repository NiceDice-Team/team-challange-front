import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ date, readingTime, name, category, imageUrl, blogUrl }) {
  return (
    <article className=" flex flex-col ">
      {/* Blog Card Image */}
      <div className="relative h-48 w-full">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>
      {/* Blog Card Details */}
      <div className="flex flex-col justify-between gap-4">
        <p className="text-sm text-gray-500 mt-3">
          {date} - {readingTime} min read
        </p>
        <h3 className="text-lg font-medium ">{name}</h3>
        <p className="text-white text-sm   ">
          <span className="bg-[#9796BE] p-1 rounded-sm">{category}</span>
        </p>
        <Link href={blogUrl} className="text-sm  inline-block text-indigo-600 hover:underline">
          Read full article<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}
