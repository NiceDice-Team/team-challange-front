import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getBlogPostBySlug } from "../data/ blogPosts";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[800px] px-4 py-8">
      <Link href="/blog" className="text-[#494791] hover:underline">
        ← Back to blog
      </Link>

      <p className="mt-6 text-sm text-gray-500">
        {post.date} · {post.readingTime} min read · {post.category}
      </p>

      <h1 className="mt-4 text-3xl font-semibold uppercase">{post.title}</h1>

      <div className="relative mt-8 h-[320px] w-full">
        <Image
          src={post.imageSrc}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <p className="mt-8 text-lg text-gray-700">{post.excerpt}</p>

      <div className="mt-6 space-y-4 text-base leading-7 text-[#040404]">
        {post.content.map((paragraph, index) => (
          <>
            <div>
              <h2 className="text-2xl font-bold">{paragraph.title}</h2>

              {paragraph.content.map((content, index) => (
                <p key={index} className="mt-4">
                  {content}
                </p>
              ))}
              {paragraph.imageSrc && (
                <Image
                  src={paragraph.imageSrc}
                  alt={paragraph.title}
                  width={1000}
                  height={1000}
                  className="mt-4"
                />
              )}
            </div>
          </>
        ))}
      </div>
    </article>
  );
}
