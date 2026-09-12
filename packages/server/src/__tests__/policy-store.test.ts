import { describe, it, expect, vi } from "vitest";
import { InMemoryPolicyStore, RedisPolicyStore } from "../policy/store.js";
import type { Policy } from "@lumen/types";

describe("InMemoryPolicyStore", () => {
  it("saves, retrieves, and deletes policies", async () => {
    const store = new InMemoryPolicyStore();
    const policy: Policy = {
      id: "p1",
      walletId: "w1",
      rules: [],
      createdAt: new Date(),
    };

    await store.savePolicy(policy);
    const retrieved = await store.getPolicy("w1");
    expect(retrieved).toEqual(policy);

    await store.deletePolicy("w1");
    const afterDelete = await store.getPolicy("w1");
    expect(afterDelete).toBeNull();
  });

  it("tracks daily spend per wallet and asset", async () => {
    const store = new InMemoryPolicyStore();
    const res1 = await store.recordSpend("w1", "2026-09-11", 50, "native");
    expect(res1).toEqual({ dailyTotal: 50, txCount: 1 });

    const res2 = await store.recordSpend("w1", "2026-09-11", 30, "native");
    expect(res2).toEqual({ dailyTotal: 80, txCount: 2 });

    const resUsdc = await store.recordSpend("w1", "2026-09-11", 100, "USDC:G123");
    expect(resUsdc).toEqual({ dailyTotal: 100, txCount: 1 });
  });

  it("tracks velocity within sliding time window", async () => {
    const store = new InMemoryPolicyStore();
    const now = Date.now();
    const count1 = await store.recordVelocity("w1", now, 60000);
    expect(count1).toBe(1);

    const count2 = await store.recordVelocity("w1", now + 1000, 60000);
    expect(count2).toBe(2);

    const count3 = await store.recordVelocity("w1", now + 70000, 60000);
    expect(count3).toBe(1);
  });
});

describe("RedisPolicyStore", () => {
  it("interacts with Redis client correctly", async () => {
    const mockRedis = {
      get: vi.fn().mockResolvedValue(JSON.stringify({ id: "p1", walletId: "w1", rules: [] })),
      set: vi.fn().mockResolvedValue("OK"),
      del: vi.fn().mockResolvedValue(1),
      incrbyfloat: vi.fn().mockResolvedValue("150.5"),
      incr: vi.fn().mockResolvedValue(2),
      expire: vi.fn().mockResolvedValue(1),
      zadd: vi.fn().mockResolvedValue(1),
      zremrangebyscore: vi.fn().mockResolvedValue(0),
      zcard: vi.fn().mockResolvedValue(3),
    };

    const store = new RedisPolicyStore(mockRedis as any);

    const policy = await store.getPolicy("w1");
    expect(policy?.walletId).toBe("w1");
    expect(mockRedis.get).toHaveBeenCalledWith("lumen:policy:w1");

    const spendRes = await store.recordSpend("w1", "2026-09-11", 50, "native");
    expect(spendRes).toEqual({ dailyTotal: 150.5, txCount: 2 });

    const velRes = await store.recordVelocity("w1", Date.now(), 60000);
    expect(velRes).toBe(3);
  });
});
