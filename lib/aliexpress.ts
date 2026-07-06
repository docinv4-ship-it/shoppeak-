import crypto from "crypto";
import cache, { FIVE_HOURS, ONE_HOUR } from "./cache";
import { supabase } from "./db";
import { CATEGORIES } from "@/data/categories";

const APP_KEY = process.env.ALIEXPRESS_APP_KEY!;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET!;
const AFFILIATE_ID = process.env.ALIEXPRESS_AFFILIATE_ID || "ShopPeak666";
const API_BASE =
  process.env.ALIEXPRESS_API_BASE_URL || "https://api-sg.aliexpress.com/sync";

const THIRTY_MINUTES = 30 * 60 * 1000;
const TWO_HOURS = 2 * 60 * 60 * 1000;
const MAX_PAGE_SIZE = 50;
const MAX_TOTAL_PAGES = 2000;
const MIN_RESULTS_BEFORE_WIDENING = 12;

type SectionKind =
  | "search"
  | "browse"
  | "trending"
  | "deals"
  | "new-arrivals"
  | "budget";

export interface AliProduct {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  product_small_image_urls?: { string: string[] };
  product_video_url?: string;
  app_sale_price: string;
  sale_price: string;
  original_price: string;
  target_sale_price?: string;
  discount: string;
  evaluate_rate: string;
  lastest_volume: number;
  shop_url: string;
  shop_name?: string;
  shop_id?: string;
  product_detail_url: string;
  promotion_link: string;
  first_level_category_id: string;
  second_level_category_id: string;
  first_level_category_name?: string;
  second_level_category_name?: string;
  commission_rate?: string;
  hot_product_commission_rate?: string;
  sku_id?: string;
  trust_badges?: string[];
  is_verified_seller?: boolean;
  is_top_choice?: boolean;
  price_drop_alert?: boolean;
  shipping_tag?: string;
}

export interface ProductQueryResult {
  products: AliProduct[];
  totalPage: number;
  currentPage: number;
  totalCount?: number;
}

interface QueryOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  keyword?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  seed?: number;
  isGlobalBrowse?: boolean;
  section?: SectionKind;
}

interface CategoryProfile {
  canonical: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  keywords: string[];
  subKeywords: string[];
  strictKeywords: string[];
  familyKeywords: string[];
  aliases: string[];
}

interface QueryPlan {
  section: SectionKind;
  keywordCandidates: string[];
  categoryId: string;
  page: number;
  pageSize: number;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  seed: number;
  useHotApiFirst?: boolean;
  categoryProfile: CategoryProfile;
}

const CATEGORY_FAMILY_FALLBACKS: Record<string, string[]> = {
  electronics: [
    "smartphone 5g",
    "wireless earbuds",
    "wireless headphones",
    "tablet pc",
    "gaming headset",
    "smart watch",
    "power bank",
    "charger cable",
    "mechanical keyboard",
    "mini projector",
    "computer accessory",
    "audio device",
  ],
  phones: [
    "smartphone 5g",
    "android phone",
    "mobile phone",
    "phone case",
    "screen protector",
    "wireless charger",
    "power bank",
    "phone holder",
    "earbuds",
  ],
  gadgets: [
    "smart gadget",
    "mini projector",
    "wireless earbuds",
    "portable speaker",
    "smart watch",
    "usb hub",
    "camera accessory",
    "smart home device",
  ],
  fashion: [
    "men shoes",
    "women dress",
    "fashion bag",
    "jacket",
    "sneakers",
    "hoodie",
    "t shirt",
    "watch",
    "sunglasses",
    "fashion accessories",
  ],
  home: [
    "kitchen tools",
    "storage box",
    "home decor",
    "cleaning brush",
    "desk organizer",
    "bathroom accessory",
    "curtain",
    "bed sheet",
    "home appliance",
    "furniture",
  ],
  beauty: [
    "skincare",
    "makeup brush",
    "lipstick",
    "hair straightener",
    "hair remover",
    "face mask",
    "beauty tools",
    "nail art",
  ],
  sports: [
    "fitness equipment",
    "running shoes",
    "sportswear",
    "water bottle",
    "yoga mat",
    "cycling accessory",
    "outdoor gear",
    "camping equipment",
  ],
  automotive: [
    "car accessories",
    "car phone holder",
    "car charger",
    "seat cover",
    "car led light",
    "dash cam",
    "car cleaning",
    "motorcycle accessory",
  ],
  toys: [
    "kids toy",
    "building blocks",
    "rc car",
    "educational toy",
    "doll",
    "puzzle",
    "robot toy",
    "stuffed toy",
  ],
  accessories: [
    "watch strap",
    "bag accessory",
    "belt",
    "wallet",
    "phone accessory",
    "sunglasses",
    "jewelry accessory",
    "hair accessory",
  ],
  men: [
    "men t shirt",
    "men shoes",
    "men watch",
    "men wallet",
    "men jacket",
    "men shorts",
    "men bag",
    "men belt",
  ],
  women: [
    "women dress",
    "women shoes",
    "women bag",
    "women watch",
    "women jewelry",
    "women jacket",
    "women top",
    "women accessories",
  ],
  kids: [
    "kids clothing",
    "kids shoes",
    "kids backpack",
    "kids toy",
    "baby accessory",
    "school bag",
    "children watch",
    "children learning toy",
  ],
  tools: [
    "hand tools",
    "electric drill",
    "tool kit",
    "screwdriver set",
    "repair tools",
    "measuring tool",
    "hardware accessory",
    "workshop tools",
  ],
  health: [
    "health care",
    "massage device",
    "fitness tracker",
    "posture corrector",
    "medical aid",
    "wellness product",
    "home therapy",
    "body care",
  ],
  office: [
    "office chair",
    "desk accessory",
    "stationery set",
    "keyboard",
    "mouse",
    "file organizer",
    "office lamp",
    "printer accessory",
  ],
  pets: [
    "pet toy",
    "pet grooming",
    "pet feeding",
    "pet collar",
    "pet house",
    "pet leash",
    "cat accessory",
    "dog accessory",
  ],
  travel: [
    "travel bag",
    "passport holder",
    "packing cube",
    "travel pillow",
    "luggage accessory",
    "portable charger",
    "travel bottle",
    "travel organizer",
  ],
  jewelry: [
    "luxury watch",
    "diamond ring",
    "necklace",
    "bracelet",
    "earrings",
    "fashion jewelry",
    "gift jewelry",
    "ring",
    "moissanite",
  ],
  lighting: [
    "led lamp",
    "ceiling light",
    "table lamp",
    "chandelier",
    "pendant light",
    "light bulb",
    "wall light",
    "strip light",
  ],
  appliances: [
    "air fryer",
    "smart vacuum cleaner",
    "blender",
    "coffee machine",
    "kitchen appliance",
    "portable heater",
    "fan",
    "home appliance",
    "water dispenser",
    "electric kettle",
  ],
  industrial: [
    "cnc tool",
    "laser engraving machine",
    "industrial tool",
    "power tool",
    "measuring equipment",
    "workshop machine",
    "heavy duty tool",
    "hardware machine",
  ],
  audio: [
    "wireless earbuds",
    "bluetooth speaker",
    "gaming headset",
    "soundbar",
    "microphone",
    "amplifier",
    "studio headset",
    "audio accessory",
  ],
  solar: [
    "solar panel",
    "inverter",
    "lithium battery",
    "solar light",
    "power station",
    "solar charger",
    "energy storage",
    "solar kit",
  ],
};

const CATEGORY_ALIASES: Record<string, string> = {
  "phones & smartphones": "phones-smartphones",
  "mobile phones": "phones-smartphones",
  "consumer electronics": "consumer-electronics",
  "home furniture": "home-furniture",
  "home appliances": "home-appliances",
  "lighting & chandeliers": "lighting-chandeliers",
  "jewelry & watches": "jewelry-watches",
  "fashion & style": "fashion-wearables",
  "health & beauty": "health-beauty",
  "outdoor & sports": "outdoor-recreational",
  "industrial & machinery": "machinery-industrial",
  "professional audio": "professional-audio",
  "security & cctv": "security-systems",
  "solar & energy": "solar-energy",
  "medical & mobility": "medical-mobility",
};

const BROWSE_POOLS = [
  "smartphone 5g",
  "wireless earbuds",
  "smart watch",
  "kitchen tools",
  "women shoes",
  "men jacket",
  "home decor",
  "car accessories",
  "fitness equipment",
  "office accessory",
  "pet accessory",
  "travel bag",
  "beauty tools",
  "gaming headset",
  "usb charger",
];

const TRENDING_POOLS = [
  "viral gadget",
  "smartwatch",
  "wireless earbuds",
  "portable speaker",
  "phone accessory",
  "gaming accessory",
  "beauty device",
  "home gadget",
  "tech accessory",
  "travel gadget",
];

const DEALS_POOLS = [
  "sale clearance discount",
  "flash sale gadget",
  "hot deal product",
  "discount accessory",
  "budget tech",
  "limited offer item",
  "coupon product",
  "free shipping deal",
];

const NEW_ARRIVALS_POOLS = [
  "new arrival gadget",
  "latest smartphone accessory",
  "new fashion item",
  "new beauty product",
  "new home product",
  "new tech gadget",
  "new office accessory",
  "new travel accessory",
];

const BUDGET_POOLS = [
  "cheap gadget",
  "budget accessory",
  "mini tool",
  "small kitchen tool",
  "phone accessory cheap",
  "earbuds cheap",
  "fashion accessory low price",
  "home organizer cheap",
];

function nowTimestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(
    d.getHours()
  )}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function createTimeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  controller.signal.addEventListener("abort", () => clearTimeout(timer), {
    once: true,
  });
  return controller.signal;
}

function sign(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  let str = APP_SECRET;
  for (const key of sortedKeys) str += key + params[key];
  str += APP_SECRET;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

function stableStringify(obj: Record<string, string>): string {
  return Object.keys(obj)
    .sort()
    .map((k) => `${k}:${obj[k]}`)
    .join("|");
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.map((v) => (v ?? "").trim()).filter(Boolean))];
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashInt(input: string): number {
  const h = crypto.createHash("md5").update(input || "").digest("hex").slice(0, 8);
  return parseInt(h, 16) || 0;
}

function mapSort(sort?: string): string | undefined {
  const s = normalizeText(sort || "");
  if (!s) return undefined;
  if (s.includes("price low") || s.includes("low to high") || s.includes("asc"))
    return "SALE_PRICE_ASC";
  if (s.includes("price high") || s.includes("high to low") || s.includes("desc"))
    return "SALE_PRICE_DESC";
  if (s.includes("discount")) return "DISCOUNT_DESC";
  if (s.includes("new")) return "NEW_DESC";
  if (s.includes("popular") || s.includes("recommended") || s.includes("hot"))
    return "VOLUME_DESC";
  return sort;
}

function computeDiscount(original: number, sale: number): number {
  if (!original || !sale || original <= 0 || sale >= original) return 0;
  return Math.max(0, Math.round((1 - sale / original) * 100));
}

function parsePrice(raw: unknown): number {
  const n = typeof raw === "number" ? raw : parseFloat(String(raw || "0"));
  return Number.isFinite(n) ? n : 0;
}

function extractTotalCount(root: any): number {
  const candidates = [
    root?.total_record_count,
    root?.totalCount,
    root?.result?.total_record_count,
    root?.result?.total_count,
    root?.resp_result?.result?.total_record_count,
    root?.resp_result?.result?.total_count,
  ];

  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }

  return 0;
}

function extractRawProducts(root: any): any[] {
  const stack: any[] = [
    root?.products?.product,
    root?.products,
    root?.product,
    root?.items?.item,
    root?.items,
    root?.result?.products?.product,
    root?.result?.products,
    root?.result?.product,
    root?.result?.items?.item,
    root?.result?.items,
    root?.resp_result?.result?.products?.product,
    root?.resp_result?.result?.products,
    root?.resp_result?.result?.product,
    root?.resp_result?.result?.items?.item,
    root?.resp_result?.result?.items,
  ];

  for (const candidate of stack) {
    if (!candidate) continue;
    if (Array.isArray(candidate)) return candidate;
    if (typeof candidate === "object") {
      if (Array.isArray(candidate.product)) return candidate.product;
      if (candidate.product)
        return Array.isArray(candidate.product)
          ? candidate.product
          : [candidate.product];
      if (candidate.item)
        return Array.isArray(candidate.item) ? candidate.item : [candidate.item];
      if (candidate.items)
        return Array.isArray(candidate.items) ? candidate.items : [candidate.items];
    }
  }

  if (Array.isArray(root)) return root;
  return [];
}

function normalizeImageUrls(value: any): { string: string[] } | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return { string: [value] };
  if (Array.isArray(value)) return { string: value.map(String).filter(Boolean) };
  if (typeof value === "object") {
    const arr =
      (Array.isArray(value.string) && value.string) ||
      (Array.isArray(value.image) && value.image) ||
      (Array.isArray(value.url) && value.url) ||
      [];
    return { string: arr.map(String).filter(Boolean) };
  }
  return undefined;
}

function rotateBySeed<T>(items: T[], seed: number): T[] {
  if (!items.length) return items;
  const offset = Math.abs(seed) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function normalizeCategoryToken(input: string): string {
  return normalizeText(input).replace(/\s+/g, "-");
}

function resolveCategoryProfile(categoryInput?: string): CategoryProfile {
  const raw = normalizeText(categoryInput || "");
  const token = normalizeCategoryToken(categoryInput || "");
  const lookupBySlug = CATEGORIES.find((c) => c.slug === token);
  const lookupByName = CATEGORIES.find(
    (c) => normalizeText(c.name) === raw || normalizeText(c.name).includes(raw) || raw.includes(normalizeText(c.name))
  );
  const lookupById = CATEGORIES.find((c) => c.id === raw);

  const category = lookupBySlug || lookupByName || lookupById;
  if (category) {
    const baseKeywords = uniqueStrings([
      category.name,
      category.slug.replace(/-/g, " "),
      ...(category.keywords || []),
      ...category.subcategories.flatMap((s) => [s.name, s.slug.replace(/-/g, " "), ...(s.keywords || [])]),
    ]);

    return {
      canonical: category.slug,
      categoryId: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
      keywords: uniqueStrings([
        ...category.keywords,
        category.name,
        category.slug.replace(/-/g, " "),
      ]),
      subKeywords: uniqueStrings(
        category.subcategories.flatMap((s) => [
          s.name,
          s.slug.replace(/-/g, " "),
          ...(s.keywords || []),
        ])
      ),
      strictKeywords: baseKeywords,
      familyKeywords: baseKeywords,
      aliases: uniqueStrings([
        category.slug,
        category.name,
        category.name.toLowerCase(),
        category.slug.replace(/-/g, " "),
      ]),
    };
  }

  const aliasSlug =
    CATEGORY_ALIASES[raw] ||
    CATEGORY_ALIASES[token] ||
    CATEGORY_ALIASES[raw.replace(/\s+/g, " ")] ||
    "";

  const aliasCategory =
    (aliasSlug && CATEGORIES.find((c) => c.slug === aliasSlug)) || undefined;

  if (aliasCategory) {
    const baseKeywords = uniqueStrings([
      aliasCategory.name,
      aliasCategory.slug.replace(/-/g, " "),
      ...(aliasCategory.keywords || []),
      ...aliasCategory.subcategories.flatMap((s) => [s.name, s.slug.replace(/-/g, " "), ...(s.keywords || [])]),
    ]);

    return {
      canonical: aliasCategory.slug,
      categoryId: aliasCategory.id,
      categoryName: aliasCategory.name,
      categorySlug: aliasCategory.slug,
      keywords: uniqueStrings([
        ...aliasCategory.keywords,
        aliasCategory.name,
        aliasCategory.slug.replace(/-/g, " "),
      ]),
      subKeywords: uniqueStrings(
        aliasCategory.subcategories.flatMap((s) => [
          s.name,
          s.slug.replace(/-/g, " "),
          ...(s.keywords || []),
        ])
      ),
      strictKeywords: baseKeywords,
      familyKeywords: baseKeywords,
      aliases: uniqueStrings([
        aliasCategory.slug,
        aliasCategory.name,
        aliasCategory.name.toLowerCase(),
        aliasCategory.slug.replace(/-/g, " "),
      ]),
    };
  }

  const fallbackKey =
    raw || token || "all";

  const family = CATEGORY_FAMILY_FALLBACKS[fallbackKey] || CATEGORY_FAMILY_FALLBACKS[
    Object.keys(CATEGORY_FAMILY_FALLBACKS).find((k) => fallbackKey.includes(k) || k.includes(fallbackKey)) || ""
  ] || [];

  return {
    canonical: fallbackKey,
    categoryId: "",
    categoryName: fallbackKey,
    categorySlug: fallbackKey,
    keywords: family,
    subKeywords: [],
    strictKeywords: family,
    familyKeywords: family,
    aliases: uniqueStrings([fallbackKey, fallbackKey.replace(/-/g, " ")]),
  };
}

function expandKeyword(keyword: string): string[] {
  const text = normalizeText(keyword);
  if (!text) return [];

  const words = text.split(" ").filter(Boolean);
  const variants = new Set<string>();

  variants.add(text);

  if (words.length > 1) {
    variants.add(words.slice(0, 2).join(" "));
    variants.add(words.slice(0, 3).join(" "));
    variants.add(words.slice(-2).join(" "));
  }

  if (words.length === 1) {
    variants.add(`${text} accessory`);
    variants.add(`${text} gadget`);
    variants.add(`${text} pro`);
    variants.add(`${text} cheap`);
  }

  if (text.includes("smart")) {
    variants.add("smart gadget");
    variants.add("smart device");
  }

  if (text.includes("watch")) {
    variants.add("smart watch");
    variants.add("luxury watch");
  }

  if (text.includes("phone") || text.includes("mobile")) {
    variants.add("phone accessory");
    variants.add("mobile accessory");
    variants.add("smartphone accessory");
  }

  if (
    text.includes("necklace") ||
    text.includes("ring") ||
    text.includes("bracelet") ||
    text.includes("earring")
  ) {
    variants.add("jewelry");
    variants.add("fashion jewelry");
    variants.add("women jewelry");
    variants.add("gift jewelry");
  }

  if (text.includes("home") || text.includes("kitchen")) {
    variants.add("home decor");
    variants.add("kitchen tools");
    variants.add("home appliance");
    variants.add("furniture");
  }

  if (text.includes("beauty") || text.includes("skincare") || text.includes("makeup")) {
    variants.add("skincare");
    variants.add("beauty tools");
    variants.add("makeup brush");
    variants.add("face mask");
  }

  if (text.includes("solar") || text.includes("energy")) {
    variants.add("solar panel");
    variants.add("solar inverter");
    variants.add("power station");
  }

  return [...variants];
}

function buildCandidateKeywords(plan: QueryPlan): string[] {
  const base = normalizeText(plan.keywordCandidates[0] || "");
  const profile = plan.categoryProfile;

  const sectionPools: Record<SectionKind, string[]> = {
    search: [],
    browse: BROWSE_POOLS,
    trending: TRENDING_POOLS,
    deals: DEALS_POOLS,
    "new-arrivals": NEW_ARRIVALS_POOLS,
    budget: BUDGET_POOLS,
  };

  const candidates: string[] = [];

  if (base) {
    candidates.push(...expandKeyword(base));
  }

  candidates.push(...plan.keywordCandidates.slice(1).flatMap(expandKeyword));

  if (profile.familyKeywords.length) {
    candidates.push(...profile.familyKeywords);
    candidates.push(...profile.strictKeywords);
  }

  if (profile.keywords.length) {
    candidates.push(...profile.keywords);
  }

  if (profile.subKeywords.length) {
    candidates.push(...profile.subKeywords);
  }

  if (plan.section === "search" && base) {
    candidates.push(`${base} accessories`, `${base} gadget`, `${base} compatible`);
  }

  if (plan.section === "browse") {
    candidates.push(
      "smartphone 5g",
      "wireless earbuds",
      "smart watch",
      "kitchen tools",
      "women shoes",
      "men jacket",
      "home decor",
      "car accessories"
    );
  }

  if (plan.section === "trending") {
    candidates.push(
      "viral gadget",
      "portable speaker",
      "gaming headset",
      "smart watch",
      "wireless earbuds"
    );
  }

  if (plan.section === "deals") {
    candidates.push(
      "flash sale product",
      "discount gadget",
      "clearance accessory",
      "coupon item",
      "hot deal"
    );
  }

  if (plan.section === "new-arrivals") {
    candidates.push(
      "new arrival gadget",
      "latest fashion item",
      "new home product",
      "new tech gadget"
    );
  }

  if (plan.section === "budget") {
    candidates.push("cheap gadget", "budget accessory", "mini tool", "small kitchen tool");
  }

  const unique = uniqueStrings(candidates);
  if (!unique.length) return ["smart gadget", "fashion item", "home product"];

  if (base) {
    const rest = unique.filter((k) => k !== base);
    return [base, ...rotateBySeed(rest, plan.seed)];
  }

  return rotateBySeed(unique, plan.seed);
}

function buildRequestCacheKey(method: string, params: Record<string, string>): string {
  return `api:${method}:${stableStringify(params)}`;
}

async function callApi(method: string, methodParams: Record<string, string>): Promise<any> {
  const cacheKey = buildRequestCacheKey(method, methodParams);
  const cached = cache.get<any>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string> = {
    app_key: APP_KEY,
    method,
    sign_method: "md5",
    timestamp: nowTimestamp(),
    v: "2",
    tracking_id: AFFILIATE_ID,
    target_currency: "USD",
    target_language: "EN",
    ...methodParams,
  };

  params.sign = sign(params);

  const body = new URLSearchParams(params).toString();

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body,
      signal: createTimeoutSignal(12000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data && typeof data === "object" && "error_response" in (data as Record<string, unknown>)) {
      const errData = (data as Record<string, unknown>).error_response as Record<string, unknown>;
      console.error("[AliExpress API Error]", method, errData?.code, errData?.msg);
      return null;
    }

    cache.set(cacheKey, data, ONE_HOUR);
    return data;
  } catch (err) {
    console.error("[AliExpress API Error]", method, (err as Error).message);
    return null;
  }
}

function injectTrustLayer(product: AliProduct): AliProduct {
  const badges: string[] = [];
  const rating = parseFloat(product.evaluate_rate || "0");
  const volume = Number(product.lastest_volume || 0);
  const discount = parseInt(product.discount || "0", 10);
  const bucket = hashInt(product.product_id || product.shop_id || product.product_title) % 100;

  if (rating >= 4.8 && volume >= 500) {
    badges.push("Top Rated Seller");
    product.is_top_choice = true;
    product.is_verified_seller = true;
  } else if (volume >= 1500 || bucket < 35) {
    badges.push("Popular Choice");
    product.is_verified_seller = true;
  } else {
    product.is_verified_seller = bucket % 2 === 0;
  }

  if (discount >= 40) {
    badges.push("Price Drop Alert");
    product.price_drop_alert = true;
  }

  if (volume >= 2000 || product.is_top_choice) {
    product.shipping_tag = "Fast Shipping";
  } else if (bucket % 3 === 0) {
    product.shipping_tag = "Free Shipping Eligible";
  } else {
    product.shipping_tag = "Worldwide Delivery";
  }

  product.trust_badges = badges.length > 0 ? badges : ["Verified Merchant"];

  if (!product.shop_name || product.shop_name.trim() === "") {
    product.shop_name = "Global Premium Factory Store";
  }

  return product;
}

function parseProduct(raw: Record<string, any>): AliProduct {
  const appPrice = String(
    raw.app_sale_price ||
      raw.sale_price ||
      raw.target_sale_price ||
      raw.min_price ||
      raw.price ||
      "0"
  );

  const salePrice = String(
    raw.sale_price ||
      raw.app_sale_price ||
      raw.target_sale_price ||
      raw.min_price ||
      raw.price ||
      "0"
  );

  const origPrice = String(raw.original_price || raw.orig_price || raw.market_price || appPrice);

  let discount = String(raw.discount || raw.discount_rate || "0");
  if (discount.endsWith("%")) discount = discount.slice(0, -1);

  const parsed: AliProduct = {
    product_id: String(raw.product_id || raw.id || raw.productId || ""),
    product_title: String(raw.product_title || raw.title || raw.product_name || ""),
    product_main_image_url: String(
      raw.product_main_image_url || raw.product_image || raw.main_image || raw.image || ""
    ),
    product_small_image_urls: normalizeImageUrls(
      raw.product_small_image_urls || raw.product_small_images || raw.small_image_urls
    ),
    product_video_url: raw.product_video_url ? String(raw.product_video_url) : undefined,
    app_sale_price: appPrice,
    sale_price: salePrice,
    original_price: origPrice,
    target_sale_price: raw.target_sale_price ? String(raw.target_sale_price) : undefined,
    discount,
    evaluate_rate: String(raw.evaluate_rate || raw.rating || "4.6"),
    lastest_volume: Number(raw.lastest_volume || raw.volume || raw.sold || 0),
    shop_url: String(raw.shop_url || raw.store_url || ""),
    shop_name: raw.shop_name ? String(raw.shop_name) : undefined,
    shop_id: raw.shop_id ? String(raw.shop_id) : undefined,
    product_detail_url: String(
      raw.product_detail_url ||
        raw.detail_url ||
        raw.item_url ||
        raw.promotion_link ||
        raw.product_url ||
        ""
    ),
    promotion_link: String(
      raw.promotion_link ||
        raw.promotion_url ||
        raw.promotion_link_url ||
        raw.product_detail_url ||
        raw.detail_url ||
        ""
    ),
    first_level_category_id: String(raw.first_level_category_id || raw.category_id || ""),
    second_level_category_id: String(raw.second_level_category_id || raw.sub_category_id || ""),
    first_level_category_name: raw.first_level_category_name
      ? String(raw.first_level_category_name)
      : undefined,
    second_level_category_name: raw.second_level_category_name
      ? String(raw.second_level_category_name)
      : undefined,
    commission_rate: raw.commission_rate ? String(raw.commission_rate) : undefined,
    hot_product_commission_rate: raw.hot_product_commission_rate
      ? String(raw.hot_product_commission_rate)
      : undefined,
    sku_id: raw.sku_id ? String(raw.sku_id) : undefined,
  };

  if (!parsed.discount || parsed.discount === "0") {
    const sale = parsePrice(parsed.sale_price);
    const orig = parsePrice(parsed.original_price);
    parsed.discount = String(computeDiscount(orig, sale));
  }

  if (!parsed.product_detail_url) parsed.product_detail_url = parsed.promotion_link;
  if (!parsed.promotion_link) parsed.promotion_link = parsed.product_detail_url;
  if (!parsed.product_main_image_url && parsed.product_small_image_urls?.string?.[0]) {
    parsed.product_main_image_url = parsed.product_small_image_urls.string[0];
  }

  return injectTrustLayer(parsed);
}

function scoreProduct(product: AliProduct, profile: CategoryProfile, primaryQuery: string, seed: number): number {
  const title = normalizeText(product.product_title || "");
  const query = normalizeText(primaryQuery || "");
  const qTokens = query.split(" ").filter(Boolean);
  const tTokens = title.split(" ").filter(Boolean);

  let score =
    parseFloat(product.evaluate_rate || "0") * 120 +
    Math.log10((Number(product.lastest_volume || 0) || 0) + 1) * 28 +
    (parseInt(product.discount || "0", 10) || 0) * 0.8 +
    (seed % 97) / 100;

  if (query && title.includes(query)) score += 280;

  if (qTokens.length) {
    let matches = 0;
    for (const token of qTokens) {
      if (token.length < 2) continue;
      if (title.includes(token)) matches += 1;
    }
    score += matches * 70;

    const titleSet = new Set(tTokens);
    const overlap = qTokens.filter((token) => titleSet.has(token)).length;
    score += overlap * 55;
  }

  const kwPool = uniqueStrings([
    ...profile.strictKeywords,
    ...profile.familyKeywords,
    ...profile.keywords,
    ...profile.subKeywords,
  ]);

  for (const kw of kwPool.slice(0, 20)) {
    const k = normalizeText(kw);
    if (!k) continue;
    if (title.includes(k)) score += 45;
  }

  if (product.first_level_category_id && profile.categoryId && product.first_level_category_id === profile.categoryId) {
    score += 120;
  }

  if (product.is_top_choice) score += 60;
  if (product.is_verified_seller) score += 25;
  if (product.price_drop_alert) score += 20;

  return score;
}

function productMatchesCategory(product: AliProduct, profile: CategoryProfile): boolean {
  if (!profile.categoryId && !profile.strictKeywords.length) return true;

  const title = normalizeText(product.product_title || "");
  const pCatName = normalizeText(product.first_level_category_name || "");
  const sCatName = normalizeText(product.second_level_category_name || "");
  const pool = uniqueStrings([
    ...profile.strictKeywords,
    ...profile.familyKeywords,
    ...profile.keywords,
    ...profile.subKeywords,
  ]);

  if (profile.categoryId && product.first_level_category_id === profile.categoryId) return true;
  if (profile.categoryId && product.second_level_category_id === profile.categoryId) return true;

  if (pCatName && profile.categoryName && pCatName.includes(normalizeText(profile.categoryName))) return true;
  if (sCatName && profile.categoryName && sCatName.includes(normalizeText(profile.categoryName))) return true;

  const matchCount = pool.reduce((count, kw) => {
    const k = normalizeText(kw);
    if (!k) return count;
    if (title.includes(k)) return count + 1;
    return count;
  }, 0);

  const threshold = profile.categoryId ? 1 : 2;
  return matchCount >= threshold;
}

function filterByPrice(products: AliProduct[], minPrice?: string, maxPrice?: string): AliProduct[] {
  if (!minPrice && !maxPrice) return products;
  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : Infinity;

  return products.filter((p) => {
    const price = parseFloat(p.sale_price || p.app_sale_price || "0");
    return price >= min && price <= max;
  });
}

function enforceDiversity(products: AliProduct[], limit: number): AliProduct[] {
  const seen = new Set<string>();
  const sellerCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  const sorted = [...products];
  const result: AliProduct[] = [];

  for (const product of sorted) {
    if (!product.product_id || seen.has(product.product_id)) continue;

    const sellerKey = product.shop_id || product.shop_name || "";
    const categoryKey = product.first_level_category_id || product.second_level_category_id || "";

    if (sellerKey) {
      const count = sellerCounts.get(sellerKey) || 0;
      if (count >= 2) continue;
      sellerCounts.set(sellerKey, count + 1);
    }

    if (categoryKey) {
      const count = categoryCounts.get(categoryKey) || 0;
      if (count >= 10 && result.length < limit - 5) continue;
      categoryCounts.set(categoryKey, count + 1);
    }

    seen.add(product.product_id);
    result.push(product);
    if (result.length >= limit) break;
  }

  return result;
}

function strictCategoryFilter(
  products: AliProduct[],
  profile: CategoryProfile,
  minWanted: number
): AliProduct[] {
  if (!profile.categoryId && !profile.strictKeywords.length) return products;

  const exact = products.filter((p) => productMatchesCategory(p, profile));
  if (exact.length >= minWanted) return exact;

  const relaxed = products.filter((p) => {
    const title = normalizeText(p.product_title || "");
    const kwPool = uniqueStrings([
      ...profile.familyKeywords,
      ...profile.keywords,
      ...profile.subKeywords,
    ]);
    const hits = kwPool.reduce((count, kw) => {
      const k = normalizeText(kw);
      if (!k) return count;
      if (title.includes(k)) return count + 1;
      return count;
    }, 0);
    return hits >= 1;
  });

  return relaxed.length >= minWanted ? relaxed : exact.length ? exact : products;
}

async function syncProductsToCache(products: AliProduct[]) {
  if (!products.length) return;

  try {
    const rows = products.map((p) => ({
      product_id: p.product_id,
      slug: `product-${p.product_id}`,
      title: p.product_title,
      primary_image_url: p.product_main_image_url,
      price: parseFloat(p.original_price) || 0,
      sale_price: parseFloat(p.sale_price) || 0,
      rating: parseFloat(p.evaluate_rate) || 4.5,
      affiliate_url: p.promotion_link,
      source_payload: p as any,
      category_slug: p.first_level_category_id || "",
      source: "aliexpress",
      updated_at: new Date().toISOString(),
    }));

    await (supabase.from("cached_products") as any).upsert(rows, {
      onConflict: "product_id",
    });
  } catch (err) {
    console.error("[Cache Sync Error]", (err as Error).message);
  }
}

export async function getCachedProductsByIds(ids: string[]): Promise<AliProduct[]> {
  if (!ids || !ids.length) return [];

  try {
    const { data } = await (supabase.from("cached_products") as any)
      .select("source_payload")
      .in("product_id", ids);

    if (!data) return [];
    return data.map((row: any) => row.source_payload as AliProduct).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchBatchFromApi(args: {
  method: "search" | "hot";
  keyword: string;
  page: number;
  pageSize: number;
  aliCategoryId?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}): Promise<{ products: AliProduct[]; totalCount: number }> {
  const params: Record<string, string> = {
    keywords: args.keyword || "smart gadget",
    page_no: String(Math.max(1, args.page)),
    page_size: String(Math.min(args.pageSize, MAX_PAGE_SIZE)),
  };

  if (args.aliCategoryId) params.category_ids = args.aliCategoryId;
  if (args.sort) params.sort = args.sort;
  if (args.minPrice) params.min_sale_price = args.minPrice;
  if (args.maxPrice) params.max_sale_price = args.maxPrice;

  const methodName =
    args.method === "hot"
      ? "aliexpress.affiliate.hotproduct.query"
      : "aliexpress.affiliate.product.query";

  const data = await callApi(methodName, params);
  if (!data) return { products: [], totalCount: 0 };

  const root =
    args.method === "hot"
      ? data?.aliexpress_affiliate_hotproduct_query_response?.resp_result?.result
      : data?.aliexpress_affiliate_product_query_response?.resp_result?.result;

  const rawProducts = extractRawProducts(root);
  const products = rawProducts.map(parseProduct);
  const totalCount = extractTotalCount(root);

  return { products, totalCount };
}

async function queryCatalog(plan: QueryPlan): Promise<ProductQueryResult> {
  const keywordsKey = stableStringify(
    plan.keywordCandidates.reduce((acc, k, idx) => {
      acc[String(idx)] = k;
      return acc;
    }, {} as Record<string, string>)
  );

  const cacheKey = [
    `catalog:${plan.section}`,
    `page:${plan.page}`,
    `size:${plan.pageSize}`,
    `cat:${plan.categoryId || "all"}`,
    `sort:${plan.sort || "default"}`,
    `min:${plan.minPrice || "none"}`,
    `max:${plan.maxPrice || "none"}`,
    `seed:${plan.seed}`,
    `keywords:${keywordsKey}`,
  ].join("|");

  const cached = cache.get<ProductQueryResult>(cacheKey);
  if (cached) return cached;

  const candidates = buildCandidateKeywords(plan);
  const primaryCandidates = candidates.slice(0, plan.section === "search" ? 8 : 5);
  const fallbackCandidates = candidates.slice(
    primaryCandidates.length,
    primaryCandidates.length + 8
  );

  const batchSize = Math.max(
    8,
    Math.ceil(plan.pageSize / Math.max(primaryCandidates.length, 1)) + 2
  );
  const primaryMethod: "search" | "hot" = plan.useHotApiFirst ? "hot" : "search";

  const firstPass = await Promise.all(
    primaryCandidates.map((keyword, idx) =>
      fetchBatchFromApi({
        method: primaryMethod,
        keyword,
        page: plan.page + idx * 2,
        pageSize: batchSize,
        aliCategoryId: plan.categoryId,
        sort: plan.sort,
        minPrice: plan.minPrice,
        maxPrice: plan.maxPrice,
      })
    )
  );

  let merged = firstPass.flatMap((x) => x.products);
  let totalCount = Math.max(...firstPass.map((x) => x.totalCount).filter(Boolean), 0);

  merged = filterByPrice(merged, plan.minPrice, plan.maxPrice);
  merged = strictCategoryFilter(merged, plan.categoryProfile, MIN_RESULTS_BEFORE_WIDENING);

  if (merged.length < MIN_RESULTS_BEFORE_WIDENING) {
    const secondPass = await Promise.all(
      fallbackCandidates.map((keyword, idx) =>
        fetchBatchFromApi({
          method: "search",
          keyword,
          page: plan.page + idx + 1,
          pageSize: batchSize,
          aliCategoryId: plan.categoryId,
          sort: plan.sort,
          minPrice: plan.minPrice,
          maxPrice: plan.maxPrice,
        })
      )
    );

    merged = merged.concat(secondPass.flatMap((x) => x.products));
    totalCount = Math.max(totalCount, ...secondPass.map((x) => x.totalCount).filter(Boolean), 0);
  }

  if (merged.length < MIN_RESULTS_BEFORE_WIDENING && plan.section !== "budget") {
    const widerPass = await Promise.all(
      rotateBySeed(BROWSE_POOLS, plan.seed)
        .slice(0, 5)
        .map((keyword, idx) =>
          fetchBatchFromApi({
            method: "search",
            keyword,
            page: plan.page + idx + 3,
            pageSize: batchSize,
            aliCategoryId: plan.categoryId,
            sort: plan.sort,
            minPrice: plan.minPrice,
            maxPrice: plan.maxPrice,
          })
        )
    );

    merged = merged.concat(widerPass.flatMap((x) => x.products));
    totalCount = Math.max(totalCount, ...widerPass.map((x) => x.totalCount).filter(Boolean), 0);
  }

  merged = filterByPrice(merged, plan.minPrice, plan.maxPrice);
  merged = strictCategoryFilter(merged, plan.categoryProfile, 1);

  const unique = enforceDiversity(merged, plan.pageSize);
  const primaryQuery = plan.keywordCandidates.find(Boolean) || candidates[0] || "";
  const sorted = unique.sort(
    (a, b) =>
      scoreProduct(b, plan.categoryProfile, primaryQuery, plan.seed) -
      scoreProduct(a, plan.categoryProfile, primaryQuery, plan.seed)
  );

  let products = sorted.slice(0, plan.pageSize);

  if (!products.length) {
    const finalFallback = await Promise.all(
      rotateBySeed(plan.categoryProfile.familyKeywords.length ? plan.categoryProfile.familyKeywords : BROWSE_POOLS, plan.seed)
        .slice(0, 4)
        .map((keyword, idx) =>
          fetchBatchFromApi({
            method: "search",
            keyword,
            page: plan.page + idx + 1,
            pageSize: batchSize,
            aliCategoryId: plan.categoryId,
            sort: plan.sort,
            minPrice: plan.minPrice,
            maxPrice: plan.maxPrice,
          })
        )
    );

    const emergency = finalFallback.flatMap((x) => x.products);
    const emergencyFiltered = strictCategoryFilter(
      filterByPrice(emergency, plan.minPrice, plan.maxPrice),
      plan.categoryProfile,
      1
    );
    products = enforceDiversity(emergencyFiltered, plan.pageSize).slice(0, plan.pageSize);
    totalCount = Math.max(totalCount, ...finalFallback.map((x) => x.totalCount).filter(Boolean), 0);
  }

  if (!totalCount || totalCount < products.length) {
    totalCount = Math.max(products.length * 100, 10000);
  }

  const totalPage = Math.min(
    Math.max(1, Math.ceil(totalCount / plan.pageSize)),
    MAX_TOTAL_PAGES
  );

  const result: ProductQueryResult = {
    products,
    totalPage,
    currentPage: plan.page,
    totalCount,
  };

  cache.set(cacheKey, result, plan.section === "trending" ? THIRTY_MINUTES : ONE_HOUR);
  syncProductsToCache(products).catch((e) => console.error(e));

  return result;
}

export async function searchProducts(
  keywords: string,
  options: QueryOptions & { section?: SectionKind } = {}
): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
  const normalizedSort = mapSort(options.sort);
  const profile = resolveCategoryProfile(options.categoryId || "");
  const seed = options.seed || hashInt(`${keywords}|${page}|${profile.canonical}`);
  const baseKeyword = normalizeText(keywords || "").trim();

  const keywordCandidates = uniqueStrings([
    baseKeyword,
    ...expandKeyword(baseKeyword),
    ...(profile.familyKeywords || []),
    ...(options.isGlobalBrowse ? BROWSE_POOLS : []),
  ]);

  const section: SectionKind = options.section || (options.isGlobalBrowse ? "browse" : "search");

  const plan: QueryPlan = {
    section,
    keywordCandidates:
      keywordCandidates.length > 0
        ? keywordCandidates
        : section === "trending"
        ? TRENDING_POOLS
        : section === "deals"
        ? DEALS_POOLS
        : section === "new-arrivals"
        ? NEW_ARRIVALS_POOLS
        : BROWSE_POOLS,
    categoryId: profile.categoryId,
    page,
    pageSize,
    sort: normalizedSort,
    minPrice: options.minPrice,
    maxPrice: options.maxPrice,
    seed,
    useHotApiFirst: section === "trending",
    categoryProfile: profile,
  };

  return queryCatalog(plan);
}

export async function getHotProducts(
  keywords?: string,
  options: { page?: number; pageSize?: number; categoryId?: string; seed?: number } = {}
): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
  const profile = resolveCategoryProfile(options.categoryId || "");
  const seed = options.seed || hashInt(`${keywords || "hot"}|${page}|${profile.canonical}`);

  const candidates = uniqueStrings([
    ...(keywords ? expandKeyword(keywords) : TRENDING_POOLS),
    ...TRENDING_POOLS,
    ...(profile.familyKeywords || []),
  ]);

  const plan: QueryPlan = {
    section: "trending",
    keywordCandidates: rotateBySeed(candidates, seed),
    categoryId: profile.categoryId,
    page,
    pageSize,
    sort: "VOLUME_DESC",
    seed,
    useHotApiFirst: true,
    categoryProfile: profile,
  };

  const result = await queryCatalog(plan);
  if (result.products.length > 0) return result;

  return searchProducts(keywords || "trending products", {
    page,
    pageSize,
    categoryId: options.categoryId,
    sort: "popular",
    seed,
    section: "trending",
  });
}

export async function getProductDetail(productId: string): Promise<AliProduct | null> {
  const cacheKey = `product:${productId}`;
  const cached = cache.get<AliProduct>(cacheKey);
  if (cached) return cached;

  try {
    const { data: dbCached } = await (supabase.from("cached_products") as any)
      .select("source_payload")
      .eq("product_id", productId)
      .maybeSingle();

    if (dbCached?.source_payload) {
      cache.set(cacheKey, dbCached.source_payload, FIVE_HOURS);
      return dbCached.source_payload as AliProduct;
    }
  } catch {
    // ignore db errors and fall through
  }

  const params: Record<string, string> = { product_ids: productId };
  const data = await callApi("aliexpress.affiliate.productdetail.get", params);

  const root = data?.["aliexpress_affiliate_productdetail_get_response"]?.resp_result?.result;
  const rawProducts = extractRawProducts(root);
  const rawProduct = rawProducts[0];

  if (rawProduct) {
    const product = parseProduct(rawProduct);
    cache.set(cacheKey, product, FIVE_HOURS);
    return product;
  }

  const fallback = await searchProducts(productId, {
    page: 1,
    pageSize: 10,
    section: "search",
    seed: hashInt(productId),
  });

  const found =
    fallback.products.find((p) => p.product_id === productId) ||
    fallback.products[0] ||
    null;

  if (found) cache.set(cacheKey, found, TWO_HOURS);
  return found;
}

export async function getBrowseProducts(options: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  keyword?: string;
  seed?: number;
  sort?: string;
} = {}): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
  const seed =
    options.seed ||
    hashInt(`browse|${page}|${options.categoryId || ""}|${options.keyword || ""}`);

  return searchProducts(options.keyword || "", {
    page,
    pageSize,
    categoryId: options.categoryId,
    sort: options.sort || "recommended",
    seed,
    isGlobalBrowse: true,
    section: "browse",
  });
}

export async function getDealsProducts(options: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  seed?: number;
} = {}): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
  const seed = options.seed || hashInt(`deals|${page}|${options.categoryId || ""}`);

  return searchProducts("sale clearance discount", {
    page,
    pageSize,
    categoryId: options.categoryId,
    sort: "discount",
    seed,
    section: "deals",
    minPrice: "1",
    maxPrice: "9999",
  });
}

export async function getUnderFiveShop(options: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  keyword?: string;
  sort?: string;
}): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
  const seed = hashInt(`budget|${page}|${options.categoryId || ""}|${options.keyword || ""}`);

  const result = await searchProducts(options.keyword || "cheap gadget", {
    page,
    pageSize,
    categoryId: options.categoryId,
    sort: options.sort || "recommended",
    minPrice: "1.00",
    maxPrice: "5.00",
    seed,
    section: "budget",
  });

  if (result.products.length > 0) return result;

  return searchProducts("budget accessory", {
    page,
    pageSize,
    categoryId: options.categoryId,
    sort: "recommended",
    minPrice: "1.00",
    maxPrice: "5.00",
    seed: seed + 13,
    section: "budget",
  });
}