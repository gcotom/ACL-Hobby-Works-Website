// Global rate limiting using Vercel KV when available,
// with a safe fallback to in-memory limiting for local dev.

import { Ratelimit } from "@upstash/ratelimit";

// Detect KV via env; don't require it locally
let kvClient: any = null;
const hasKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

if (hasKV) {
  // @vercel/kv reads from env automatically
  // dynamic require keeps this file usable without KV
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  kvClient = require("@vercel/kv").kv;
}

export type Gate =
  | { ok: true }
  | { ok: false; reason: "interval" | "burst"; resetInMs: number };

/* ---------- KV-backed limiter ---------- */
let kvLimiterFast: Ratelimit | null = null;
let kvLimiterBurst: Ratelimit | null = null;

function toMs(reset: number) {
  return reset < 1e12 ? Math.max(0, reset * 1000 - Date.now()) : Math.max(0, reset - Date.now());
}

if (hasKV && kvClient) {
  kvLimiterFast = new Ratelimit({
    redis: kvClient,
    limiter: Ratelimit.fixedWindow(1, "30 s"), // 1 request / 30s
    prefix: "rl:quote:fast",
  });
  kvLimiterBurst = new Ratelimit({
    redis: kvClient,
    limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests / 10 min
    prefix: "rl:quote:burst",
  });
}

/* ---------- In-memory fallback (dev) ---------- */
type Store = Map<string, number[]>;
const g = globalThis as any;
const store: Store = (g.__ACL_RL_STORE ??= new Map());
const MIN_INTERVAL_MS = 30_000;
const BURST_WINDOW_MS = 10 * 60_000;
const BURST_MAX = 5;

function checkAndRecordMemory(ip: string): Gate {
  const now = Date.now();
  const list = store.get(ip) ?? [];
  const recent = list.filter((t) => now - t <= BURST_WINDOW_MS);

  const last = recent[recent.length - 1];
  if (last && now - last < MIN_INTERVAL_MS) {
    return { ok: false, reason: "interval", resetInMs: MIN_INTERVAL_MS - (now - last) };
  }
  if (recent.length >= BURST_MAX) {
    const resetInMs = BURST_WINDOW_MS - (now - recent[0]);
    return { ok: false, reason: "burst", resetInMs };
  }
  recent.push(now);
  store.set(ip, recent);
  return { ok: true };
}

/* ---------- Unified API ---------- */
export async function checkAndRecord(ip: string): Promise<Gate> {
  if (kvLimiterFast && kvLimiterBurst) {
    const [a, b] = await Promise.all([
      kvLimiterFast.limit(`f:${ip}`),
      kvLimiterBurst.limit(`b:${ip}`),
    ]);
    if (!a.success) return { ok: false, reason: "interval", resetInMs: toMs(a.reset) };
    if (!b.success) return { ok: false, reason: "burst", resetInMs: toMs(b.reset) };
    return { ok: true };
  }
  // Fallback (local / no KV)
  return checkAndRecordMemory(ip);
}
