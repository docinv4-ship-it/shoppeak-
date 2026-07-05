"use client";
import { useState } from "react";
import { Mail, MessageSquare, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Contact ShopPeak</h1>
        <p className="text-gray-500">Have a question or need help? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Mail className="text-orange-500" size={20} />, title: "Email Us", desc: "support@shoppeak.com", sub: "Response within 24hrs" },
          { icon: <MessageSquare className="text-blue-500" size={20} />, title: "General Queries", desc: "hello@shoppeak.com", sub: "Business & partnerships" },
          { icon: <Clock className="text-green-500" size={20} />, title: "Response Time", desc: "24–48 hours", sub: "Mon–Fri, 9am–6pm UTC" },
        ].map(item => (
          <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-orange-500">{item.desc}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h2>
            <p className="text-gray-500 text-sm">Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.</p>
            <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-4 text-orange-500 text-sm hover:underline">
              Send another message
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Your Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400" placeholder="John Smith" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Email Address *</label>
                  <input required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400" placeholder="john@email.com" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Subject *</label>
                <select required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400">
                  <option value="">Select a subject...</option>
                  <option>Product Question</option>
                  <option>Order Issue</option>
                  <option>Partnership / Business</option>
                  <option>Technical Issue</option>
                  <option>Affiliate Program</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Message *</label>
                <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 resize-none" placeholder="How can we help you?" />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mt-6 bg-orange-50 rounded-xl p-4 text-sm text-gray-600 text-center">
        <p>For order-related issues, please contact AliExpress directly through your order page.</p>
        <p className="text-xs text-gray-400 mt-1">ShopPeak is an affiliate platform — we do not process orders directly.</p>
      </div>
    </div>
  );
}
