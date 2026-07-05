import Link from "next/link";
import { searchProducts } from "@/lib/aliexpress";
import ProductGrid from "@/components/ProductGrid";
import { Package } from "lucide-react";

export const metadata = { title: "Box Offers — ShopPeak" };
export const revalidate = 3600;

const BOXES = [
  { slug: "tech-starter-box", title: "Tech Starter Box", emoji: "💻", value: "$199", price: "$89", keyword: "phone accessories bluetooth gadget kit", items: 5 },
  { slug: "beauty-box", title: "Beauty Glow Box", emoji: "💄", value: "$120", price: "$55", keyword: "skincare beauty makeup kit women", items: 6 },
  { slug: "home-box", title: "Smart Home Box", emoji: "🏠", value: "$250", price: "$99", keyword: "smart home WiFi LED plug sensor", items: 4 },
  { slug: "fitness-box", title: "Fitness Pro Box", emoji: "🏋️", value: "$180", price: "$75", keyword: "gym workout resistance band home fitness", items: 6 },
  { slug: "kitchen-box", title: "Kitchen Essential Box", emoji: "🍳", value: "$150", price: "$65", keyword: "kitchen gadget cooking tool air fryer", items: 5 },
  { slug: "outdoor-box", title: "Outdoor Adventure Box", emoji: "🏕️", value: "$220", price: "$95", keyword: "outdoor camping hiking survival tool", items: 7 },
];

async function BoxProducts({ keyword }: { keyword: string }) {
  const result = await searchProducts(keyword, { pageSize: 4 });
  return <ProductGrid products={result.products} cols={4} size="sm" />;
}

export default function BoxOffersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Package size={28} className="text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">Box Offers</h1>
      </div>
      <p className="text-gray-500 mb-8">Curated product collections — better together, better value</p>

      <div className="space-y-8">
        {BOXES.map(box => (
          <div key={box.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{box.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{box.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-400 line-through text-sm">Value: {box.value}</span>
                    <span className="text-orange-600 font-black text-lg">{box.price}</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">SAVE BIG</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{box.items} curated products</p>
                </div>
              </div>
              <Link
                href={`/offers/${box.slug}`}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0"
              >
                View Box →
              </Link>
            </div>
            <div className="p-4">
              <BoxProducts keyword={box.keyword} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
