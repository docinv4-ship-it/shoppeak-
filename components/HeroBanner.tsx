import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 text-white rounded-xl overflow-hidden mb-6">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="inline-block bg-yellow-400 text-orange-900 text-xs font-bold px-2 py-0.5 rounded mb-3">
            🔥 FLASH SALE — LIMITED TIME
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
            Millions of Products,<br />Unbeatable Prices
          </h1>
          <p className="text-orange-100 mb-4 text-sm md:text-base">
            Discover phones, electronics, jewelry, home decor, and more — shipped worldwide.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/deals"
              className="bg-white text-orange-600 font-bold px-6 py-2.5 rounded-full hover:bg-orange-50 transition-colors text-sm"
            >
              🔥 Shop Deals
            </Link>
            <Link
              href="/categories"
              className="border-2 border-white text-white font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-orange-600 transition-colors text-sm"
            >
              Browse Categories
            </Link>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {[
            { icon: "📱", label: "Phones" },
            { icon: "💎", label: "Jewelry" },
            { icon: "🔌", label: "Electronics" },
            { icon: "🛋️", label: "Home" },
            { icon: "👗", label: "Fashion" },
            { icon: "🚗", label: "Auto" },
          ].map((item) => (
            <div key={item.label} className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 text-center min-w-[56px]">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-xs font-medium mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
