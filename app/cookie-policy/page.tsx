import { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy — ShopPeak" };
export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Cookie Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: January 2026</p>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section><h2 className="text-lg font-bold text-gray-800 mb-2">What Are Cookies?</h2><p>Cookies are small text files placed on your device when you visit a website. They help us improve your browsing experience, analyze site traffic, and personalize content.</p></section>
        <section><h2 className="text-lg font-bold text-gray-800 mb-2">Cookies We Use</h2>
          <div className="space-y-3">
            {[
              { name: "Session Cookies", desc: "Store your session preferences (e.g., search seed for product rotation). These expire when you close your browser." },
              { name: "Analytics Cookies", desc: "Help us understand how visitors use ShopPeak so we can improve the experience." },
              { name: "Affiliate Tracking Cookies", desc: "AliExpress places cookies to track purchases made through our affiliate links. This is required for commission tracking." },
            ].map(c => (<div key={c.name} className="bg-gray-50 rounded-lg p-4"><div className="font-semibold text-gray-800 text-sm mb-1">{c.name}</div><p className="text-sm">{c.desc}</p></div>))}
          </div>
        </section>
        <section><h2 className="text-lg font-bold text-gray-800 mb-2">Third-Party Cookies</h2><p>AliExpress may place cookies on your device when you click affiliate links. These are governed by AliExpress&apos;s own cookie and privacy policies.</p></section>
        <section><h2 className="text-lg font-bold text-gray-800 mb-2">Managing Cookies</h2><p>You can control cookies through your browser settings. Note that disabling certain cookies may affect site functionality. Most browsers allow you to refuse cookies or delete existing ones.</p></section>
        <section><h2 className="text-lg font-bold text-gray-800 mb-2">Contact</h2><p>Questions about our cookie practices? Email us at privacy@shoppeak.com</p></section>
      </div>
    </div>
  );
}
