import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/aliexpress";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  let keywords = searchParams.get("q") || "";
  const categoryId = searchParams.get("cat") || undefined;

  // FIX 1: Strict Override Fallback Protection
  // Agar category select hai aur keywords khali hain, to default string bypass karein taake filter block na ho.
  if (!keywords) {
    keywords = categoryId ? "" : "trending products";
  } else {
    // FIX 2: Deep Search Keyword Limiter
    // Agar keyword string bohot lamba hai, to AliExpress strict AND index ko break hone se bachane ke liye pehle 2 words lein.
    const words = keywords.trim().split(/\s+/);
    if (words.length > 2 && categoryId) {
      keywords = words.slice(0, 2).join(" ");
    }
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const seed = parseInt(searchParams.get("seed") || "0");

  try {
    const result = await searchProducts(keywords, { page, pageSize, categoryId, minPrice, maxPrice, sort, seed });
    
    // FIX 3: Empty Pool Fallback Trigger
    // Agar rigid API condition ki wajah se 0 products aayein, to keywords hata kar sirf pure category base par instant query refetch karein.
    if ((!result || !result.products || result.products.length === 0) && categoryId && keywords !== "") {
      const fallbackResult = await searchProducts("", { page, pageSize, categoryId, minPrice, maxPrice, sort, seed });
      return NextResponse.json(fallbackResult, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products", products: [], totalPage: 1, currentPage: 1 }, { status: 500 });
  }
}
