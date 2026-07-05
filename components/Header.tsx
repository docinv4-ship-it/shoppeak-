"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect, useRef } from "react";
import { useShopStore } from "@/store/useShopStore"; // Core Engine State Connection
import { 
  Search, Menu, X, ChevronRight, Flame, Home, Grid3X3, Tag, Compass, Zap, 
  BookOpen, Wrench, GitCompare, Phone, Gem, Tv, Car, Cpu, Sun, Lock, 
  TrendingUp, Sparkles, Package, ShoppingCart, Heart 
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const NAV_LINKS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/categories", icon: Grid3X3, label: "All Categories" },
  { href: "/browse", icon: Compass, label: "Browse" },
  { href: "/wishlist", icon: Heart, label: "Shopping Boards" }, // Wishlist Integration
  { href: "/cart", icon: ShoppingCart, label: "Your Cart" }, // Cart Integration
  { href: "/deals", icon: Flame, label: "Hot Deals", highlight: true },
  { href: "/trending", icon: TrendingUp, label: "Trending" },
  { href: "/new-arrivals", icon: Sparkles, label: "New Arrivals" },
  { href: "/offers", icon: Package, label: "Offers" },
  { href: "/feed", icon: Zap, label: "Discover" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/compare", icon: GitCompare, label: "Compare" },
  { href: "/blog", icon: BookOpen, label: "Blog" },
  { href: "/tools", icon: Wrench, label: "Tools" },
];

const TOP_CATS = [
  { href: "/categories/phones-smartphones", icon: Phone, label: "Phones" },
  { href: "/categories/consumer-electronics", icon: Tv, label: "Electronics" },
  { href: "/categories/jewelry-watches", icon: Gem, label: "Jewelry" },
  { href: "/categories/automotive", icon: Car, label: "Auto" },
  { href: "/categories/solar-energy", icon: Sun, label: "Solar" },
  { href: "/categories/security-systems", icon: Lock, label: "Security" },
];

const SUGGESTIONS = [
  "smartphone 5G", "wireless earbuds", "smartwatch", "gaming laptop",
  "diamond ring", "luxury sofa", "electric bike", "robot vacuum",
  "laser engraver", "solar panel", "massage chair", "drone 4K",
  "wedding dress", "coffee machine", "CCTV system", "3D printer",
];

function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ZUSTAND LIVE ENGINE STATES
  const cart = useShopStore((state) => state.cart);
  const wishlistBoards = useShopStore((state) => state.wishlistBoards);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time Calculators
  const cartItemsCount = mounted ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;
  const wishlistItemsCount = mounted ? wishlistBoards.reduce((acc, b) => acc + b.products.length, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSugg(false);
    }
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (val.length >= 2) {
      const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
      setSuggestions(filtered.length ? filtered : SUGGESTIONS.slice(0, 5));
      setShowSugg(true);
    } else {
      setShowSugg(false);
    }
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest("form")?.contains(e.target as Node)) {
        setShowSugg(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    const currentQ = searchParams.get("q") || "";
    if (window.location.pathname.includes("/categories/")) {
      setQuery("");
    } else {
      setQuery(currentQ);
    }
  }, [searchParams]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-orange-700 text-white text-xs py-1 px-4 text-center hidden sm:block font-medium tracking-wide">
        🔥 Flash Sale: Up to 80% OFF — Free Shipping on orders over $10 &nbsp;|&nbsp; 🌍 Ships Worldwide
      </div>

      {/* Main header */}
      <header className="bg-orange-500 shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-white p-1.5 rounded hover:bg-orange-600 transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-0.5 mr-1 sm:mr-2">
              <span className="text-white font-black text-xl sm:text-2xl tracking-tight">Shop</span>
              <span className="bg-white text-orange-500 font-black text-xl sm:text-2xl px-1.5 rounded tracking-tight shadow-sm">Peak</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSugg(true)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 py-2 text-sm rounded-l-full border-0 outline-none text-gray-800 bg-white min-w-0 placeholder-gray-400 focus:ring-2 focus:ring-orange-700 transition-all"
              />
              <button type="submit" className="bg-orange-700 hover:bg-orange-800 text-white px-4 sm:px-6 rounded-r-full transition-colors flex-shrink-0 flex items-center justify-center">
                <Search size={18} />
              </button>
              {showSugg && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onMouseDown={() => { setQuery(s); setShowSugg(false); router.push(`/search?q=${encodeURIComponent(s)}`); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left transition-colors"
                    >
                      <Search size={13} className="text-gray-400 shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Desktop Quick-Access Core Sync (Wishlist, Cart & Under 5$ Icons) */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4 text-white font-bold text-sm flex-shrink-0">
              
              {/* Desktop Under 5$ Conversion Trigger Button */}
              <Link 
                href="/under-5-shop" 
                className="bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm uppercase tracking-wider scale-100 hover:scale-[1.03] active:scale-95 duration-150 shrink-0"
              >
                <span className="text-xs animate-pulse">✨</span> under 5$
              </Link>

              {/* Dynamic Wishlist Module */}
              <Link href="/wishlist" className="relative group p-1.5 flex flex-col items-center justify-center hover:text-yellow-100 transition-colors">
                <Heart size={21} className="group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-bold mt-0.5 hidden md:block">Wishlist</span>
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-orange-500 animate-fadeIn">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Dynamic Checkout Cart Module */}
              <Link href="/cart" className="relative group p-1.5 flex flex-col items-center justify-center bg-orange-600/50 hover:bg-orange-700 border border-orange-400/20 px-3 py-1 rounded-xl transition-all">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <ShoppingCart size={20} className="group-hover:scale-105 transition-transform" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-yellow-300 text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-orange-500 animate-pulse">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black hidden md:block uppercase tracking-wider">Cart</span>
                </div>
              </Link>

            </div>
          </div>

          {/* Desktop category nav strip */}
          <nav className="hidden sm:flex items-center gap-0.5 mt-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <Link href="/categories" className="text-white text-xs whitespace-nowrap px-2.5 py-1 rounded-full hover:bg-orange-600 transition-colors font-semibold flex-shrink-0">
              ☰ All
            </Link>
            {CATEGORIES.slice(0, 10).map(cat => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-white/90 text-xs whitespace-nowrap px-2.5 py-1 rounded-full hover:bg-orange-600 transition-colors flex-shrink-0"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
            <Link href="/trending" className="text-yellow-200 text-xs whitespace-nowrap px-2.5 py-1 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-1">
              📈 Trending
            </Link>
            <Link href="/under-5-shop" className="text-yellow-200 text-xs whitespace-nowrap px-2.5 py-1 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-1">
              ✨ under 5$
            </Link>
            <Link href="/deals" className="text-yellow-200 text-xs whitespace-nowrap px-2.5 py-1 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-auto">
              🔥 Flash Sale
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />

          <div className="relative w-72 max-w-[85vw] bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="bg-orange-500 px-4 py-4 flex items-center justify-between flex-shrink-0">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-0.5">
                <span className="text-white font-black text-xl">Shop</span>
                <span className="bg-white text-orange-500 font-black text-xl px-1 rounded">Peak</span>
              </Link>
              <button onClick={() => setDrawerOpen(false)} className="text-white hover:bg-orange-600 p-1.5 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Real-Time Counters Matrix */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-b border-gray-100">
              <Link href="/wishlist" onClick={() => setDrawerOpen(false)} className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm">
                <Heart size={15} className="text-red-500" />
                Boards ({wishlistItemsCount})
              </Link>
              <Link href="/cart" onClick={() => setDrawerOpen(false)} className="flex items-center justify-center gap-2 py-2 px-3 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-600 shadow-sm">
                <ShoppingCart size={15} className="text-orange-500" />
                Cart ({cartItemsCount})
              </Link>
            </div>

            {/* Mobile Under 5$ Express Action Banner */}
            <div className="px-3 pt-3 pb-1 border-b border-gray-100 bg-white">
              <Link 
                href="/under-5-shop" 
                onClick={() => setDrawerOpen(false)} 
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-yellow-300 hover:bg-yellow-400 text-black rounded-xl text-xs font-black shadow-sm uppercase tracking-wider transition-all w-full text-center"
              >
                <span>✨</span> under 5$ store
              </Link>
            </div>

            {/* Main nav */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Navigation</p>
              {NAV_LINKS.map(({ href, icon: Icon, label, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors ${highlight ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"}`}
                >
                  <Icon size={17} className={highlight ? "text-red-500" : "text-orange-400"} />
                  <span className={`text-sm font-medium ${highlight ? "font-bold" : ""}`}>{label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>

            {/* Top categories */}
            <div className="px-3 py-3 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Top Categories</p>
              <div className="grid grid-cols-3 gap-2">
                {TOP_CATS.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex flex-col items-center gap-1 p-2.5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors text-center"
                  >
                    <Icon size={20} className="text-orange-500" />
                    <span className="text-[11px] font-medium text-gray-700">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* All categories list */}
            <div className="px-3 py-3 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">All Categories</p>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <span className="text-lg w-6 text-center">{cat.icon}</span>
                  <span className="text-sm">{cat.name}</span>
                  <ChevronRight size={13} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>

            {/* Bottom links */}
            <div className="px-4 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <Link href="/about" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">About</Link>
                <span>·</span>
                <Link href="/contact-us" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Contact</Link>
                <span>·</span>
                <Link href="/support" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Support</Link>
                <span>·</span>
                <Link href="/privacy" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Privacy</Link>
                <span>·</span>
                <Link href="/terms" onClick={() => setDrawerOpen(false)} className="hover:text-orange-500">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <div className="bg-orange-500 h-14 sticky top-0 z-50 flex items-center px-4">
        <span className="text-white font-black text-xl">Shop</span>
        <span className="bg-white text-orange-500 font-black text-xl px-1 rounded ml-0.5">Peak</span>
      </div>
    }>
      <HeaderSearch />
    </Suspense>
  );
}
