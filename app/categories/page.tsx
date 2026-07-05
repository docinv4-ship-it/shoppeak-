import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

export const metadata = { title: "All Categories — ShopPeak" };

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Browse millions of products across every category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-md transition-all">
            <Link href={`/categories/${cat.slug}`} className="flex items-center gap-4 p-4 border-b border-gray-50">
              <span className="text-4xl">{cat.icon}</span>
              <div className="flex-1">
                <h2 className="font-bold text-gray-800">{cat.name}</h2>
                <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
              </div>
              <span className="text-orange-400 text-lg">›</span>
            </Link>
            <div className="p-3 grid grid-cols-2 gap-1">
              {cat.subcategories.slice(0, 4).map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/categories/${cat.slug}?sub=${sub.slug}&q=${encodeURIComponent(sub.keywords)}`}
                  className="text-xs text-gray-600 hover:text-orange-500 py-1 px-2 rounded hover:bg-orange-50 transition-colors truncate"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
