import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/aliexpress";

// Proven keywords that return 47-50 products (verified against AliExpress API)
const FEATURED_KEYWORDS = [
  "top rated",
  "best seller",
  "most popular",
  "popular sale",
  "flash sale",
  "best price",
  "hot item",
  "top deal",
  "clearance sale",
  "special offer",
  "best value",
  "mega sale",
  "great deal",
  "top seller",
  "new arrival",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);
  const categoryId = searchParams.get("cat") || undefined;
  const seed = parseInt(searchParams.get("seed") || "0");

  const keyword = FEATURED_KEYWORDS[(page + seed) % FEATURED_KEYWORDS.length];

  try {
    const result = await searchProducts(keyword, { page, pageSize, categoryId, seed });
    return NextResponse.json(
      { ...result, totalPage: Math.max(result.totalPage, 100) },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed", products: [], totalPage: 1, currentPage: 1 }, { status: 500 });
  }
}
