import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return NextResponse.json({ rates: data.conversion_rates, base: "USD" });
  } catch {
    return NextResponse.json({ rates: { USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.36 }, base: "USD" });
  }
}
