import { Metadata } from "next";
export const metadata: Metadata = { title: "Contact Us — ShopPeak" };
export default function ContactUsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
      <form className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <input type="text" placeholder="Your name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input type="email" placeholder="you@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
          <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none">
            <option>General Inquiry</option>
            <option>Order Support</option>
            <option>Affiliate Partnership</option>
            <option>Press & Media</option>
            <option>Bug Report</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
          <textarea rows={5} placeholder="Your message..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none resize-none" />
        </div>
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
          Send Message
        </button>
        <p className="text-xs text-gray-400 text-center">We typically respond within 1–2 business days.</p>
      </form>
      <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-100 p-4"><div className="font-semibold text-gray-800 mb-1">📧 Email</div><div>support@shoppeak.com</div></div>
        <div className="bg-white rounded-xl border border-gray-100 p-4"><div className="font-semibold text-gray-800 mb-1">⏰ Response Time</div><div>Within 1–2 business days</div></div>
      </div>
    </div>
  );
}
