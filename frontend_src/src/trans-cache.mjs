// README translation result local persistence.
//
// Stores translated README HTML in the browser's localStorage so that closing
// the window, refreshing the page, or restarting HA shows the translation
// instantly — without calling the LLM again (zero request, zero token cost).
//
// Exposed as an ES module so it can be unit-tested directly under Node.

export const TRANS_CACHE_PREFIX = 'hacs_vision_trans_';
export const TRANS_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
export const TRANS_CACHE_MAX = 50; // keep at most 50 entries (LRU by timestamp)
export const TRANS_CACHE_MAX_SIZE = 1024 * 1024; // skip storing entries larger than 1 MB

export function transCacheKey(fullName, lang) {
  return TRANS_CACHE_PREFIX + fullName + '_' + lang;
}

export function transCacheGet(fullName, lang) {
  try {
    const raw = localStorage.getItem(transCacheKey(fullName, lang));
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj.html !== 'string') return null;
    if (Date.now() - (obj.ts || 0) > TRANS_CACHE_TTL) {
      try {
        localStorage.removeItem(transCacheKey(fullName, lang));
      } catch (e) {
        /* ignore */
      }
      return null;
    }
    return obj.html;
  } catch (e) {
    return null;
  }
}

export function transCachePut(fullName, lang, html) {
  try {
    if (!html || html.length > TRANS_CACHE_MAX_SIZE) return; // size guard
    // Enforce the max-entry cap: evict the oldest entry when at capacity.
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(TRANS_CACHE_PREFIX) === 0) keys.push(k);
    }
    if (keys.length >= TRANS_CACHE_MAX) {
      let oldestKey = null;
      let oldestTs = Infinity;
      for (const k of keys) {
        try {
          const o = JSON.parse(localStorage.getItem(k));
          if (o && o.ts < oldestTs) {
            oldestTs = o.ts;
            oldestKey = k;
          }
        } catch (e) {
          /* ignore malformed entry */
        }
      }
      if (oldestKey) localStorage.removeItem(oldestKey);
    }
    localStorage.setItem(
      transCacheKey(fullName, lang),
      JSON.stringify({ html, ts: Date.now() })
    );
  } catch (e) {
    /* quota exceeded or unavailable — silently ignore */
  }
}
