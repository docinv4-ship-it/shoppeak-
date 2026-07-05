import Link from "next/link";

export const metadata = { title: "Privacy Policy — ShopPeak" };

export default function PrivacyPage() {
  const updated = "May 24, 2025";
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span>›</span>
          <span>Privacy Policy</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-1">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: {updated}</p>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 text-sm text-orange-800">
        ShopPeak is an affiliate marketplace. We take your privacy seriously. This policy explains what data we collect, how we use it, and your rights.
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Information We Collect</h2>
          <div className="space-y-3">
            <p><strong>Usage Data:</strong> We may collect non-personally identifiable data such as pages visited, search queries entered on ShopPeak, browser type, device type, and referral URLs. This helps us improve the site experience.</p>
            <p><strong>Cookies & Session Storage:</strong> ShopPeak uses browser session storage and cookies to maintain your session seed for product rotation. This data is never shared with third parties. No personally identifiable information is stored in cookies.</p>
            <p><strong>Contact Form:</strong> If you submit a message through our contact page, we collect your name, email, and message text solely to respond to your enquiry.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">2. Affiliate Tracking</h2>
          <p>ShopPeak is an affiliate partner of AliExpress. When you click a product link and make a purchase on AliExpress, AliExpress may set cookies to track the affiliate referral. ShopPeak does not receive your personal AliExpress account information, order details, or payment information. Please refer to <a href="https://www.aliexpress.com/p/privacy-center/index.html" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">AliExpress's Privacy Policy</a> for information on how they handle your data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">3. Third-Party Services</h2>
          <p>We may integrate third-party services for analytics, advertising, or functionality. These services have their own privacy policies, and we encourage you to review them:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>AliExpress Affiliate Program (product data, affiliate tracking)</li>
            <li>ExchangeRate-API (currency conversion data)</li>
            <li>Vercel / Replit (hosting infrastructure)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">4. Cookies Policy</h2>
          <p>ShopPeak uses the following types of cookies:</p>
          <div className="bg-gray-50 rounded-lg p-4 mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold text-gray-700">Cookie</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Purpose</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-mono text-xs">sp_browse_seed</td>
                  <td className="py-2">Session-based rotation seed for fresh products</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-mono text-xs">sp_feed_seed</td>
                  <td className="py-2">Feed rotation seed</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">sp_deals_seed</td>
                  <td className="py-2">Deals rotation seed</td>
                  <td className="py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">5. Data Security</h2>
          <p>ShopPeak does not store user accounts, passwords, credit card numbers, or order history. We do not collect or store personally identifiable information beyond what you voluntarily submit through our contact form. All data transmission is encrypted via HTTPS/TLS.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">6. Children's Privacy</h2>
          <p>ShopPeak is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us personal data, please contact us and we will promptly delete it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access any personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of any marketing communications</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please <Link href="/contact" className="text-orange-500 hover:underline">contact us</Link>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">8. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of ShopPeak after changes constitutes acceptance of the new policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">9. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please reach out via our <Link href="/contact" className="text-orange-500 hover:underline">contact page</Link>.</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-3 text-sm">
        <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
        <Link href="/affiliate-disclosure" className="text-orange-500 hover:underline">Affiliate Disclosure</Link>
        <Link href="/contact" className="text-orange-500 hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
