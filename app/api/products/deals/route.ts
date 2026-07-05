import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/aliexpress";

// Proven keywords — each returns 47-50 products from AliExpress API (verified)
const DEAL_KEYWORDS = [
  "best price",
  "top deal",
  "popular sale",
  "clearance sale",
  "special offer",
  "flash sale",
  "best value",
  "hot item",
  "top rated",
  "most popular",
  "mega sale",
  "big discount",
  "great deal",
  "top seller",
  "good deal",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);
  const category = searchParams.get("cat") || undefined;
  const seed = parseInt(searchParams.get("seed") || "0");
  // Allow caller to override keyword, or pick from proven rotation
  const keyword = searchParams.get("q") || DEAL_KEYWORDS[(page + Math.floor(seed / 100)) % DEAL_KEYWORDS.length];

  try {
    const result = await searchProducts(keyword, {
      page,
      pageSize,
      categoryId: category,
      sort: "DISCOUNT_DESC",
      seed,
    });

    return NextResponse.json(
      { ...result, totalPage: Math.max(result.totalPage, 100) },
      { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed", products: [], totalPage: 1, currentPage: 1 }, { status: 500 });
  }
}
