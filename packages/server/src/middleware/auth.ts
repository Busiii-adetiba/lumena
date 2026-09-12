import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors.js";

export interface AuthMiddlewareOpts {
  apiKey?: string;
}

export function apiKeyAuth(opts: AuthMiddlewareOpts = {}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const expectedKey = opts.apiKey || process.env.LUMEN_API_KEY;

    // If no API key configured in server environment/options, pass through
    if (!expectedKey) {
      return next();
    }

    const headerKey = req.headers["x-api-key"] as string | undefined;
    const authHeader = req.headers.authorization;
    const bearerKey = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;

    const providedKey = headerKey || bearerKey;

    if (!providedKey || providedKey !== expectedKey) {
      return next(new ValidationError("Unauthorized: Invalid or missing API key", undefined, 401));
    }

    next();
  };
}
