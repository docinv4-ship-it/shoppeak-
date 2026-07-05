import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";
import { Clock, User } from "lucide-react";

export const metadata = { title: "Blog & Reviews — ShopPeak" };

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog & Product Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Expert guides, buying advice, and product comparisons</p>
      </div>

      {/* Featured post */}
      <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="block bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8 hover:opacity-95 transition-opacity">
        <div className="inline-block bg-white/20 text-xs font-bold px-2 py-0.5 rounded mb-2">{BLOG_POSTS[0].category}</div>
        <h2 className="text-2xl font-bold mb-2">{BLOG_POSTS[0].title}</h2>
        <p className="text-orange-100 text-sm mb-3">{BLOG_POSTS[0].excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-orange-200">
          <span className="flex items-center gap-1"><User size={12} />{BLOG_POSTS[0].author}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{BLOG_POSTS[0].readTime}</span>
          <span>{new Date(BLOG_POSTS[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BLOG_POSTS.slice(1).map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-orange-200 hover:shadow-md transition-all">
            <div className="p-4">
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded mb-2">{post.category}</span>
              <h2 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm">{post.title}</h2>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
