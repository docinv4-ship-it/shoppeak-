import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";
import { Clock, User, ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/lib/aliexpress";

async function RelatedProducts({ keywords }: { keywords: string }) {
  const result = await searchProducts(keywords, { pageSize: 5 });
  return result.products.length > 0 ? (
    <div className="mt-8">
      <h3 className="font-bold text-gray-800 mb-4">Shop Related Products</h3>
      <ProductGrid products={result.products} cols={5} />
    </div>
  ) : null;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/blog" className="flex items-center gap-1 text-orange-500 text-sm hover:underline mb-4">
        <ChevronLeft size={16} />Back to Blog
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <span className="inline-block bg-white/20 text-xs font-bold px-2 py-0.5 rounded mb-3">{post.category}</span>
          <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-orange-100">
            <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
            <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-base leading-relaxed mb-6 font-medium border-l-4 border-orange-400 pl-4 italic">{post.excerpt}</p>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {post.content.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="text-lg font-bold text-gray-800 mt-5 mb-2">{para.replace(/\*\*/g, "")}</h3>;
              }
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="mb-4">
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
                      : part
                  )}
                </p>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
            <p className="font-bold mb-1">📢 Affiliate Disclosure</p>
            <p className="text-orange-700 text-xs">This article contains affiliate links. ShopPeak earns a small commission when you purchase through our links, at no extra cost to you. <Link href="/affiliate-disclosure" className="underline">Learn more</Link></p>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="mt-8 h-40 bg-gray-100 rounded-xl animate-pulse" />}>
        <RelatedProducts keywords={post.category + " " + post.title.split(" ").slice(0, 3).join(" ")} />
      </Suspense>

      <div className="mt-6">
        <h3 className="font-bold text-gray-700 mb-3">More Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 2).map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white border border-gray-100 rounded-xl p-3 hover:border-orange-200 transition-colors">
              <span className="text-xs text-orange-500 font-bold">{p.category}</span>
              <p className="text-sm font-medium text-gray-700 mt-1 line-clamp-2">{p.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
