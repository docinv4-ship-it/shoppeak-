"use client";

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { AliProduct } from "@/lib/aliexpress";
import { CATEGORIES } from "@/data/categories";
import { Search, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Recommended", value: "" },
  { label: "Price: Low to High", value: "SALE_PRICE_ASC" },
  { label: "Price: High to Low", value: "SALE_PRICE_DESC" },
  { label: "Best Discount", value: "DISCOUNT_DESC" },
  { label: "Most Orders", value: "LAST_VOLUME_DESC" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under $10", min: "", max: "10" },
  { label: "$10 – $50", min: "10", max: "50" },
  { label: "$50 – $200", min: "50", max: "200" },
  { label: "$200 – $1,000", min: "200", max: "1000" },
  { label: "Over $1,000", min: "1000", max: "" },
];

const BROWSE_KEYWORDS = [
  "trending products premium",
  "best seller global market",
  "new arrival luxury trend",
  "top rated choice",
  "hot items high value",
  "viral unique gadgets",
  "most ordered flagship",
  "recommended collections",
  "flash sale exclusive",
  "top picks hyper demand",
  "must have innovations",
  "staff choice picks",
  "premium high quality gear",
  "daily deals trending",
  "customer favorite picks",
];

const SEARCH_SYNC_EVENT = "shoppeak-search-sync";
const SEARCH_STORAGE_KEY = "shoppeak:last-search";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCategory(input: string) {
  const raw = normalizeText(input);
  if (!raw) return null;

  return (
    CATEGORIES.find((c: any) => {
      const id = normalizeText(String(c.id || ""));
      const slug = normalizeText(String(c.slug || ""));
      const name = normalizeText(String(c.name || ""));
      return id === raw || slug === raw || name === raw || name.includes(raw) || raw.includes(name);
    }) || null
  );
}

function BrowsePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const selectedCat = searchParams.get("cat") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [products, setProducts] = useState<AliProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(200);
  const [totalCount, setTotalCount] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [localInputQuery, setLocalInputQuery] = useState(searchQuery);

  const seedRef = useRef<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const key = "sp_browse_seed";
    let s = parseInt(sessionStorage.getItem(key) || "0", 10);
    if (!s) {
      s = Math.floor(Math.random() * 9999) + 1;
      sessionStorage.setItem(key, String(s));
    }
    seedRef.current = s;
  }, []);

  useEffect(() => {
    setLocalInputQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const onExternalSearch = (event: Event) => {
      const custom = event as CustomEvent<{ query?: string }>;
      const nextQuery = custom.detail?.query ?? "";
      setLocalInputQuery(nextQuery);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === SEARCH_STORAGE_KEY) {
        setLocalInputQuery(event.newValue || "");
      }
    };

    window.addEventListener(SEARCH_SYNC_EVENT, onExternalSearch as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(SEARCH_SYNC_EVENT, onExternalSearch as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const updateUrl = useCallback(
    (next: {
      q?: string;
      cat?: string;
      sort?: string;
      minPrice?: string;
      maxPrice?: string;
      page?: number;
    }) => {
      const current = new URLSearchParams(window.location.search);

      const setParam = (key: string, value?: string) => {
        if (value !== undefined) {
          if (value.trim() !== "") current.set(key, value);
          else current.delete(key);
        }
      };

      if (next.q !== undefined) setParam("q", next.q);
      if (next.cat !== undefined) setParam("cat", next.cat);
      if (next.sort !== undefined) setParam("sort", next.sort);
      if (next.minPrice !== undefined) setParam("minPrice", next.minPrice);
      if (next.maxPrice !== undefined) setParam("maxPrice", next.maxPrice);

      if (next.page !== undefined) {
        if (next.page > 1) current.set("page", String(next.page));
        else current.delete("page");
      } else {
        current.delete("page");
      }

      const queryString = current.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  useEffect(() => {
    const currentUrlQuery = searchParams.get("q") || "";

    if (localInputQuery === currentUrlQuery) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      updateUrl({ q: localInputQuery, page: 1 });
    }, 180);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [localInputQuery, searchParams, updateUrl]);

  const handleLiveTypingSearch = (incomingText: string) => {
    setLocalInputQuery(incomingText);

    try {
      window.localStorage.setItem(SEARCH_STORAGE_KEY, incomingText.trim());
    } catch {
      // ignore storage failures
    }

    window.dispatchEvent(
      new CustomEvent(SEARCH_SYNC_EVENT, {
        detail: { query: incomingText.trim() },
      })
    );
  };

  const handleInstantClear = () => {
    setLocalInputQuery("");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    try {
      window.localStorage.setItem(SEARCH_STORAGE_KEY, "");
    } catch {
      // ignore storage failures
    }

    window.dispatchEvent(
      new CustomEvent(SEARCH_SYNC_EVENT, {
        detail: { query: "" },
      })
    );

    updateUrl({ q: "", page: 1 });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const catData = resolveCategory(selectedCat) as any;
      const catKeywords: string[] = Array.isArray(catData?.keywords) ? catData.keywords : [];
      const baseQuery = localInputQuery.trim();

      const keyword =
        baseQuery ||
        catKeywords[((page - 1) + seedRef.current) % (catKeywords.length || 1)] ||
        BROWSE_KEYWORDS[((page - 1) + seedRef.current) % BROWSE_KEYWORDS.length];

      const params = new URLSearchParams({
        q: keyword,
        page: String(page),
        pageSize: "50",
        seed: String(seedRef.current),
      });

      if (selectedCat) params.set("cat", selectedCat);
      if (sort) params.set("sort", sort);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const res = await fetch(`/api/products/search?${params}`);
      const data = await res.json();

      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalPages(Math.min(Number(data.totalPage || 200), 200));
      setTotalCount(
        Number(
          data.totalCount ||
            ((Array.isArray(data.products) ? data.products.length : 0) *
              Math.min(Number(data.totalPage || 200), 200))
        )
      );
    } catch (error) {
      console.error("Fetch Execution Interrupted:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, sort, minPrice, maxPrice, localInputQuery, page]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProducts]);

  const optimizedProcessedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const processingPool = [...products];

    if (sort === "SALE_PRICE_ASC") {
      processingPool.sort((a, b) => parseFloat(a.sale_price || "0") - parseFloat(b.sale_price || "0"));
    } else if (sort === "SALE_PRICE_DESC") {
      processingPool.sort((a, b) => parseFloat(b.sale_price || "0") - parseFloat(a.sale_price || "0"));
    } else if (sort === "DISCOUNT_DESC") {
      processingPool.sort((a, b) => parseFloat(b.discount || "0") - parseFloat(a.discount || "0"));
    } else if (sort === "LAST_VOLUME_DESC") {
      processingPool.sort((a, b) => (b.lastest_volume || 0) - (a.lastest_volume || 0));
    }

    return processingPool;
  }, [products, sort]);

  const currentCategory = resolveCategory(selectedCat) as any;
  const displayTitle = localInputQuery.trim() || currentCategory?.name || "All Products";

  const handleCategoryClick = (catId: string) => {
    const nextCat = selectedCat === catId ? "" : catId;
    updateUrl({ cat: nextCat, page: 1 });
  };

  const handleSortChange = (value: string) => {
    updateUrl({ sort: value, page: 1 });
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    setShowFilters(true);
    updateUrl({ minPrice: min, maxPrice: max, page: 1 });
  };

  const clearFilters = () => {
    setLocalInputQuery("");
    setShowFilters(false);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    try {
      window.localStorage.setItem(SEARCH_STORAGE_KEY, "");
    } catch {
      // ignore
    }

    window.dispatchEvent(
      new CustomEvent(SEARCH_SYNC_EVENT, {
        detail: { query: "" },
      })
    );

    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div
          className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            onClick={() => handleCategoryClick("")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              !selectedCat
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "border-gray-200 text-gray-700 hover:border-orange-400 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            All Products
          </button>

          {CATEGORIES.slice(0, 14).map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(String(cat.id))}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1 ${
                selectedCat === String(cat.id)
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-orange-400 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center overflow-hidden">
              <Search size={18} className="ml-4 text-gray-400 shrink-0" />
              <input
                value={localInputQuery}
                onChange={(e) => handleLiveTypingSearch(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full px-3 py-3 text-sm sm:text-base outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                autoComplete="off"
              />
              {localInputQuery.trim() && (
                <button
                  type="button"
                  onClick={handleInstantClear}
                  className="px-3 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((f) => !f)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-white text-gray-800 hover:border-orange-400 hover:text-orange-500 transition-all shadow-sm"
            >
              <SlidersHorizontal size={14} className="text-gray-600" />
              <span className="text-gray-800">Filters</span>
              {(minPrice || maxPrice) && (
                <span className="bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">
                  1
                </span>
              )}
            </button>
            <span className="text-sm text-gray-500 font-medium hidden sm:block">
              {Number(totalCount || 0).toLocaleString()} products found
            </span>
          </div>

          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-200 font-semibold rounded-lg text-sm py-2 px-3 bg-white text-gray-800 focus:border-orange-500 focus:outline-none shadow-sm cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-white text-gray-900">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {showFilters && (
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-4 mb-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide">Select Price Range</h3>
              <button
                onClick={() => {
                  setShowFilters(false);
                  updateUrl({ minPrice: "", maxPrice: "", page: 1 });
                }}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <X size={17} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => {
                const isSelected = minPrice === range.min && maxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => handlePriceRangeChange(range.min, range.max)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                      isSelected
                        ? "bg-orange-600 text-white border-orange-600 font-black scale-[1.02]"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-gray-700">
            Results for <span className="text-orange-500">“{displayTitle}”</span>
          </div>
          {(localInputQuery || selectedCat || sort || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-500 hover:text-orange-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <ProductGrid
          products={optimizedProcessedProducts}
          cols={5}
          loading={loading}
          skeletonCount={50}
        />

        {!loading && optimizedProcessedProducts.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              updateUrl({ page: p });
            }}
            showTotal={totalCount}
            perPage={50}
          />
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-48 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      }
    >
      <BrowsePageContent />
    </Suspense>
  );
}