import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const affiliateId = process.env.ALIEXPRESS_AFFILIATE_ID || "ShopPeak666";
  const appKey = process.env.ALIEXPRESS_APP_KEY || "";

  // Log the affiliate click server-side
  const source = searchParams.get("src") || "unknown";
  const category = searchParams.get("cat") || "";
  const title = searchParams.get("title") || "";
  console.log("[AffiliateClick]", JSON.stringify({
    productId: id,
    source,
    category,
    title: title.slice(0, 60),
    timestamp: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") || "unknown",
    ua: req.headers.get("user-agent")?.slice(0, 80),
  }));

  // Build the affiliate URL with proper tracking params
  const affiliateUrl = new URL(`https://www.aliexpress.com/item/${id}.html`);
  affiliateUrl.searchParams.set("aff_fcid", affiliateId);
  affiliateUrl.searchParams.set("aff_fsk", affiliateId);
  affiliateUrl.searchParams.set("aff_platform", "portals-tool");
  affiliateUrl.searchParams.set("sk", affiliateId);
  if (appKey) affiliateUrl.searchParams.set("aff_trace_key", `${affiliateId}-${id}`);
  affiliateUrl.searchParams.set("terminal_id", affiliateId);
  affiliateUrl.searchParams.set("afSmartRedirect", "y");

  return NextResponse.redirect(affiliateUrl.toString(), {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
      "X-Affiliate-Click": "1",
    },
  });
}
