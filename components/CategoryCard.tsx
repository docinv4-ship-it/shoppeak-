import Link from "next/link";
import { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
  variant?: "grid" | "list";
}

export default function CategoryCard({ category, variant = "grid" }: CategoryCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all"
      >
        <span className="text-2xl">{category.icon}</span>
        <div>
          <p className="font-medium text-sm text-gray-800">{category.name}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all text-center gap-2"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</span>
      <p className="text-xs font-medium text-gray-700 leading-tight line-clamp-2">{category.name}</p>
    </Link>
  );
}
