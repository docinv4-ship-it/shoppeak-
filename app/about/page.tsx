import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

export const metadata = { title: "About ShopPeak — Your Trusted Affiliate Marketplace" };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-1 mb-4">
          <span className="text-white font-black text-4xl bg-orange-500 px-2 py-1 rounded-l-xl">Shop</span>
          <span className="bg-gray-800 text-orange-400 font-black text-4xl px-2 py-1 rounded-r-xl">Peak</span>
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-3">About ShopPeak</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Your trusted gateway to millions of products from AliExpress — curated, organized, and powered by real affiliate partnerships.
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8">
        <h2 className="text-xl font-bold mb-2">Our Mission</h2>
        <p className="text-orange-100">
          ShopPeak connects you with the world&apos;s largest marketplace — AliExpress — through a clean, fast, and beautifully organized shopping experience. We believe everyone deserves access to quality products at fair prices, with the transparency of knowing exactly how our platform works.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { icon: "🌍", title: "Worldwide Reach", desc: "Access millions of products from sellers across the globe, shipping to 200+ countries." },
          { icon: "💰", title: "Best Prices", desc: "Direct-from-manufacturer pricing with no middlemen. Save 40-80% vs retail." },
          { icon: "🔒", title: "Buyer Protection", desc: "All purchases backed by AliExpress Buyer Protection — full refund if items don't arrive." },
        ].map(item => (
          <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-5 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">How ShopPeak Works</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Browse & Discover", desc: "Search millions of products across categories — phones, jewelry, electronics, home decor, fashion, and more." },
            { step: "2", title: "Compare & Decide", desc: "Read product details, view ratings, compare prices, and use our comparison tool." },
            { step: "3", title: "Buy on AliExpress", desc: "Click the Buy button — you're taken directly to AliExpress where you complete your purchase securely." },
            { step: "4", title: "We Earn a Commission", desc: "When you purchase, we earn a small affiliate commission from AliExpress at no extra cost to you." },
          ].map(item => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{item.step}</div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Product Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 transition-colors">
              <span>{cat.icon}</span>{cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/affiliate-disclosure" className="text-orange-500 text-sm hover:underline mr-4">Affiliate Disclosure</Link>
        <Link href="/contact" className="text-orange-500 text-sm hover:underline mr-4">Contact Us</Link>
        <Link href="/blog" className="text-orange-500 text-sm hover:underline">Blog</Link>
      </div>
    </div>
  );
}
