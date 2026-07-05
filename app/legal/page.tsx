import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Legal — ShopPeak" };
export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Legal</h1>
      <p className="text-gray-500 mb-8">Important legal information about ShopPeak and your rights as a user.</p>
      <div className="space-y-3">
        {[
          { href: "/privacy-policy", title: "Privacy Policy", desc: "How we collect, use, and protect your personal data." },
          { href: "/terms-of-service", title: "Terms of Service", desc: "Rules and conditions for using ShopPeak." },
          { href: "/cookie-policy", title: "Cookie Policy", desc: "How we use cookies and tracking technologies." },
          { href: "/disclaimer", title: "Disclaimer", desc: "Limitations of liability and important disclaimers." },
          { href: "/affiliate-disclosure", title: "Affiliate Disclosure", desc: "Our FTC-required affiliate link disclosure." },
        ].map(item => (
          <Link key={item.href} href={item.href} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-5 hover:border-orange-200 hover:shadow-sm transition-all group">
            <div>
              <div className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{item.title}</div>
              <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
            </div>
            <span className="text-gray-400 group-hover:text-orange-400 text-lg">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
