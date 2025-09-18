// src/lib/rate-limit.ts

type Gate =
  | { ok: true }
  | { ok: false; reason: "interval" | "burst"; resetInMs: number };

type Store = Map<string, number[]>;

// Persist across hot reloads:
const g = globalThis as any;
const store: Store = (g.__ACL_RL_STORE ??= new Map());

const MIN_INTERVAL_MS = 30_000;     // at least 30s between submits per IP
const BURST_WINDOW_MS = 10 * 60_000; // 10 minutes window
const BURST_MAX = 5;                 // max 5 submits per window

export function checkAndRecord(ip: string): Gate {
  const now = Date.now();
  const list = store.get(ip) ?? [];

  // drop events outside the burst window
  const recent = list.filter((t) => now - t <= BURST_WINDOW_MS);

  // too soon since last submit?
  const last = recent[recent.length - 1];
  if (last && now - last < MIN_INTERVAL_MS) {
    return { ok: false, reason: "interval", resetInMs: MIN_INTERVAL_MS - (now - last) };
  }

  // too many in the burst window?
  if (recent.length >= BURST_MAX) {
    const resetInMs = BURST_WINDOW_MS - (now - recent[0]);
    return { ok: false, reason: "burst", resetInMs };
  }

  // record this accepted event
  recent.push(now);
  store.set(ip, recent);
  return { ok: true };
}
