import React from "react";
import BlogCard from "./BlogCard";

import BLOG_IMG1 from "../../../public/Blog/blog_1.png";
import BLOG_IMG2 from "../../../public/Blog/blog_2.png";
import BLOG_IMG3 from "../../../public/Blog/blog_3.png";

export default function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      date: "May 15, 2023",
      readingTime: 5,
      name: "Catan -The Ultimate Board Game Experience?",
      category: "Game Review",
      imageSrc: BLOG_IMG1,
      blogUrl: "/blog/catan-ultimate-board-game-experience",
    },
    {
      id: 2,
      date: "June 2, 2023",
      readingTime: 7,
      name: "D&D, How to Start Playing",
      category: "Game Tutorial",
      imageSrc: BLOG_IMG2,
      blogUrl: "/blog/future-of-react-2023",
    },
    {
      id: 3,
      date: "June 20, 2023",
      readingTime: 40,
      name: "Warhammer 40k - The Ultimate Guide",
      category: "Game Review",
      imageSrc: BLOG_IMG3,
      blogUrl: "/blog/css-tips-and-tricks",
    },
  ];

  return (
    <section className="  mb-25 px-8 lg:px-50">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-semibold tracking-wide uppercase mb-8">Check out our blogs</h2>
          <div className="self-start underline underline-offset-2">view all</div>
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
