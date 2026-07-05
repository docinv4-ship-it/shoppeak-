import type { Metadata } from "next";

export const metadata: Metadata = { title: "Affiliate Disclosure & Legal — ShopPeak" };

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Affiliate Disclosure & Legal</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="space-y-8">
        <section id="disclosure" className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📢 Affiliate Disclosure</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            ShopPeak participates in the AliExpress Affiliate Program and other affiliate programs. This means that when you click on certain product links on this website and make a purchase, we may earn a small commission from the sale at <strong>no additional cost to you</strong>.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Our affiliate ID is <strong>ShopPeak666</strong> and we are registered as an official AliExpress affiliate partner. All commission is earned through the AliExpress affiliate platform.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            This commission helps us maintain and improve the ShopPeak platform, create buying guides, and continue providing free access to our product discovery tools. We only promote products we believe offer genuine value to our users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">How Our Affiliate Links Work</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-orange-500 font-bold flex-shrink-0">→</span> When you click a product link on ShopPeak, you are redirected to AliExpress.</li>
            <li className="flex items-start gap-2"><span className="text-orange-500 font-bold flex-shrink-0">→</span> If you complete a purchase within the affiliate window (typically 30 days), we earn a commission.</li>
            <li className="flex items-start gap-2"><span className="text-orange-500 font-bold flex-shrink-0">→</span> The price you pay is exactly the same as going directly to AliExpress — affiliate links do not increase product prices.</li>
            <li className="flex items-start gap-2"><span className="text-orange-500 font-bold flex-shrink-0">→</span> We do not have control over AliExpress pricing, availability, or fulfillment.</li>
            <li className="flex items-start gap-2"><span className="text-orange-500 font-bold flex-shrink-0">→</span> We are not responsible for the quality or delivery of products — these are handled entirely by AliExpress and its sellers.</li>
          </ul>
        </section>

        <section id="privacy">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Privacy Policy</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p><strong>Data Collection:</strong> ShopPeak does not collect personal data unless you voluntarily submit it through our contact form. We do not require account registration.</p>
            <p><strong>Cookies:</strong> We use essential cookies for website functionality. Analytics cookies may be used to understand how visitors use our site. You may disable cookies in your browser settings.</p>
            <p><strong>Third-Party Links:</strong> This website contains links to AliExpress and other third-party sites. These sites have their own privacy policies, which we encourage you to review.</p>
            <p><strong>Advertising:</strong> We may use affiliate tracking pixels from AliExpress to track conversions. These are governed by AliExpress&apos;s privacy policy.</p>
            <p><strong>Contact Form Data:</strong> Information submitted through our contact form is used only to respond to your inquiry and is not shared with third parties.</p>
          </div>
        </section>

        <section id="terms">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Terms of Use</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>By using ShopPeak, you agree to the following terms:</p>
            <p><strong>1. Nature of Service:</strong> ShopPeak is an affiliate marketing and product discovery platform. We do not sell products directly and are not responsible for product quality, delivery, returns, or refunds.</p>
            <p><strong>2. Accuracy:</strong> While we strive to display accurate pricing and product information, we cannot guarantee this information is always current. Actual pricing is determined by AliExpress and its sellers.</p>
            <p><strong>3. No Warranties:</strong> ShopPeak is provided "as is" without warranties of any kind. We make no representations regarding the suitability of products for your purposes.</p>
            <p><strong>4. Limitation of Liability:</strong> ShopPeak shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this platform or products purchased through our links.</p>
            <p><strong>5. Intellectual Property:</strong> All content on ShopPeak is owned by ShopPeak or its licensors. Product images are provided by AliExpress through their affiliate API.</p>
            <p><strong>6. Changes:</strong> We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of updated terms.</p>
          </div>
        </section>

        <section id="dmca">
          <h2 className="text-xl font-bold text-gray-800 mb-3">DMCA & Copyright</h2>
          <p className="text-sm text-gray-600">
            Product images displayed on ShopPeak are sourced via the AliExpress Affiliate API and remain the property of their respective owners. If you believe any content on this site violates your copyright, please contact us at dmca@shoppeak.com with details of the alleged infringement.
          </p>
        </section>

        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 text-center">
          <p>Questions about this disclosure? Contact us at <a href="/contact" className="text-orange-500 hover:underline">our contact page</a>.</p>
          <p className="mt-1">ShopPeak is an independent affiliate marketplace and is not affiliated with, endorsed by, or sponsored by AliExpress or Alibaba Group.</p>
        </div>
      </div>
    </div>
  );
}
