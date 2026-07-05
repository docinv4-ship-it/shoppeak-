import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Shop" },
      { href: "/categories", label: "Categories" },
      { href: "/deals", label: "Deals" },
      { href: "/trending", label: "Trending" },
      { href: "/new-arrivals", label: "New Arrivals" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
      { href: "/press", label: "Press" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/support", label: "Support" },
      { href: "/help-center", label: "Help Center" },
      { href: "/contact-us", label: "Contact Us" },
      { href: "/affiliate-program", label: "Affiliate Program" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/legal", label: "Legal" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

const PARTNER_LINKS = [
  { href: "https://www.aliexpress.com", label: "AliExpress" },
  { href: "https://www.alibaba.com", label: "Alibaba" },
  { href: "https://daraz.com", label: "Daraz" },
  { href: "https://www.amazon.com", label: "Amazon" },
];

const TOP_CATEGORIES = [
  { href: "/categories/phones-smartphones", label: "📱 Phones" },
  { href: "/categories/consumer-electronics", label: "🔌 Electronics" },
  { href: "/categories/jewelry-watches", label: "💎 Jewelry" },
  { href: "/categories/home-furniture", label: "🛋️ Furniture" },
  { href: "/categories/fashion-wearables", label: "👗 Fashion" },
  { href: "/categories/home-appliances", label: "🏠 Appliances" },
  { href: "/categories/sporting-goods", label: "⚽ Sports" },
  { href: "/categories/automotive", label: "🚗 Automotive" },
  { href: "/categories/beauty-health", label: "✨ Beauty" },
  { href: "/categories/toys-hobbies", label: "🎮 Toys" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Top categories bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mr-2">Browse:</span>
            {TOP_CATEGORIES.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-xs text-gray-400 hover:text-orange-400 transition-colors px-2 py-1 rounded hover:bg-gray-800"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand + description */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-0.5 mb-3">
              <span className="text-white font-black text-xl">Shop</span>
              <span className="bg-orange-500 text-white font-black text-xl px-1 rounded">Peak</span>
            </Link>
            <p className="text-sm text-gray-400 mb-3 leading-relaxed">
              Your trusted AliExpress affiliate marketplace. Discover millions of real products at the best prices worldwide.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              ShopPeak earns commissions from qualifying AliExpress purchases. See our{" "}
              <Link href="/affiliate-disclosure" className="text-orange-400 hover:underline">Affiliate Disclosure</Link>.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partner Networks */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Partner Networks</p>
          <div className="flex flex-wrap gap-5">
            {PARTNER_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                {link.label}
                <span className="text-gray-600 text-xs">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © 2026 ShopPeak. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/privacy" className="text-gray-500 hover:text-orange-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-orange-400 transition-colors">Terms</Link>
            <Link href="/cookie-policy" className="text-gray-500 hover:text-orange-400 transition-colors">Cookies</Link>
          </div>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>🔒 Secure</span>
            <span>📦 Worldwide</span>
            <span>⭐ Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
