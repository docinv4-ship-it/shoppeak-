import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Help Center — ShopPeak" };
const TOPICS = [
  { icon: "🛒", title: "How to Shop", articles: ["Finding products", "Using search & filters", "Reading product pages", "Comparing products"] },
  { icon: "💳", title: "Orders & Payments", articles: ["How payment works", "AliExpress buyer protection", "Order tracking", "Cancelling an order"] },
  { icon: "📦", title: "Shipping & Delivery", articles: ["Shipping times by region", "Express shipping options", "Tracking your shipment", "Lost packages"] },
  { icon: "↩️", title: "Returns & Refunds", articles: ["AliExpress return policy", "How to request a refund", "Dispute resolution", "Refund timeline"] },
  { icon: "🔗", title: "Affiliate Links", articles: ["What are affiliate links?", "Is it safe to click?", "Our commission disclosure", "Privacy with links"] },
  { icon: "⚙️", title: "Account & Settings", articles: ["No account needed", "Saving favorites", "Sharing products", "Newsletter settings"] },
];
export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Help Center</h1>
      <p className="text-gray-500 mb-8">Everything you need to know about shopping with ShopPeak</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map(topic => (
          <div key={topic.title} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-orange-200 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">{topic.icon}</div>
            <h3 className="font-bold text-gray-800 mb-3">{topic.title}</h3>
            <ul className="space-y-1">
              {topic.articles.map(a => (
                <li key={a} className="text-sm text-orange-500 hover:underline cursor-pointer">→ {a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-orange-50 rounded-xl p-5 border border-orange-100 text-center">
        <p className="text-gray-700 mb-3">Can&apos;t find what you&apos;re looking for?</p>
        <Link href="/contact-us" className="bg-orange-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-orange-600 transition-colors">Contact Support</Link>
      </div>
    </div>
  );
}
