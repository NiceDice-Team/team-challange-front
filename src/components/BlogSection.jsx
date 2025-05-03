import React from "react";
import BlogCard from "./BlogCard";

export default function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      date: "May 15, 2023",
      readingTime: 5,
      name: "Catan -The Ultimate Board Game Experience?",
      category: "Game Review",
      imageUrl: "700x700.svg",
      blogUrl: "/blog/catan-ultimate-board-game-experience",
    },
    {
      id: 2,
      date: "June 2, 2023",
      readingTime: 7,
      name: "D&D, How to Start Playing",
      category: "Game Tutorial",
      imageUrl: "700x700.svg",
      blogUrl: "/blog/future-of-react-2023",
    },
    {
      id: 3,
      date: "June 20, 2023",
      readingTime: 40,
      name: "Warhammer 40k - The Ultimate Guide",
      category: "Game Review",
      imageUrl: "700x700.svg",
      blogUrl: "/blog/css-tips-and-tricks",
    },
  ];

  return (
    <section className="  mb-25">
      <div className="container mx-auto px-4">
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
              imageUrl={post.imageUrl}
              blogUrl={post.blogUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
