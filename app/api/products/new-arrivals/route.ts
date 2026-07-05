import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/aliexpress";

const NEW_ARRIVAL_KEYWORDS = [
  "new phone 2024", "new watch", "new fashion 2024", "new electronics",
  "new laptop", "new shoes", "new jewelry", "new headphones",
  "new camera", "new tablet", "new gaming", "new smartwatch",
  "new bag", "new perfume", "new LED", "new keyboard",
  "new sunglasses", "new earrings", "new speaker", "new drone",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);
  const categoryId = searchParams.get("cat") || undefined;
  const seed = parseInt(searchParams.get("seed") || "0");

  const kwIdx = (page + Math.floor(seed / 1000)) % NEW_ARRIVAL_KEYWORDS.length;
  const keyword = NEW_ARRIVAL_KEYWORDS[kwIdx];

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
