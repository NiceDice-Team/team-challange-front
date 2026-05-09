"use client";

import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";

interface BlogCardProps {
  date: string;
  readingTime: number;
  name: string;
  imageSrc: StaticImageData | string;
  blogUrl: string;
}

export default function BlogCard({ date, readingTime, name, imageSrc, blogUrl }: BlogCardProps) {
  const { t } = useTranslation();

  return (
    <article className=" flex flex-col ">
      {/* Blog Card Image */}
      <div className="relative h-48 w-full">
        <Image src={imageSrc} alt={name} fill className="object-cover" />
      </div>
      {/* Blog Card Details */}
      <div className="flex flex-col justify-between mt-1">
        <p className="text-sm text-gray-500 mt-3">{t("layout.blog.metaLine", { date, count: readingTime })}</p>
        <h3 className="text-lg font-medium ">{name}</h3>

        <Link href={blogUrl} className="text-sm mt-3  inline-block text-indigo-600 hover:underline">
          {t("layout.blog.readFullArticle")}
          <span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}
