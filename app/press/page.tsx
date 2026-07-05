import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Press & Media — ShopPeak" };
export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Press & Media</h1>
        <p className="text-gray-500">For press inquiries, media kits, and partnership opportunities</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {[
          { title: "Brand Assets", desc: "Logos, brand guidelines, and visual assets for media use.", icon: "🎨" },
          { title: "Press Releases", desc: "Official announcements and company news.", icon: "📰" },
          { title: "Media Kit", desc: "Traffic stats, audience demographics, and ad specs.", icon: "📊" },
          { title: "Partnerships", desc: "Brand partnerships, influencer programs, and sponsorships.", icon: "🤝" },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
        <h2 className="font-bold text-gray-800 mb-2">Media Inquiries</h2>
        <p className="text-sm text-gray-600 mb-3">For press inquiries, please reach out to our communications team. We typically respond within 24 hours.</p>
        <Link href="/contact-us" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          Contact Press Team →
        </Link>
      </div>
    </div>
  );
}
