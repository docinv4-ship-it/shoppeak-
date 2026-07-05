"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calculator, Search, GitCompare, TrendingUp, Tag, Package, Percent, Star } from "lucide-react";

function PriceCalculator() {
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");
  const sale = original && discount ? (parseFloat(original) * (1 - parseFloat(discount) / 100)).toFixed(2) : null;
  const savings = sale ? (parseFloat(original) - parseFloat(sale)).toFixed(2) : null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-orange-500" size={20} />
        <h3 className="font-bold text-gray-800">Price & Discount Calculator</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Original Price ($)</label>
          <input type="number" value={original} onChange={e => setOriginal(e.target.value)} placeholder="e.g. 89.99" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">Discount (%)</label>
          <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="e.g. 40" min="0" max="100" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        {sale && (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Sale price: <strong className="text-green-600 text-base">${sale}</strong></p>
            <p className="text-xs text-gray-500">You save: ${savings}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ShippingEstimator() {
  const [country, setCountry] = useState("US");
  const [weight, setWeight] = useState("");
  const countries: Record<string, { days: string; cost: string }> = {
    US: { days: "15-30 days", cost: "Free – $5" },
    UK: { days: "12-25 days", cost: "Free – $3" },
    DE: { days: "15-30 days", cost: "Free – $4" },
    AU: { days: "20-45 days", cost: "Free – $6" },
    CA: { days: "15-35 days", cost: "Free – $5" },
    FR: { days: "15-30 days", cost: "Free – $4" },
    BR: { days: "30-60 days", cost: "$5 – $15" },
    IN: { days: "20-40 days", cost: "Free – $8" },
  };
  const info = countries[country] || { days: "20-45 days", cost: "Varies" };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package className="text-blue-500" size={20} />
        <h3 className="font-bold text-gray-800">Shipping Estimator</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Destination Country</label>
          <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            {Object.keys(countries).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">📦 Delivery: <strong>{info.days}</strong></p>
          <p className="text-sm text-gray-700">💰 Shipping cost: <strong>{info.cost}</strong></p>
          <p className="text-xs text-gray-500 mt-1">*Standard AliExpress shipping estimates. Faster options available.</p>
        </div>
      </div>
    </div>
  );
}

function BudgetTracker() {
  const [budget, setBudget] = useState("");
  const [items, setItems] = useState<{ name: string; price: string }[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const total = items.reduce((sum, i) => sum + parseFloat(i.price || "0"), 0);
  const remaining = budget ? parseFloat(budget) - total : null;
  const addItem = () => {
    if (name && price) { setItems(prev => [...prev, { name, price }]); setName(""); setPrice(""); }
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-green-500" size={20} />
        <h3 className="font-bold text-gray-800">Shopping Budget Tracker</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Total Budget ($)</label>
          <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 200" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item name" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="$" className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <button onClick={addItem} className="bg-orange-500 text-white px-3 rounded-lg text-sm hover:bg-orange-600">+</button>
        </div>
        {items.length > 0 && (
          <div className="space-y-1">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-50">
                <span>{item.name}</span><span className="font-medium">${parseFloat(item.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold pt-1">
              <span>Total</span><span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
            {remaining !== null && (
              <p className={`text-sm font-medium ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>
                {remaining < 0 ? `Over budget by $${Math.abs(remaining).toFixed(2)}` : `Remaining: $${remaining.toFixed(2)}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState("");

  const quickSearches = [
    { label: "Best Budget Phones", q: "budget smartphone under 100" },
    { label: "Gaming Headsets", q: "gaming headset wireless" },
    { label: "Crystal Chandeliers", q: "crystal chandelier LED" },
    { label: "Smart Watches", q: "smartwatch fitness tracker" },
    { label: "Wireless Earbuds", q: "wireless earbuds ANC" },
    { label: "Laptop Stands", q: "laptop stand ergonomic" },
    { label: "Mechanical Keyboards", q: "mechanical keyboard RGB" },
    { label: "Action Cameras", q: "action camera 4K waterproof" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Tools</h1>
        <p className="text-gray-500 text-sm mt-1">Tools to help you shop smarter and save more</p>
      </div>

      {/* Quick search */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white">
        <h2 className="text-lg font-bold mb-3">🔍 Smart Product Search</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && searchQ.trim()) router.push(`/search?q=${encodeURIComponent(searchQ)}`); }}
            placeholder="Search any product..."
            className="flex-1 rounded-lg px-4 py-2 text-gray-800 text-sm"
          />
          <button
            onClick={() => searchQ.trim() && router.push(`/search?q=${encodeURIComponent(searchQ)}`)}
            className="bg-white text-orange-500 font-bold px-4 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors"
          >
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {quickSearches.map(qs => (
            <button
              key={qs.q}
              onClick={() => router.push(`/search?q=${encodeURIComponent(qs.q)}`)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-colors"
            >
              {qs.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PriceCalculator />
        <ShippingEstimator />
        <BudgetTracker />
      </div>

      {/* Tool links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/compare", icon: <GitCompare size={20} />, label: "Compare Products", desc: "Side-by-side comparison", color: "bg-blue-50 text-blue-600" },
          { href: "/deals", icon: <Tag size={20} />, label: "Deal Finder", desc: "Best discounts today", color: "bg-red-50 text-red-600" },
          { href: "/feed", icon: <TrendingUp size={20} />, label: "Discovery Feed", desc: "Infinite scroll deals", color: "bg-green-50 text-green-600" },
          { href: "/blog", icon: <Star size={20} />, label: "Buying Guides", desc: "Expert recommendations", color: "bg-yellow-50 text-yellow-600" },
        ].map(tool => (
          <Link key={tool.href} href={tool.href} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:shadow-sm transition-all">
            <div className={`w-10 h-10 ${tool.color} rounded-xl flex items-center justify-center mb-3`}>
              {tool.icon}
            </div>
            <p className="font-bold text-sm text-gray-800">{tool.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
