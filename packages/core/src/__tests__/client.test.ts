import { describe, it, expect } from "vitest";
import { StellarClient } from "../stellar/client.js";

describe("core/client configuration", () => {
  it("defaults to testnet configuration", () => {
    const client = new StellarClient();
    expect(client.config.network).toBe("testnet");
    expect(client.config.horizonUrl).toContain("testnet");
  });

  it("configures mainnet network correctly", () => {
    const client = new StellarClient({ network: "mainnet" });
    expect(client.config.network).toBe("mainnet");
    expect(client.config.horizonUrl).toBe("https://horizon.stellar.org");
  });
});
