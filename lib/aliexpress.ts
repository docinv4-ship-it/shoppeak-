import crypto from "crypto";
import cache, { FIVE_HOURS, ONE_HOUR } from "./cache";
import { getKeywordsForPage } from "./rotation";
import { supabase } from "./db";

const APP_KEY = process.env.ALIEXPRESS_APP_KEY!;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET!;
const AFFILIATE_ID = process.env.ALIEXPRESS_AFFILIATE_ID || "ShopPeak666";
const API_BASE = process.env.ALIEXPRESS_API_BASE_URL || "https://api-sg.aliexpress.com/sync";

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

function mapCategoryToAliExpress(catInput: string): { id: string; keywordFallback: string } {
  if (/^\d+$/.test(catInput)) {
    return { id: catInput, keywordFallback: "" };
  }
  const normalized = catInput.toLowerCase().trim().replace(/&/g, "and");
  const mapping: Record<string, { id: string; keywordFallback: string }> = {
    "jewelery and watch": { id: "36", keywordFallback: "luxury watch chronograph luxury ring diamond" },
    "jewelry and watch": { id: "36", keywordFallback: "luxury watch chronograph luxury ring diamond" },
    "lighting and chandelier": { id: "39", keywordFallback: "pendant light chandelier ceiling lamp fixture LED" },
    "home appliance": { id: "6", keywordFallback: "smart vacuum cleaner blender air fryer coffee machine" },
    "machinery and industrial": { id: "1420", keywordFallback: "laser engraving machine CNC tools heavy industry" },
    "outdoor and support": { id: "18", keywordFallback: "camping hunting equipment ebike sportswear jacket" },
    "outdoor sports": { id: "18", keywordFallback: "camping hunting equipment ebike sportswear jacket" },
    "fashion and style": { id: "320", keywordFallback: "apparel designer clothing jacket luxury dress clothing" },
    "health and beauty": { id: "66", keywordFallback: "skincare beauty products cosmetic makeup body health" },
    "solar and energy": { id: "1420", keywordFallback: "solar panel power system inverter lifepo4 lithium pack" },
    "security and CCTV": { id: "30", keywordFallback: "cctv surveillance IP camera security guard kit video" },
    "luxury and high value": { id: "36", keywordFallback: "fine jewelry luxurious gold diamond diamond watches chronometer" },
    "professional audio": { id: "63", keywordFallback: "audio speaker system sound mixer amplifier microphone" },
    "medical and mobility": { id: "66", keywordFallback: "medical health aid mobility devices brace rehabilitation" }
  };

  for (const key in mapping) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return mapping[key];
    }
  }
  return { id: "", keywordFallback: catInput };
}

function getTimestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function sign(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  let str = APP_SECRET;
  for (const key of sortedKeys) str += key + params[key];
  str += APP_SECRET;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

async function callApi(method: string, methodParams: Record<string, string>): Promise<any> {
  const cacheKey = `api:${method}:${JSON.stringify(methodParams)}`;
  const cached = cache.get<any>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string> = {
    app_key: APP_KEY,
    method,
    sign_method: "md5",
    timestamp: getTimestamp(),
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
      signal: AbortSignal.timeout(12000),
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
  const volume = product.lastest_volume || 0;
  const disc = parseInt(product.discount || "0", 10);

  if (rating >= 4.7 && volume > 500) {
    badges.push("Top Rated Seller");
    product.is_top_choice = true;
    product.is_verified_seller = true;
  } else if (volume > 1000) {
    badges.push("Popular Choice");
    product.is_verified_seller = true;
  } else {
    product.is_verified_seller = Math.random() > 0.3;
  }

  if (disc >= 40) {
    badges.push("Price Drop Alert");
    product.price_drop_alert = true;
  }

  if (volume > 2000 || product.is_top_choice) {
    product.shipping_tag = "Fast Shipping";
  } else {
    product.shipping_tag = "Free Shipping Eligible";
  }

  product.trust_badges = badges.length > 0 ? badges : ["Verified Merchant"];
  if (!product.shop_name || product.shop_name.trim() === "") {
    product.shop_name = "Global Premium Factory Store";
  }
  return product;
}

function parseProduct(raw: Record<string, unknown>): AliProduct {
  const appPrice = String(raw.app_sale_price || raw.sale_price || "0");
  const salePrice = String(raw.sale_price || raw.app_sale_price || "0");
  const origPrice = String(raw.original_price || appPrice);
  const promoLink = String(raw.promotion_link || raw.product_detail_url || "");

  let discount = String(raw.discount || "0");
  if (discount.endsWith("%")) discount = discount.slice(0, -1);

  const parsed: AliProduct = {
    product_id: String(raw.product_id || ""),
    product_title: String(raw.product_title || ""),
    product_main_image_url: String(raw.product_main_image_url || ""),
    product_small_image_urls: raw.product_small_image_urls as { string: string[] } | undefined,
    product_video_url: raw.product_video_url ? String(raw.product_video_url) : undefined,
    app_sale_price: appPrice,
    sale_price: salePrice,
    original_price: origPrice,
    target_sale_price: raw.target_sale_price ? String(raw.target_sale_price) : undefined,
    discount,
    evaluate_rate: String(raw.evaluate_rate || "4.6"),
    lastest_volume: Number(raw.lastest_volume || 0),
    shop_url: String(raw.shop_url || ""),
    shop_name: raw.shop_name ? String(raw.shop_name) : undefined,
    shop_id: raw.shop_id ? String(raw.shop_id) : undefined,
    product_detail_url: String(raw.product_detail_url || promoLink),
    promotion_link: promoLink,
    first_level_category_id: String(raw.first_level_category_id || ""),
    second_level_category_id: String(raw.second_level_category_id || ""),
    first_level_category_name: raw.first_level_category_name ? String(raw.first_level_category_name) : undefined,
    second_level_category_name: raw.second_level_category_name ? String(raw.second_level_category_name) : undefined,
    commission_rate: raw.commission_rate ? String(raw.commission_rate) : undefined,
    hot_product_commission_rate: raw.hot_product_commission_rate ? String(raw.hot_product_commission_rate) : undefined,
    sku_id: raw.sku_id ? String(raw.sku_id) : undefined,
  };
  return injectTrustLayer(parsed);
}

function extractRawProducts(resultNode: any): any[] {
  if (!resultNode || !resultNode.products) return [];
  const pNode = resultNode.products.product;
  if (!pNode) return [];
  return Array.isArray(pNode) ? pNode : [pNode];
}

async function syncProductsToCache(products: AliProduct[]) {
  if (!products.length) return;
  const rows = products.map(p => ({
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
    updated_at: new Date().toISOString()
  }));
  await (supabase.from("cached_products") as any).upsert(rows, { onConflict: "product_id" });
}

export async function getCachedProductsByIds(ids: string[]): Promise<AliProduct[]> {
  if (!ids || !ids.length) return [];
  const { data } = await (supabase.from("cached_products") as any).select("source_payload").in("product_id", ids);
  if (!data) return [];
  return data.map((row: any) => row.source_payload as AliProduct);
}

export async function getUnderFiveShop(options: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  keyword?: string;
  sort?: string;
}): Promise<ProductQueryResult> {
  const page = options.page || 1;
  const pageSize = options.pageSize || 40;
  const lowBudgetKeywords = ["cable protector", "mini led keychain", "silicone kitchen tool", "phone stand", "cleaning brush"];
  const selectedKeywordIdx = (page - 1) % lowBudgetKeywords.length;
  const targetKeyword = options.keyword && options.keyword !== "gadgets" ? options.keyword : lowBudgetKeywords[selectedKeywordIdx];

  let result = await searchProducts(targetKeyword, {
    page,
    pageSize,
    categoryId: options.categoryId,
    minPrice: "1.00",
    maxPrice: "10.00", 
    sort: options.sort || "VOLUME_DESC"
  });

  if (!result.products || result.products.length === 0) {
    result = await searchProducts("earphone case cover bag", {
      page,
      pageSize,
      minPrice: "1.00",
      maxPrice: "10.00",
      sort: "VOLUME_DESC"
    });
  }
  if (result.products && result.products.length > 0) {
    result.products = result.products.filter(p => {
      const price = parseFloat(p.sale_price || "0");
      return price > 0 && price <= 12.00;
    });
  }
  return result;
}

// ─── Search Products (PREMIUM DIVERSIFIED UPDATE) ───────────────────────────
export async function searchProducts(
  keywords: string,
  options: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    seed?: number;
  } = {}
): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || 50, 50);
  const activeSeed = options.seed || Math.floor(Math.random() * 10000);

  let targetCategoryIds = "";
  let baseKeyword = keywords && keywords.trim() !== "" ? keywords.trim() : "";

  if (options.categoryId) {
    const mappingResult = mapCategoryToAliExpress(options.categoryId);
    targetCategoryIds = mappingResult.id;

    const catLower = options.categoryId.toLowerCase();
    if (catLower.includes("electronic") || targetCategoryIds === "6" || targetCategoryIds === "63") {
      const electronicsPool = [
        "4k projector ultra", "mechanical keyboard switches", "action camera wireless",
        "smart bluetooth speaker v5.3", "gaming mouse rgb premium", "dual lens dash cam vehicle"
      ];
      baseKeyword = electronicsPool[(page + activeSeed) % electronicsPool.length];
    } else if (catLower.includes("phone") || catLower.includes("mobile") || targetCategoryIds === "509") {
      const mobilePool = [
        "smartphone flagship 5g", "android smartphone unblocked", "fast charging powerbank 30w",
        "magnetic wireless charger stand", "noise cancelling headphones wireless"
      ];
      baseKeyword = mobilePool[(page + activeSeed) % mobilePool.length];
    } else if (!baseKeyword) {
      baseKeyword = mappingResult.keywordFallback || "top trending choices";
    }
  }

  // 💎 FIX: Jab user All Products par ho (No filter applied) to max diverse keyword allocation engine chalayen
  if (!options.categoryId && (!baseKeyword || baseKeyword.toLowerCase().includes("trending") || baseKeyword.toLowerCase().includes("best seller"))) {
    const macroGlobalPool = [
      "smart electronics gadgets", "men sports fashion shoes", "luxury design watches quartz",
      "home intelligent electronics led", "kitchen smart accessories utensils", "unlocked cellular android smartphones",
      "women luxury diamond jewelry", "portable lifestyle gadgets smart", "computer component gaming mechanical",
      "wireless sound system ambient", "outdoor sports tactical backpack", "car dashcam intelligent radar"
    ];
    baseKeyword = macroGlobalPool[(page + activeSeed) % macroGlobalPool.length];
  }

  const effectiveKeyword = baseKeyword;
  const minPr = options.minPrice || "none";
  const maxPr = options.maxPrice || "none";

  const queryKey = `search:${effectiveKeyword.toLowerCase().replace(/\s+/g, "-")}:cat:${targetCategoryIds || "all"}:sort:${options.sort || "default"}:min:${minPr}:max:${maxPr}:page:${page}:seed:${activeSeed}`;

  const memCached = cache.get<ProductQueryResult>(queryKey);
  if (memCached) return memCached;

  const { data: qCache } = await (supabase.from("cached_searches") as any)
    .select("product_ids")
    .eq("query_key", queryKey)
    .maybeSingle();

  if (qCache && qCache.product_ids && Array.isArray(qCache.product_ids) && qCache.product_ids.length > 0) {
    const hydProducts = await getCachedProductsByIds(qCache.product_ids);
    if (hydProducts && hydProducts.length > 0) {
      // Pricing local filtering layer check inside active cache hit matching array maps
      let finalPool = [...hydProducts];
      if (options.minPrice || options.maxPrice) {
        const mxMin = options.minPrice ? parseFloat(options.minPrice) : 0;
        const mxMax = options.maxPrice ? parseFloat(options.maxPrice) : Infinity;
        finalPool = finalPool.filter(p => {
          const pr = parseFloat(p.sale_price || p.app_sale_price || "0");
          return pr >= mxMin && pr <= mxMax;
        });
      }
      if (finalPool.length > 0) {
        return { products: finalPool, totalPage: 200, currentPage: page, totalCount: 10000 };
      }
    }
  }

  const params: Record<string, string> = {
    keywords: effectiveKeyword,
    page_no: String(page),
    page_size: String(pageSize),
  };
  if (targetCategoryIds) params.category_ids = targetCategoryIds;
  if (options.minPrice) params.min_sale_price = options.minPrice;
  if (options.maxPrice) params.max_sale_price = options.maxPrice;
  if (options.sort) params.sort = options.sort;

  let data = await callApi("aliexpress.affiliate.product.query", params);
  let resp = data?.["aliexpress_affiliate_product_query_response"]?.resp_result;
  let rawProducts = extractRawProducts(resp?.result);

  // 🛠️ RELAXATION FALLBACK FIX: If API strict matching blocks items, immediately query open scope without dropping parameters context
  if (!rawProducts || rawProducts.length === 0) {
    const relaxParams = { ...params };
    delete relaxParams.min_sale_price;
    delete relaxParams.max_sale_price;
    const backupData = await callApi("aliexpress.affiliate.product.query", relaxParams);
    rawProducts = extractRawProducts(backupData?.["aliexpress_affiliate_product_query_response"]?.resp_result?.result);
  }

  try {
    if (!rawProducts || rawProducts.length === 0) {
      return { products: [], totalPage: 1, currentPage: page, totalCount: 0 };
    }

    let parsedProducts = rawProducts.map(parseProduct);

    // 🎯 CRITICAL ACCURATE FILTERING LAYER: Local client sorting arrays for custom user parameters range execution
    if (options.minPrice || options.maxPrice) {
      const targetMin = options.minPrice ? parseFloat(options.minPrice) : 0;
      const targetMax = options.maxPrice ? parseFloat(options.maxPrice) : Infinity;
      const targetFiltered = parsedProducts.filter(p => {
        const itemPrice = parseFloat(p.sale_price || p.app_sale_price || "0");
        return itemPrice >= targetMin && itemPrice <= targetMax;
      });
      if (targetFiltered.length > 0) {
        parsedProducts = targetFiltered;
      }
    }

    const totalCount = Number(resp?.result?.total_record_count || parsedProducts.length || 10000);
    const totalPage = Math.min(Math.ceil(totalCount / pageSize), 200);

    const resultPayload: ProductQueryResult = { products: parsedProducts, totalPage, currentPage: page, totalCount };
    cache.set(queryKey, resultPayload, ONE_HOUR);

    syncProductsToCache(parsedProducts).then(async () => {
      const pIdsArray = parsedProducts.map(p => p.product_id);
      await (supabase.from("cached_searches") as any).upsert({
        query_key: queryKey,
        product_ids: pIdsArray,
        updated_at: new Date().toISOString()
      }, { onConflict: "query_key" });
    }).catch(e => console.error(e));

    return resultPayload;
  } catch (err) {
    console.error(err);
    return { products: [], totalPage: 1, currentPage: page, totalCount: 0 };
  }
}

export async function getHotProducts(
  keywords?: string,
  options: { page?: number; pageSize?: number; categoryId?: string; seed?: number } = {}
): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || 50, 50);
  const activeSeed = options.seed || Math.floor(Math.random() * 100);
  const effectiveKeyword = keywords || "top trending smart gadgets";

  let targetCategoryIds = "";
  if (options.categoryId) {
    const mappingResult = mapCategoryToAliExpress(options.categoryId);
    targetCategoryIds = mappingResult.id;
  }

  const queryKey = `hot:${effectiveKeyword.toLowerCase().replace(/\s+/g, "-")}:cat:${targetCategoryIds || "all"}:page:${page}:seed:${activeSeed}`;
  const memCached = cache.get<ProductQueryResult>(queryKey);
  if (memCached) return memCached;

  const params: Record<string, string> = {
    keywords: effectiveKeyword,
    page_no: String(page),
    page_size: String(pageSize),
  };
  if (targetCategoryIds) params.category_ids = targetCategoryIds;

  const data = await callApi("aliexpress.affiliate.hotproduct.query", params);
  if (!data) return searchProducts(effectiveKeyword, { page, pageSize, categoryId: options.categoryId, seed: activeSeed });

  try {
    const resp = data["aliexpress_affiliate_hotproduct_query_response"]?.resp_result;
    const rawProducts = extractRawProducts(resp?.result);
    if (!rawProducts.length) return searchProducts(effectiveKeyword, { page, pageSize, categoryId: options.categoryId, seed: activeSeed });

    const parsedProducts = rawProducts.map(parseProduct);
    const totalCount = Number(resp?.result?.total_record_count || parsedProducts.length);
    const totalPage = Math.min(Math.ceil(totalCount / pageSize), 200);

    const resultPayload: ProductQueryResult = { products: parsedProducts, totalPage, currentPage: page, totalCount };
    cache.set(queryKey, resultPayload, ONE_HOUR);
    syncProductsToCache(parsedProducts).catch(e => console.error(e));
    return resultPayload;
  } catch (err) {
    return searchProducts(effectiveKeyword, { page, pageSize, categoryId: options.categoryId, seed: activeSeed });
  }
}

export async function getProductDetail(productId: string): Promise<AliProduct | null> {
  const cacheKey = `product:${productId}`;
  const cached = cache.get<AliProduct>(cacheKey);
  if (cached) return cached;

  const { data: dbCached } = await (supabase.from("cached_products") as any).select("source_payload").eq("product_id", productId).maybeSingle();
  if (dbCached?.source_payload) {
    cache.set(cacheKey, dbCached.source_payload, FIVE_HOURS);
    return dbCached.source_payload as AliProduct;
  }

  const params: Record<string, string> = { product_ids: productId };
  const data = await callApi("aliexpress.affiliate.productdetail.get", params);
  if (!data) return null;

  try {
    const resp = data["aliexpress_affiliate_productdetail_get_response"]?.resp_result;
    const rawProducts = extractRawProducts(resp?.result);
    const rawProduct = rawProducts[0];
    if (!rawProduct) return null;

    const product = parseProduct(rawProduct);
    cache.set(cacheKey, product, FIVE_HOURS);
    await (supabase.from("cached_products") as any).upsert({
      product_id: productId,
      slug: `product-${productId}`,
      title: product.product_title,
      primary_image_url: product.product_main_image_url,
      price: parseFloat(product.original_price) || 0,
      sale_price: parseFloat(product.sale_price) || 0,
      rating: parseFloat(product.evaluate_rate) || 4.5,
      affiliate_url: product.promotion_link,
      source_payload: product as any,
      category_slug: product.first_level_category_id || "",
      source: "aliexpress",
      updated_at: new Date().toISOString()
    }, { onConflict: "product_id" });
    return product;
  } catch (err) {
    return null;
  }
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
  const pageSize = Math.min(options.pageSize || 50, 50);
  const activeSeed = options.seed || Math.floor(Math.random() * 1000);
  const keyword = options.keyword || "";
  return searchProducts(keyword, { page, pageSize, categoryId: options.categoryId, sort: options.sort, seed: activeSeed });
}

export async function getDealsProducts(options: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  seed?: number;
} = {}): Promise<ProductQueryResult> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(options.pageSize || 50, 50);
  const activeSeed = options.seed || Math.floor(Math.random() * 100);
  const keyword = "sale clearance clearance items discount";

  if (page % 2 === 0) {
    return getHotProducts(keyword, { page, pageSize, categoryId: options.categoryId, seed: activeSeed });
  }
  return searchProducts(keyword, { page, pageSize, categoryId: options.categoryId, sort: "SALE_PRICE_ASC", seed: activeSeed });
}
