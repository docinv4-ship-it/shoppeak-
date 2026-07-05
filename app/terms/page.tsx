import Link from "next/link";

export const metadata = { title: "Terms of Service — ShopPeak" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span>›</span>
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-1">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: May 24, 2025</p>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 text-sm text-orange-800">
        By accessing or using ShopPeak, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p>By visiting and using ShopPeak (&quot;the Site&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">2. Nature of the Service</h2>
          <p>ShopPeak is an <strong>affiliate discovery platform</strong>. We aggregate and present product listings from AliExpress through the AliExpress Affiliate Program. ShopPeak does not:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Sell products directly</li>
            <li>Process payments for products</li>
            <li>Fulfill orders or manage shipping</li>
            <li>Handle returns or disputes</li>
          </ul>
          <p className="mt-3">All transactions occur on AliExpress, and their terms of service and policies apply to all purchases. ShopPeak earns an affiliate commission on qualifying purchases at no additional cost to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">3. Affiliate Disclosure</h2>
          <p>ShopPeak participates in the AliExpress Affiliate Program. This means we earn a commission when users click our affiliate links and make a purchase. This does not affect the price you pay. Our affiliate relationships are disclosed in accordance with FTC guidelines. For more details, please read our <Link href="/affiliate-disclosure" className="text-orange-500 hover:underline">Affiliate Disclosure</Link>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">4. Product Information Accuracy</h2>
          <p>Product titles, images, prices, and descriptions on ShopPeak are sourced from the AliExpress API and may be subject to change without notice. ShopPeak makes no guarantees regarding:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>The accuracy of product prices shown</li>
            <li>Product availability or stock levels</li>
            <li>Product descriptions or specifications</li>
            <li>Images matching the delivered product</li>
          </ul>
          <p className="mt-3">Always verify product details on AliExpress before completing a purchase.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">5. User Responsibilities</h2>
          <p>By using ShopPeak, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use the site for lawful purposes only</li>
            <li>Not attempt to scrape, copy, or systematically extract data from the site</li>
            <li>Not interfere with the site's operation or security</li>
            <li>Not use automated tools to access the site without our written consent</li>
            <li>Be at least 18 years old, or have parental consent, to make purchases</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">6. Intellectual Property</h2>
          <p>The ShopPeak brand name, logo, and all original site content are the intellectual property of ShopPeak. Product images and descriptions remain the property of their respective owners (AliExpress sellers). Unauthorized use, reproduction, or distribution of ShopPeak content is prohibited.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">7. Disclaimer of Warranties</h2>
          <p>ShopPeak is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not warrant that the site will be error-free, uninterrupted, or free of viruses or other harmful components. Your use of the site is at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, ShopPeak shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your use of or inability to use the site</li>
            <li>Any products purchased through affiliate links</li>
            <li>Errors, omissions, or inaccuracies in product information</li>
            <li>Unauthorized access to your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">9. External Links</h2>
          <p>ShopPeak contains links to external websites, primarily AliExpress. We are not responsible for the content, privacy practices, or terms of external sites. Clicking external links is at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">10. Changes to Terms</h2>
          <p>ShopPeak reserves the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">11. Governing Law</h2>
          <p>These terms are governed by applicable law. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the relevant courts.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">12. Contact</h2>
          <p>For questions about these Terms of Service, please <Link href="/contact" className="text-orange-500 hover:underline">contact us</Link>.</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-3 text-sm">
        <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
        <Link href="/affiliate-disclosure" className="text-orange-500 hover:underline">Affiliate Disclosure</Link>
        <Link href="/contact" className="text-orange-500 hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
