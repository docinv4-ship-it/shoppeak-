import { getUnderFiveShop } from "@/lib/aliexpress";
import ProductCard from "@/components/ProductCard";
import UnderFiveDropdown from "@/components/UnderFiveDropdown"; 
import Link from "next/link";

export const metadata = {
  title: "$1 to $5 Super Thrift Arcade | ShopPeak",
  description: "Browse premium high-volume utility gadgets, fashion jewelry and mobile gear strictly from $1 to $5.",
};

const filters = [
  { label: "✨ All Deals", key: "gadgets" },
  { label: "💍 Luxury Rings", key: "luxury rings" },
  { label: "📿 Necklaces & Pendants", key: "pendant necklace" },
  { label: "✨ Bracelets & Bangles", key: "charm bracelet" },
  { label: "💎 Premium Earrings", key: "stud earrings" },
  { label: "⌚ Watch Straps & Bands", key: "watch strap" },
  { label: "🎀 Hair Accessories", key: "hair claws" },
  { label: "🕶️ Trendy Sunglasses", key: "retro sunglasses" },
  { label: "🔑 Cute Keychains", key: "keychain pendant" },
  { label: "🧣 Scarves & Gloves", key: "silk scarf" },
  { label: "⚡ Tech Gadgets", key: "mini gadgets" },
  { label: "📱 Mobile Acc", key: "iphone case" },
  { label: "🎧 Audio & Cases", key: "airpods case" },
  { label: "💻 Desk & PC Gear", key: "mouse pad" },
  { label: "💡 LED & Night Lights", key: "rgb strip light" },
  { label: "🏠 Home Hacks", key: "home gadgets" },
  { label: "🍳 Kitchen Tools", key: "kitchen tools" },
  { label: "💄 Beauty & Makeup", key: "makeup brushes" },
  { label: "🧴 Personal Care", key: "face massager" },
  { label: "🚗 Car Gadgets", key: "car phone mount" },
  { label: "👜 Mini Bags & Pouches", key: "crossbody bag" },
  { label: "👟 Shoe Care & Socks", key: "sneaker socks" },
  { label: "✈️ Travel Gear", key: "travel bottles" },
  { label: "🐾 Pet Essentials", key: "dog collar" },
  { label: "🧸 Cute Toys & Gifts", key: "plush toy" },
  { label: "✒️ Cute Stationery", key: "gel pens" }
];

export default async function UnderFiveShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; cat?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const currentSort = resolvedParams.sort || "VOLUME_DESC";

  const rawCat = resolvedParams.cat || "";
  const currentKeyword = rawCat ? decodeURIComponent(rawCat) : "gadgets";

  const data = await getUnderFiveShop({
    page: currentPage,
    pageSize: 40,
    sort: currentSort,
    keyword: currentKeyword,
  });

  // 🛠️ FIX: Strict Front-end Sanity Guardrail Check
  // Agar API dashboard se koi product $5 se upar ka aa bhi gaya, toh filter code usay block kar dega.
  const verifiedProducts = data?.products ? data.products.filter(p => Number(p.sale_price) <= 5.00) : [];

  return (
    <main className="bg-white min-h-screen max-w-7xl mx-auto px-4 py-12 selection:bg-orange-500 selection:text-white">
      {/* Premium Elegant Header */}
      <div className="text-center mb-10 border-b border-gray-100 pb-8">
        <span className="text-xs font-mono uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">
          The Arcade Station
        </span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mt-3">
          Everything Under <span className="text-orange-500">$5</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-xs md:text-sm">
          High quality dynamic utility hacks, viral tech setups and fine lifestyle choices starting at $1.
        </p>
      </div>

      {/* Dynamic Dropdown Category Filter Selection Area */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 bg-gray-50 p-4 rounded-xl border border-gray-100 max-w-xl mx-auto">
        <label htmlFor="cat-dropdown" className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold shrink-0">
          Select Category:
        </label>
        <div className="relative w-full">
          <UnderFiveDropdown 
            filters={filters} 
            currentKeyword={currentKeyword} 
            currentSort={currentSort} 
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 border-l border-gray-100">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Product Feed Grid Layout */}
      {verifiedProducts && verifiedProducts.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {verifiedProducts.map((p) => (
              <ProductCard
                key={p.product_id}
                id={p.product_id}
                title={p.product_title}
                image={p.product_main_image_url}
                salePrice={p.sale_price}
                originalPrice={p.original_price}
                discount={p.discount}
                rating={p.evaluate_rate}
                soldCount={p.lastest_volume}
                category={p.first_level_category_name}
                source="under_5_shop"
              />
            ))}
          </div>

          {/* Clean Functional Native Micro-Pagination Bar */}
          <div className="mt-16 flex justify-center items-center gap-2 border-t border-gray-100 pt-8">
            {currentPage > 1 && (
              <Link
                href={`/under-5-shop?page=${currentPage - 1}&cat=${encodeURIComponent(currentKeyword)}&sort=${currentSort}`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-all bg-white shadow-sm"
              >
                ← Previous
              </Link>
            )}
            <span className="text-xs font-mono font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
              Page {currentPage} of {data.totalPage || 200}
            </span>
            {currentPage < (data.totalPage || 200) && (
              <Link
                href={`/under-5-shop?page=${currentPage + 1}&cat=${encodeURIComponent(currentKeyword)}&sort=${currentSort}`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-sm"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-2xl max-w-md mx-auto">
          <p className="text-gray-400 font-medium text-sm">No viral items matching context at this moment.</p>
          <Link href="/under-5-shop" className="mt-3 inline-block text-xs font-bold text-orange-500 hover:underline">
            Reset Store Feed
          </Link>
        </div>
      )}
    </main>
  );
}
