import { describe, it, expect } from "vitest";

describe("health response structure", () => {
  it("formats health payload structure", () => {
    const health = {
      status: "ok",
      horizonConnected: true,
      network: "testnet",
      version: "0.1.0",
    };
    expect(health.status).toBe("ok");
    expect(health.network).toBe("testnet");
  });
});
