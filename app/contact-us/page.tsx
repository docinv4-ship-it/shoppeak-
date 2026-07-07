"use client";

import { useState, FormEvent } from "react";

export default function ContactUsPage() {
  // Core States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Input Field Sync Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // High-Speed Form Submission Stream
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Instant 1-Second Pop-up Trigger Execution
      setShowPopup(true);
      
      // Reset Form Fields
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });

      // Auto-dismiss popup after 3 seconds gracefully
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Failed to deliver message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 px-4 py-12 flex flex-col items-center justify-center">
      
      {/* SUCCESS POP-UP OVERLAY (Triggered Instantly) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center border border-gray-100 transform scale-100 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Thank You!</h3>
            <p className="text-sm text-gray-600">
              Thanks for contacting us! Your message has been routed to our team. We'll get back to you soon.
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-sm transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 sm:p-10">
        
        {/* Left Column: Form Info & Fields */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-2">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Affiliate Partnership">Affiliate Partnership</option>
                  <option value="Press & Media">Press & Media</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          <p className="text-xs text-gray-400 font-medium mt-6">
            We typically respond within 1–2 business days.
          </p>
        </div>

        {/* Right Column: Sidebar Response Status Info (Fake Domain Email Removed) */}
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-6 justify-center border border-gray-100">
          <div className="flex gap-4 items-start">
            <div className="text-xl p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                Online Support
              </h4>
              <p className="text-sm font-bold text-gray-800">
                24/7 Monitoring Stream
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="text-xl p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm shrink-0">
              ⏰
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                Response Time
              </h4>
              <p className="text-sm font-bold text-gray-800">
                Within 1–2 business days
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
