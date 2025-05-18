import BlogCard from "@/components/home/BlogCard";
import { blogPostsPreview } from "./data/ blogPosts";

const BlogPage = () => {
  return (
    <section id="blog" className="  mb-25 px-8 lg:px-50">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-semibold tracking-wide uppercase mb-8">
            Our Articles
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPostsPreview.map((post) => (
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
};

export default BlogPage;
