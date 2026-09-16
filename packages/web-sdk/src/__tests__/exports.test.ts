import { describe, it, expect } from "vitest";
import * as webSdk from "../index.js";

describe("web-sdk exports", () => {
  it("exports LumenClient and helpers", () => {
    expect(webSdk.LumenClient).toBeDefined();
    expect(typeof webSdk.createSessionKey).toBe("function");
  });
});
