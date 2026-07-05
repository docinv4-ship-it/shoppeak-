import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Support — ShopPeak" };
export default function SupportPage() {
  const faqs = [
    { q: "How do I buy a product?", a: "Click 'Buy Now' on any product. You'll be redirected to AliExpress where you complete your purchase securely." },
    { q: "Are these products safe to buy?", a: "All products link to AliExpress, which has full buyer protection. You're covered for refunds if the item doesn't arrive or isn't as described." },
    { q: "How do refunds work?", a: "Refunds are handled directly by AliExpress. You have 60 days of buyer protection on all purchases." },
    { q: "Does ShopPeak store my payment info?", a: "No. ShopPeak never processes payments. All transactions happen securely on AliExpress." },
    { q: "How long does shipping take?", a: "Shipping varies by seller. Standard shipping is 10–25 days. Express shipping (DHL/FedEx) is 3–7 days." },
    { q: "Can I track my order?", a: "Yes. After purchase on AliExpress, you'll receive tracking information from the seller." },
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Support Center</h1>
      <p className="text-gray-500 mb-8">Get help with your ShopPeak experience</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { href: "/help-center", label: "Help Center", icon: "📚", desc: "Browse guides & articles" },
          { href: "/contact-us", label: "Contact Us", icon: "💬", desc: "Send us a message" },
          { href: "/affiliate-program", label: "Affiliate Program", icon: "🤝", desc: "Earn with ShopPeak" },
          { href: "/affiliate-disclosure", label: "Affiliate Disclosure", icon: "ℹ️", desc: "How we earn" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-orange-200 hover:shadow-sm transition-all">
            <span className="text-2xl">{item.icon}</span>
            <div><div className="font-semibold text-gray-800 text-sm">{item.label}</div><div className="text-xs text-gray-500">{item.desc}</div></div>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map(faq => (
          <details key={faq.q} className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer group">
            <summary className="font-semibold text-gray-800 text-sm list-none flex items-center justify-between">
              {faq.q} <span className="text-gray-400 text-lg">+</span>
            </summary>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
