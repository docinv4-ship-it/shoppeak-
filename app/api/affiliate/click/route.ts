import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, title, price, source, category } = body;

    // Log click server-side (no secrets exposed)
    console.log("[Affiliate Click]", {
      productId,
      title: title?.slice(0, 50),
      price,
      source,
      category,
      timestamp: new Date().toISOString(),
      ua: req.headers.get("user-agent")?.slice(0, 80),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
