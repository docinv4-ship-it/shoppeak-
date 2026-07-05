import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Affiliate Program — ShopPeak" };
export default function AffiliateProgramPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 mb-3">ShopPeak Affiliate Program</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">Earn commissions by promoting millions of AliExpress products through ShopPeak.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: "💰", title: "Earn Commissions", desc: "Earn up to 9% commission on every qualified purchase you drive through your links." },
          { icon: "🌍", title: "Global Reach", desc: "Access millions of products across every category with worldwide shipping." },
          { icon: "📊", title: "Track Everything", desc: "Real-time tracking dashboard for clicks, conversions, and earnings." },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center mb-8">
        <h2 className="text-2xl font-black mb-3">Ready to Start Earning?</h2>
        <p className="text-orange-100 mb-5">Join thousands of affiliates earning with ShopPeak. No minimum traffic required.</p>
        <Link href="/contact-us" className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors inline-block">
          Apply Now — It&apos;s Free
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-xs text-gray-400 leading-relaxed">
          ShopPeak operates as an AliExpress affiliate. Commission rates and terms are subject to the AliExpress Affiliate Program terms. 
          ShopPeak Affiliate ID: ShopPeak666. See our <Link href="/affiliate-disclosure" className="text-orange-500 hover:underline">Affiliate Disclosure</Link> for full details.
        </p>
      </div>
    </div>
  );
}
