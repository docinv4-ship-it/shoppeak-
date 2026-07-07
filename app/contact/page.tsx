"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageSquare, Clock, CheckCircle, Loader2 } from "lucide-react";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot
};

type ApiResponse =
  | { ok: true; ticketId: string; message: string }
  | { ok: false; error: string };

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [error, setError] = useState("");

  const updateField = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || !data.ok) {
        throw new Error(!data.ok ? data.error : "Unable to send message.");
      }

      setSubmittedTicket(data.ticketId);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Contact ShopPeak</h1>
        <p className="text-gray-500">Have a question or need help? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: <Mail className="text-orange-500" size={20} />,
            title: "Email Us",
            desc: "support@shoppeak.com",
            sub: "Response within 24hrs",
          },
          {
            icon: <MessageSquare className="text-blue-500" size={20} />,
            title: "General Queries",
            desc: "hello@shoppeak.com",
            sub: "Business & partnerships",
          },
          {
            icon: <Clock className="text-green-500" size={20} />,
            title: "Response Time",
            desc: "24–48 hours",
            sub: "Mon–Fri, 9am–6pm UTC",
          },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-orange-500">{item.desc}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {submittedTicket ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h2>
            <p className="text-gray-500 text-sm">
              Thanks for reaching out. We&apos;ve received your message and sent you a confirmation email.
            </p>
            <p className="text-xs text-gray-400 mt-2">Ticket ID: {submittedTicket}</p>

            <button
              onClick={() => setSubmittedTicket(null)}
              className="mt-4 text-orange-500 text-sm hover:underline"
            >
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
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="John Smith"
                    maxLength={80}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Email Address *</label>
                  <input
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    type="email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="john@email.com"
                    maxLength={120}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Subject *</label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                >
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
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 resize-none"
                  placeholder="How can we help you?"
                  maxLength={3000}
                />
              </div>

              {/* Honeypot: hidden from real users, helps block bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mt-6 bg-orange-50 rounded-xl p-4 text-sm text-gray-600 text-center">
        <p>For order-related issues, please contact AliExpress directly through your order page.</p>
        <p className="text-xs text-gray-400 mt-1">
          ShopPeak is an affiliate platform — we do not process orders directly.
        </p>
      </div>
    </div>
  );
}