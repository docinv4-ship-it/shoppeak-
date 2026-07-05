import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Careers — ShopPeak" };
export default function CareersPage() {
  const roles = [
    { title: "Senior Frontend Engineer", dept: "Engineering", type: "Remote", desc: "Build world-class shopping experiences with React and Next.js." },
    { title: "Product Manager — Marketplace", dept: "Product", type: "Remote", desc: "Own the end-to-end product roadmap for our marketplace platform." },
    { title: "Affiliate Partnership Manager", dept: "Growth", type: "Remote", desc: "Grow and manage our global affiliate partnerships network." },
    { title: "Data Engineer", dept: "Engineering", type: "Remote", desc: "Build the data pipelines powering our product recommendations." },
    { title: "Content & SEO Lead", dept: "Marketing", type: "Remote", desc: "Drive organic growth through content strategy and SEO optimization." },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 mb-3">Join ShopPeak</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">We&apos;re building the future of affiliate commerce. Join a remote-first team passionate about great products and great technology.</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-10 text-center">
        {[["🌍", "100% Remote"], ["🚀", "Fast Growth"], ["💰", "Competitive Pay"]].map(([e, t]) => (
          <div key={t} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="text-2xl mb-1">{e}</div>
            <div className="text-sm font-semibold text-gray-700">{t}</div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Open Positions</h2>
      <div className="space-y-3">
        {roles.map(role => (
          <div key={role.title} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-orange-200 transition-colors shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-800">{role.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{role.dept}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{role.type}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{role.desc}</p>
              </div>
              <Link href="/contact-us" className="shrink-0 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors">Apply</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
