import { describe, it, expect } from "vitest";
import {
  CosignRequestSchema,
  FeeBumpRequestSchema,
  PolicyRequestSchema,
} from "../validation.js";

describe("validation schemas", () => {
  it("validates valid cosign requests", () => {
    const valid = {
      xdr: "AAAA...",
      walletAddress: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    };
    const result = CosignRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid cosign requests", () => {
    const invalid = { xdr: "" };
    const result = CosignRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates valid fee bump requests", () => {
    const valid = { xdr: "AAAA..." };
    const result = FeeBumpRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("validates policy requests", () => {
    const valid = {
      walletId: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
      rules: [
        {
          type: "spend_limit",
          asset: "native",
          maxPerTx: "100",
          maxDaily: "500",
        },
      ],
    };
    const result = PolicyRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
