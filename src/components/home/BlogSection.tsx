"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";

import BLOG_IMG1 from "../../../public/Blog/blog_1.png";
import BLOG_IMG2 from "../../../public/Blog/blog_2.png";
import BLOG_IMG3 from "../../../public/Blog/blog_3.png";

export default function BlogSection() {
  const { t } = useTranslation();

  const blogPosts = [
    {
      id: 1,
      postKey: "post1",
      readingTime: 5,
      imageSrc: BLOG_IMG1,
      blogUrl: "/blog/catan-ultimate-board-game-experience",
    },
    {
      id: 2,
      postKey: "post2",
      readingTime: 7,
      imageSrc: BLOG_IMG2,
      blogUrl: "/blog/future-of-react-2023",
    },
    {
      id: 3,
      postKey: "post3",
      readingTime: 40,
      imageSrc: BLOG_IMG3,
      blogUrl: "/blog/css-tips-and-tricks",
    },
  ];

  return (
    <section id="blog" className="  mb-25 px-8 lg:px-50">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-semibold tracking-wide uppercase mb-8">{t("layout.blog.title")}</h2>
          <div className="self-end mb-8 md:mb-0  md:self-start underline underline-offset-2 text-nowrap">
            {t("layout.blog.viewAll")}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              date={t(`layout.blog.posts.${post.postKey}.date`)}
              readingTime={post.readingTime}
              name={t(`layout.blog.posts.${post.postKey}.name`)}
              imageSrc={post.imageSrc}
              blogUrl={post.blogUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
