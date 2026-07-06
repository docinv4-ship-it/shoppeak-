import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/aliexpress";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  let keywords = searchParams.get("q") || "";
  const categoryId = searchParams.get("cat") || undefined;

  // Global Multi-lingual and alphanumeric sanitization layer
  keywords = keywords
    .replace(/[^\w\s\-\u0400-\u04FF]/g, " ") 
    .replace(/\s+/g, " ")
    .trim();

  // FIX 1: Strict Override Fallback Protection
  if (!keywords) {
    keywords = categoryId ? "" : "trending products";
  } else {
    // FIX 2: Deep Search Keyword Limiter
    const words = keywords.split(/\s+/);
    if (words.length > 3 && categoryId) {
      keywords = words.slice(0, 3).join(" ");
    }
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);
  
  let minPrice = searchParams.get("minPrice") || undefined;
  let maxPrice = searchParams.get("maxPrice") || undefined;
  
  if (minPrice && maxPrice) {
    const minNum = parseFloat(minPrice);
    const maxNum = parseFloat(maxPrice);
    if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
      minPrice = String(maxNum);
      maxPrice = String(minNum);
    }
  }

  const sort = searchParams.get("sort") || undefined;
  const seed = parseInt(searchParams.get("seed") || "0");

  try {
    const result = await searchProducts(keywords, { page, pageSize, categoryId, minPrice, maxPrice, sort, seed });

    // FIX 3: Multi-Tiered Empty Pool Fallback Engine
    const hasNoProducts = !result || !result.products || result.products.length === 0;
    
    if (hasNoProducts && keywords !== "") {
      const words = keywords.split(/\s+/);
      
      if (words.length > 2) {
        const reducedKeywords = words.slice(0, 2).join(" ");
        const retryResult = await searchProducts(reducedKeywords, { page, pageSize, categoryId, minPrice, maxPrice, sort, seed });
        if (retryResult && retryResult.products && retryResult.products.length > 0) {
          return NextResponse.json(retryResult, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
          });
        }
      }

      if (categoryId) {
        const fallbackResult = await searchProducts("", { page, pageSize, categoryId, minPrice, maxPrice, sort, seed });
        return NextResponse.json(fallbackResult, {
          headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
      }
      
      const absoluteFallback = await searchProducts("best sellers", { page, pageSize, minPrice, maxPrice, sort, seed });
      return NextResponse.json(absoluteFallback, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("Search API Failure Engine Log:", error);
    return NextResponse.json({ error: "Failed to fetch products", products: [], totalPage: 1, currentPage: 1 }, { status: 500 });
  }
}
