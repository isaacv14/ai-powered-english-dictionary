const requestLog = new Map<string, number[]>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];

  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0]!;
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  requestLog.set(ip, recent);

  return { allowed: true, retryAfter: 0 };
}

export function resetRateLimit(ip: string): void {
  requestLog.delete(ip);
}
