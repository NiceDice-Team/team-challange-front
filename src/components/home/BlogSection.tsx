import React from "react";
import BlogCard from "./BlogCard";
import Link from "next/link";

export default function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      date: "May 20, 2026",
      readingTime: 5,
      name: "Heat: Legends review",
      category: "Game Review",
      imageSrc:
        "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/POST_1.png?v=1779286336",
      blogUrl: "/blog/heat-legends-review",
    },
    {
      id: 2,
      date: "May 15, 2023",
      readingTime: 7,
      name: "Zombicide series resurfaces after publisher goes under",
      category: "Game Tutorial",
      imageSrc:
        "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/Zombicide_Dead_Men_Tales.png?v=1777380195",
      blogUrl: "/blog/zombicide-series-resurfaces-after-publisher-goes-under",
    },
    {
      id: 3,
      date: "May 27, 2026",
      readingTime: 40,
      name: "A new edition of Catan is coming!",
      category: "Game Review",
      imageSrc:
        "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/Untitled_design_6_ac6549d0-1af3-44f6-85e3-2a7f0dfe0ed7.png?v=1779438139",
      blogUrl: "/blog/a-new-edition-of-catan-is-coming",
    },
  ];

  return (
    <section id="blog" className="  mb-25 px-8 lg:px-50">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-semibold tracking-wide uppercase mb-8">
            Check out our blogs
          </h2>
          <Link
            href="/blog"
            className="self-end mb-8 md:mb-0  md:self-start underline underline-offset-2 text-nowrap pointer"
          >
            view all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              date={post.date}
              readingTime={post.readingTime}
              name={post.name}
              category={post.category}
              imageSrc={post.imageSrc}
              blogUrl={post.blogUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
