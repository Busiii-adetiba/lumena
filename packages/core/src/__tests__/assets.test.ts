import { describe, it, expect } from "vitest";
import { KNOWN_ASSETS, getAsset, getNativeAsset } from "../stellar/assets.js";

describe("stellar/assets", () => {
  it("exports valid testnet assets", () => {
    expect(KNOWN_ASSETS.testnet).toBeDefined();
    expect(KNOWN_ASSETS.testnet.USDC.getCode()).toBe("USDC");
    expect(KNOWN_ASSETS.testnet.BTC.getCode()).toBe("BTC");
    expect(KNOWN_ASSETS.testnet.ETH.getCode()).toBe("ETH");
    expect(KNOWN_ASSETS.testnet.NGNT.getCode()).toBe("NGNT");
  });

  it("exports valid mainnet assets", () => {
    expect(KNOWN_ASSETS.mainnet).toBeDefined();
    expect(KNOWN_ASSETS.mainnet.USDC.getCode()).toBe("USDC");
  });

  it("creates custom assets using getAsset", () => {
    const asset = getAsset("USDC", KNOWN_ASSETS.testnet.USDC.getIssuer()!);
    expect(asset.getCode()).toBe("USDC");
  });

  it("returns native asset using getNativeAsset", () => {
    const native = getNativeAsset();
    expect(native.isNative()).toBe(true);
  });
});
