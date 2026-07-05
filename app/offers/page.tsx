import Link from "next/link";
import { searchProducts } from "@/lib/aliexpress";
import ProductGrid from "@/components/ProductGrid";
import { Tag, Package, Zap, Gift, Calendar, Star } from "lucide-react";

export const metadata = { title: "Special Offers — ShopPeak" };
export const revalidate = 3600;

const OFFER_COLLECTIONS = [
  { slug: "tech-bundle", title: "Tech Starter Bundle", icon: "💻", desc: "Best gadgets under $50", keyword: "gadget tech under 50 starter kit", color: "from-blue-500 to-purple-600" },
  { slug: "home-essentials", title: "Home Essentials Pack", icon: "🏠", desc: "Must-haves for every home", keyword: "home essential kit appliance", color: "from-orange-500 to-red-500" },
  { slug: "beauty-kit", title: "Beauty & Skincare Kit", icon: "✨", desc: "Top-rated beauty products", keyword: "beauty skincare kit women popular", color: "from-pink-500 to-rose-500" },
  { slug: "fitness-set", title: "Fitness Starter Set", icon: "💪", desc: "Get fit with top gear", keyword: "fitness gym home workout equipment", color: "from-green-500 to-teal-600" },
  { slug: "office-kit", title: "Work From Home Kit", icon: "🖥️", desc: "Productivity essentials", keyword: "office work home kit accessories desk", color: "from-gray-600 to-gray-800" },
  { slug: "travel-gear", title: "Travel Essentials", icon: "✈️", desc: "Everything for your trip", keyword: "travel accessories luggage portable", color: "from-sky-500 to-blue-600" },
];

async function FeaturedOfferProducts({ keyword }: { keyword: string }) {
  const result = await searchProducts(keyword, { pageSize: 4 });
  if (!result.products.length) return null;
  return <ProductGrid products={result.products} cols={4} size="sm" />;
}

export default function OffersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Tag size={28} className="text-yellow-300" />
          <h1 className="text-3xl font-black">Special Offers</h1>
        </div>
        <p className="text-orange-100 mb-4">Curated bundles, exclusive deals, and smart savings collections</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/offers/boxes" className="bg-white text-orange-600 font-bold px-4 py-2 rounded-full hover:bg-orange-50 transition-colors flex items-center gap-2">
            <Package size={15} /> Box Offers
          </Link>
          <Link href="/deals/daily" className="bg-white/20 text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2">
            <Zap size={15} /> Daily Deals
          </Link>
          <Link href="/deals/monthly" className="bg-white/20 text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2">
            <Calendar size={15} /> Monthly Deals
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { href: "/deals", label: "Flash Deals", icon: Zap, color: "bg-red-50 text-red-600 border-red-100" },
          { href: "/trending", label: "Trending", icon: Star, color: "bg-orange-50 text-orange-600 border-orange-100" },
          { href: "/new-arrivals", label: "New Arrivals", icon: Gift, color: "bg-purple-50 text-purple-600 border-purple-100" },
          { href: "/offers/boxes", label: "Box Offers", icon: Package, color: "bg-blue-50 text-blue-600 border-blue-100" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href} className={`flex items-center gap-2 p-4 rounded-xl border ${color} font-semibold text-sm hover:shadow-md transition-all`}>
            <Icon size={18} /> {label}
          </Link>
        ))}
      </div>

      {/* Offer Collections */}
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-orange-500 w-1 h-6 rounded inline-block"></span>
        Curated Collections
      </h2>

      <div className="space-y-10">
        {OFFER_COLLECTIONS.map(collection => (
          <div key={collection.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className={`bg-gradient-to-r ${collection.color} p-5 flex items-center justify-between`}>
              <div className="flex items-center gap-3 text-white">
                <span className="text-3xl">{collection.icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{collection.title}</h3>
                  <p className="text-sm opacity-90">{collection.desc}</p>
                </div>
              </div>
              <Link
                href={`/offers/${collection.slug}`}
                className="bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-50 transition-colors shrink-0"
              >
                View All →
              </Link>
            </div>
            <div className="p-4">
              <FeaturedOfferProducts keyword={collection.keyword} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
