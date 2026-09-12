import type { Request, Response, NextFunction } from "express";

export interface RateLimiterOpts {
  windowMs?: number; // Time window in milliseconds (default: 60,000ms = 1 min)
  max?: number;      // Max requests per window (default: 100)
}

export function rateLimiter(opts: RateLimiterOpts = {}) {
  const windowMs = opts.windowMs ?? 60 * 1000;
  const max = opts.max ?? 100;

  const requestLog = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientKey =
      (req.headers["x-api-key"] as string) ||
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    const now = Date.now();
    const cutoff = now - windowMs;

    const timestamps = (requestLog.get(clientKey) ?? []).filter((t) => t > cutoff);

    if (timestamps.length >= max) {
      res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Maximum ${max} requests per ${windowMs / 1000} seconds.`,
      });
      return;
    }

    timestamps.push(now);
    requestLog.set(clientKey, timestamps);

    next();
  };
}
