"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect, useRef, useMemo, useCallback } from "react";
import { useShopStore } from "@/store/useShopStore";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  Flame,
  Home,
  Grid3X3,
  Compass,
  Zap,
  BookOpen,
  Wrench,
  GitCompare,
  Phone,
  Gem,
  Tv,
  Car,
  Sun,
  Lock,
  TrendingUp,
  Sparkles,
  Package,
  ShoppingCart,
  Heart,
  TrendingDown,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const NAV_LINKS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/categories", icon: Grid3X3, label: "All Categories" },
  { href: "/browse", icon: Compass, label: "Browse" },
  { href: "/wishlist", icon: Heart, label: "Shopping Boards" },
  { href: "/cart", icon: ShoppingCart, label: "Your Cart" },
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
  "smartphone 5G",
  "wireless earbuds",
  "smartwatch",
  "gaming laptop",
  "diamond ring",
  "luxury sofa",
  "electric bike",
  "robot vacuum",
  "laser engraver",
  "solar panel",
  "massage chair",
  "drone 4K",
  "wedding dress",
  "coffee machine",
  "CCTV system",
  "3D printer",
];

const SEARCH_SYNC_EVENT = "shoppeak-search-sync";
const SEARCH_STORAGE_KEY = "shoppeak:last-search";

function broadcastSearchQuery(value: string) {
  if (typeof window === "undefined") return;
  const cleanValue = value.trim();
  try {
    window.localStorage.setItem(SEARCH_STORAGE_KEY, cleanValue);
  } catch {
    // ignore storage failures
  }
  window.dispatchEvent(
    new CustomEvent(SEARCH_SYNC_EVENT, {
      detail: { query: cleanValue },
    })
  );
}

function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLFormElement>(null);

  const cart = useShopStore((state) => state.cart);
  const wishlistBoards = useShopStore((state) => state.wishlistBoards);

  const urlQuery = searchParams.get("q") || "";

  useEffect(() => {
    setMounted(true);
    setQuery(urlQuery);
  }, [urlQuery]);

  const cartItemsCount = mounted ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;
  const wishlistItemsCount = mounted
    ? wishlistBoards.reduce((acc, board) => acc + board.products.length, 0)
    : 0;

  // Active or filtered items list configuration
  const filteredSuggestions = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return SUGGESTIONS.slice(0, 6); // Default popular recommendations if empty

    const filtered = SUGGESTIONS.filter((item) => item.toLowerCase().includes(cleanQuery));
    return filtered.length ? filtered.slice(0, 8) : SUGGESTIONS.slice(0, 6);
  }, [query]);

  // Reset keyboard cursor position on query modifications
  useEffect(() => {
    setActiveIdx(-1);
  }, [query]);

  const syncFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
    setShowSugg(false);
  }, []);

  const navigateToBrowse = useCallback(
    (value: string, method: "push" | "replace" = "push") => {
      const cleanValue = value.trim();
      broadcastSearchQuery(cleanValue);
      setQuery(cleanValue);
      setShowSugg(false);

      const target = cleanValue ? `/browse?q=${encodeURIComponent(cleanValue)}` : "/browse";
      router[method](target);
    },
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToBrowse(query, "push");
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    broadcastSearchQuery(val);
    setShowSugg(true);
  };

  // Keyboard navigation control setup (Amazon standard UX)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSugg || filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && activeIdx < filteredSuggestions.length) {
        e.preventDefault();
        navigateToBrowse(filteredSuggestions[activeIdx], "push");
      }
    } else if (e.key === "Escape") {
      setShowSugg(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchWrapRef.current && !searchWrapRef.current.contains(target)) {
        setShowSugg(false);
      }
    };

    const onSearchSync = (event: Event) => {
      const custom = event as CustomEvent<{ query?: string }>;
      const nextQuery = custom.detail?.query ?? "";
      setQuery(nextQuery);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === SEARCH_STORAGE_KEY) {
        setQuery(event.newValue || "");
      }
    };

    const onPopState = () => syncFromUrl();

    document.addEventListener("mousedown", close);
    window.addEventListener(SEARCH_SYNC_EVENT, onSearchSync as EventListener);
    window.addEventListener("storage", onStorage);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener(SEARCH_SYNC_EVENT, onSearchSync as EventListener);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("popstate", onPopState);
    };
  }, [syncFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
    setDrawerOpen(false);
    setShowSugg(false);
  }, [pathname, searchParams]);

  const clearSearch = () => {
    setQuery("");
    setShowSugg(true);
    broadcastSearchQuery("");
    if (pathname.startsWith("/browse")) {
      router.replace("/browse", { scroll: false });
    }
    inputRef.current?.focus();
  };

  // Rendering highlights for query matches within recommendation list
  const renderSuggestionText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span className="font-medium text-gray-700">{text}</span>;
    const cleanHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const parts = text.split(new RegExp(`(${cleanHighlight})`, "gi"));
    return (
      <span className="text-gray-600 text-sm">
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="text-orange-600 font-extrabold">
              {part}
            </strong>
          ) : (
            <span key={i} className="font-normal text-gray-700">
              {part}
            </span>
          )
        )}
      </span>
    );
  };

  return (
    <>
      {/* Dynamic Backdrop Focus Layer */}
      {showSugg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-all duration-200" />
      )}

      {/* Top Banner Promo Notice */}
      <div className="bg-neutral-900 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide z-50 relative select-none">
        🔥 Flash Sale: Up to 80% OFF — Free Shipping on orders over $10 &nbsp;|&nbsp; 🌍 Ships Worldwide
      </div>

      <header className="bg-orange-500 shadow-md sticky top-0 z-50 transition-all w-full native-header">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
          {/* Main Layout Flex Container: Order mapping prevents duplicate components */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-2.5">
            
            {/* Left Block: Branding and Mobile Burger Menu Trigger */}
            <div className="flex items-center gap-2 flex-shrink-0 order-1">
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden text-white p-2 rounded-xl hover:bg-orange-600 transition-all active:scale-95 flex-shrink-0"
                aria-label="Open navigation drawer"
              >
                <Menu size={23} />
              </button>
              <Link href="/" className="flex-shrink-0 flex items-center gap-1">
                <span className="text-white font-black text-2xl tracking-tighter">Shop</span>
                <span className="bg-white text-orange-500 font-black text-2xl px-2 py-0.5 rounded-xl tracking-tighter shadow-md">
                  Peak
                </span>
              </Link>
            </div>

            {/* Middle Responsive Form Block: Automatically adjusts layout flow via CSS orders */}
            <form
              ref={searchWrapRef}
              onSubmit={handleSearch}
              className="w-full md:w-auto md:flex-1 relative order-3 md:order-2 z-50"
            >
              <div className="flex items-center relative w-full bg-white rounded-full shadow-inner border border-transparent focus-within:border-orange-700 focus-within:ring-2 focus-within:ring-orange-200 transition-all duration-150">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSugg(true)}
                  placeholder="Search products, brands, premium categories..."
                  className="w-full pl-5 pr-10 py-2.5 md:py-3 text-sm rounded-full outline-none text-gray-800 bg-transparent placeholder-gray-400 font-medium"
                  autoComplete="off"
                />

                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-14 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Clear structural search input query"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-orange-700 hover:bg-orange-800 text-white p-2.5 md:p-3 rounded-full transition-all flex-shrink-0 flex items-center justify-center absolute right-1 shadow-md hover:shadow-lg active:scale-95"
                  aria-label="Submit automated contextual search query"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Amazon Structural Auto-suggest Dropdown Layer Panel */}
              {showSugg && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[60] animate-fadeIn transition-all max-h-[380px] overflow-y-auto">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {query.trim().length >= 2 ? "Matching Suggestions" : "Trending Popular Searches"}
                    </span>
                    <Sparkles size={12} className="text-orange-500 animate-pulse" />
                  </div>
                  {filteredSuggestions.map((suggestion, idx) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigateToBrowse(suggestion, "push");
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-all border-b border-gray-50/50 last:border-0 ${
                        idx === activeIdx
                          ? "bg-orange-50 text-orange-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Search
                        size={14}
                        className={idx === activeIdx ? "text-orange-600" : "text-gray-400"}
                      />
                      <span className="flex-1 truncate">
                        {renderSuggestionText(suggestion, query)}
                      </span>
                      <ChevronRight size={13} className="text-gray-300 ml-auto flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Right Action Utility Panel Indicators */}
            <div className="flex items-center gap-3 sm:gap-4 text-white order-2 md:order-3 flex-shrink-0">
              <Link
                href="/wishlist"
                className="relative group p-2 flex items-center justify-center rounded-xl hover:bg-orange-600 transition-all"
                aria-label="View user profile wishlist boards"
              >
                <Heart size={22} className="group-hover:scale-105 transition-transform" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-orange-600 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-orange-500 shadow-md">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative group p-1.5 flex items-center justify-center bg-orange-600 border border-orange-400/20 px-3 py-1.5 rounded-full shadow-sm hover:bg-orange-700 transition-all duration-150"
                aria-label="View shopping storage cart items"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <ShoppingCart size={20} className="group-hover:scale-105 transition-transform" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-yellow-300 text-neutral-900 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-orange-600 shadow animate-bounce">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold hidden sm:inline uppercase tracking-wider">Cart</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Sub Categories Dynamic Navbar Horizontal Track list */}
          <nav
            className="flex items-center gap-1.5 mt-3 overflow-x-auto select-none pb-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx global>{`
              nav::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <Link
              href="/categories"
              className="text-white text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 font-bold flex-shrink-0 shadow-sm"
            >
              ☰ All
            </Link>
            {CATEGORIES.slice(0, 10).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="text-white/95 text-xs whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-orange-600 transition-all flex-shrink-0 font-medium"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
            <Link
              href="/trending"
              className="text-yellow-200 text-xs whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-1 flex items-center gap-1 bg-orange-600/30"
            >
              <TrendingUp size={12} /> Trending
            </Link>
            <Link
              href="/deals"
              className="text-yellow-100 text-xs whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors font-bold flex-shrink-0 ml-auto flex items-center gap-1 bg-orange-600/40"
            >
              <Flame size={12} className="text-yellow-300" /> Flash Sale
            </Link>
          </nav>
        </div>
      </header>

      {/* Structural Mobile Drawer Component Slider Screen */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-fadeIn">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-80 max-w-[85vw] bg-white h-full overflow-y-auto shadow-2xl flex flex-col transition-transform duration-200">
            <div className="bg-orange-500 px-4 py-4 flex items-center justify-between flex-shrink-0 shadow-md">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-1">
                <span className="text-white font-black text-2xl">Shop</span>
                <span className="bg-white text-orange-500 font-black text-2xl px-2 py-0.5 rounded-xl shadow-inner">Peak</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-white hover:bg-orange-600 p-2 rounded-xl transition-colors"
                aria-label="Close sidebar panel menu container"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-3 bg-gray-50 border-b border-gray-100">
              <Link
                href="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <Heart size={15} className="text-red-500 fill-red-500" /> Boards ({wishlistItemsCount})
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-orange-50 border border-orange-100 rounded-xl text-xs font-bold text-orange-600 shadow-sm hover:bg-orange-100/50 active:scale-95 transition-transform"
              >
                <ShoppingCart size={15} className="text-orange-500" /> Cart ({cartItemsCount})
              </Link>
            </div>

            <div className="px-3 py-3 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Navigation Explore
              </p>
              {NAV_LINKS.map(({ href, icon: Icon, label, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
                    highlight
                      ? "bg-red-50 text-red-600 hover:bg-red-100/70 font-bold"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <Icon size={17} className={highlight ? "text-red-500" : "text-orange-400"} />
                  <span className="text-sm font-semibold">{label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>

            <div className="px-3 py-3 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Top Categories
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TOP_CATS.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex flex-col items-center gap-1.5 p-2.5 bg-gray-50 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all text-center group border border-transparent hover:border-orange-100"
                  >
                    <Icon size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-gray-700 tracking-tight block truncate w-full">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-3 py-3 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                All Direct Categories
              </p>
              {CATEGORIES.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all"
                >
                  <span className="text-lg w-6 text-center">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                  <ChevronRight size={13} className="ml-auto text-gray-300" />
                </Link>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-gray-500 font-medium justify-center">
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
    <Suspense
      fallback={
        <div className="bg-orange-500 py-3.5 px-4 text-center text-white font-black text-xl tracking-tight select-none flex items-center justify-center gap-1">
          <span>Shop</span>
          <span className="bg-white text-orange-500 px-1.5 py-0.5 rounded-lg">Peak</span>
        </div>
      }
    >
      <HeaderSearch />
    </Suspense>
  );
}
