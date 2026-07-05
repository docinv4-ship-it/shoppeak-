import { Metadata } from "next";
export const metadata: Metadata = { title: "Disclaimer — ShopPeak" };
export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Disclaimer</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: January 2026</p>
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section className="bg-orange-50 border border-orange-100 rounded-xl p-5"><h2 className="font-bold text-gray-800 mb-2 text-base">Affiliate Disclaimer</h2><p>ShopPeak is an affiliate marketplace. We participate in the AliExpress Affiliate Program. When you click on product links and make purchases, ShopPeak may earn a commission at no additional cost to you. This commission helps fund the operation of this website.</p></section>
        <section><h2 className="font-bold text-gray-800 mb-2 text-base">Product Information</h2><p>Product information, prices, availability, and descriptions on ShopPeak are sourced from AliExpress via their public API. ShopPeak does not independently verify product quality, accuracy, or availability. Prices may change without notice. Always verify current details on the AliExpress product page before purchasing.</p></section>
        <section><h2 className="font-bold text-gray-800 mb-2 text-base">No Warranty</h2><p>ShopPeak makes no warranties or representations, express or implied, regarding the accuracy, completeness, or fitness for any particular purpose of the information provided. Product reviews, ratings, and sold counts are sourced from the AliExpress API and are not independently verified.</p></section>
        <section><h2 className="font-bold text-gray-800 mb-2 text-base">Limitation of Liability</h2><p>ShopPeak shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this site, your reliance on product information, or your purchases from third-party retailers (including AliExpress). All purchases are made directly with AliExpress and are subject to their terms and buyer protection policies.</p></section>
        <section><h2 className="font-bold text-gray-800 mb-2 text-base">External Links</h2><p>ShopPeak contains links to external websites, primarily AliExpress. We are not responsible for the content, privacy practices, or availability of these external sites.</p></section>
        <section><h2 className="font-bold text-gray-800 mb-2 text-base">Contact</h2><p>For questions about this disclaimer, contact us at legal@shoppeak.com</p></section>
      </div>
    </div>
  );
}
