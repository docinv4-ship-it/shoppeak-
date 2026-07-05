export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ProductCache {
  private store = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 60 * 1000): void {
    this.store.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.store.clear();
      return;
    }
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) this.store.delete(key);
    }
  }

  size(): number {
    return this.store.size;
  }
}

const cache = new ProductCache();
export default cache;

export const FIVE_HOURS = 5 * 60 * 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;
export const THIRTY_MIN = 30 * 60 * 1000;
