import { getUnderFiveShop } from "@/lib/aliexpress";
import ProductCard from "@/components/ProductCard";
import Link from "next/link"; // FIXED: Changed from "next/next" to "next/link"

export const metadata = {
  title: "$1 to $5 Super Thrift Arcade | ShopPeak",
  description: "Browse premium high-volume utility gadgets, fashion jewelry and mobile gear strictly from $1 to $5.",
};

const filters = [
  { label: "✨ All Deals", key: "useful gadgets smart tools kitchen lifestyle hot gadgets" },
  { label: "💍 Luxury Rings", key: "luxury rings adjustable couple titanium steel ring" },
  { label: "📿 Necklaces & Pendants", key: "pendant necklace choker chain minimalist sterling silver" },
  { label: "✨ Bracelets & Bangles", key: "charm bracelet bangle cuff leather beaded bracelets" },
  { label: "💎 Premium Earrings", key: "stud earrings hoop drop zircon crystal earrings dangle" },
  { label: "⌚ Watch Straps & Bands", key: "apple watch band samsung strap milanese loop silicone" },
  { label: "🎀 Hair Accessories", key: "hair claws clips headbands silk scrunchies fashion pins" },
  { label: "🕶️ Trendy Sunglasses", key: "retro sunglasses uv400 vintage eyewear fashion glasses" },
  { label: "🔑 Cute Keychains", key: "keychain pendant bag charm car key ring anime leather" },
  { label: "🧣 Scarves & Gloves", key: "silk scarf warm gloves bucket hat winter beanie unisex" },
  { label: "⚡ Tech Gadgets", key: "mini electronic gadgets led lights smart smart accessories" },
  { label: "📱 Mobile Acc", key: "iphone case fast charging cable phone stand magsafe wallet" },
  { label: "🎧 Audio & Cases", key: "airpods case protective cover wire organizer earphone pouch" },
  { label: "💻 Desk & PC Gear", key: "mouse pad rgb keyboard cleaning brush usb hub desk organizer" },
  { label: "💡 LED & Night Lights", key: "rgb strip light desk lamp neon sign motion sensor night light" },
  { label: "🏠 Home Hacks", key: "smart home gadgets organization storage clips decor lights" },
  { label: "🍳 Kitchen Tools", key: "kitchen peeler slicer silicone mold cleaning brush whisk" },
  { label: "💄 Beauty & Makeup", key: "makeup brushes blending sponge nail art sticker lip gloss" },
  { label: "🧴 Personal Care", key: "face massager electric toothbrush head massager comb nail clipper" },
  { label: "🚗 Car Gadgets", key: "car phone mount charger air freshener organizer cleaning gel" },
  { label: "👜 Mini Bags & Pouches", key: "crossbody bag coin purse cosmetic pouch canvas tote card holder" },
  { label: "👟 Shoe Care & Socks", key: "sneaker socks shoelaces anti crease protector insoles" },
  { label: "✈️ Travel Gear", key: "travel bottles luggage tag passport holder neck pillow organizer" },
  { label: "🐾 Pet Essentials", key: "dog collar cat toy pet grooming brush feeding bowl led collar" },
  { label: "🧸 Cute Toys & Gifts", key: "plush toy fidget spinner anime figure building blocks stickers" },
  { label: "✒️ Cute Stationery", key: "gel pens aesthetic notebook sticky notes tape cutter organizer" }
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
  const currentKeyword = rawCat ? decodeURIComponent(rawCat) : "useful gadgets smart tools kitchen lifestyle hot gadgets";

  const data = await getUnderFiveShop({
    page: currentPage,
    pageSize: 40,
    sort: currentSort,
    keyword: currentKeyword,
  });

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
          <select
            id="cat-dropdown"
            defaultValue={currentKeyword}
            onChange={(e) => {
              const val = encodeURIComponent(e.target.value);
              window.location.href = `/under-5-shop?cat=${val}&sort=${currentSort}`;
            }}
            className="w-full bg-white text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none cursor-pointer shadow-sm"
          >
            {filters.map((f) => (
              <option key={f.label} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 border-l border-gray-100">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Product Feed Grid Layout */}
      {data.products && data.products.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.products.map((p) => (
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
