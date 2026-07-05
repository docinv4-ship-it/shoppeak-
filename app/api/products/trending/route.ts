import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/aliexpress";

const TRENDING_KEYWORDS = [
  "phone", "electronics", "watch", "jewelry", "laptop",
  "shoes", "fashion", "headphones", "camera", "tablet",
  "smartwatch", "gaming", "drone", "speaker", "keyboard",
  "sunglasses", "bag", "perfume", "earrings", "LED light",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);
  const categoryId = searchParams.get("cat") || undefined;
  const seed = parseInt(searchParams.get("seed") || "0");

  const kwIdx = (page + Math.floor(seed / 1000)) % TRENDING_KEYWORDS.length;
  const keyword = TRENDING_KEYWORDS[kwIdx];

  try {
    const result = await searchProducts(keyword, {
      page,
      pageSize,
      categoryId,
      seed,
    });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ products: [], totalPage: 1, currentPage: 1, totalCount: 0 }, { status: 500 });
  }
}
