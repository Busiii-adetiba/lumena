import type { Policy, PolicyStore } from "@lumen/types";

export class InMemoryPolicyStore implements PolicyStore {
  private policies: Map<string, Policy> = new Map();
  private spendTracking: Map<
    string,
    Map<string, { dailyTotal: number; txCount: number }>
  > = new Map();
  private velocityTracking: Map<string, number[]> = new Map();

  async getPolicy(walletId: string): Promise<Policy | null> {
    return this.policies.get(walletId) ?? null;
  }

  async savePolicy(policy: Policy): Promise<void> {
    this.policies.set(policy.walletId, policy);
  }

  async deletePolicy(walletId: string): Promise<void> {
    this.policies.delete(walletId);
    this.spendTracking.delete(walletId);
    this.velocityTracking.delete(walletId);
  }

  async recordSpend(
    walletId: string,
    date: string,
    amount: number,
    asset: string = "native"
  ): Promise<{ dailyTotal: number; txCount: number }> {
    if (!this.spendTracking.has(walletId)) {
      this.spendTracking.set(walletId, new Map());
    }
    const walletTrack = this.spendTracking.get(walletId)!;
    const trackKey = `${date}:${asset}`;

    if (!walletTrack.has(trackKey)) {
      walletTrack.set(trackKey, { dailyTotal: 0, txCount: 0 });
    }
    const track = walletTrack.get(trackKey)!;
    track.dailyTotal += amount;
    track.txCount += 1;

    return { dailyTotal: track.dailyTotal, txCount: track.txCount };
  }

  async recordVelocity(
    walletId: string,
    timestamp: number,
    windowMs: number
  ): Promise<number> {
    if (!this.velocityTracking.has(walletId)) {
      this.velocityTracking.set(walletId, []);
    }
    const txTimes = this.velocityTracking.get(walletId)!;
    const cutoff = timestamp - windowMs;
    const recentTxs = txTimes.filter((t) => t > cutoff);
    recentTxs.push(timestamp);
    this.velocityTracking.set(walletId, recentTxs);

    return recentTxs.length;
  }
}

export interface RedisClientInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<any>;
  del(key: string): Promise<any>;
  incrbyfloat(key: string, increment: number | string): Promise<string>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zremrangebyscore(key: string, min: string | number, max: string | number): Promise<number>;
  zcard(key: string): Promise<number>;
}

export class RedisPolicyStore implements PolicyStore {
  private redis: RedisClientInterface;
  private keyPrefix: string;

  constructor(redisClient: RedisClientInterface, keyPrefix: string = "lumen:") {
    this.redis = redisClient;
    this.keyPrefix = keyPrefix;
  }

  async getPolicy(walletId: string): Promise<Policy | null> {
    const raw = await this.redis.get(`${this.keyPrefix}policy:${walletId}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.createdAt) {
        parsed.createdAt = new Date(parsed.createdAt);
      }
      return parsed as Policy;
    } catch {
      return null;
    }
  }

  async savePolicy(policy: Policy): Promise<void> {
    const key = `${this.keyPrefix}policy:${policy.walletId}`;
    await this.redis.set(key, JSON.stringify(policy));
  }

  async deletePolicy(walletId: string): Promise<void> {
    const key = `${this.keyPrefix}policy:${walletId}`;
    await this.redis.del(key);
  }

  async recordSpend(
    walletId: string,
    date: string,
    amount: number,
    asset: string = "native"
  ): Promise<{ dailyTotal: number; txCount: number }> {
    const totalKey = `${this.keyPrefix}spend:${walletId}:${asset}:${date}:total`;
    const countKey = `${this.keyPrefix}spend:${walletId}:${asset}:${date}:count`;

    const newTotalStr = await this.redis.incrbyfloat(totalKey, amount);
    const newCount = await this.redis.incr(countKey);

    // Set 48 hour TTL for daily spend keys
    const ttlSeconds = 172800;
    await this.redis.expire(totalKey, ttlSeconds);
    await this.redis.expire(countKey, ttlSeconds);

    return {
      dailyTotal: parseFloat(newTotalStr || "0"),
      txCount: newCount,
    };
  }

  async recordVelocity(
    walletId: string,
    timestamp: number,
    windowMs: number
  ): Promise<number> {
    const key = `${this.keyPrefix}velocity:${walletId}`;
    const cutoff = timestamp - windowMs;
    const member = `${timestamp}-${Math.random().toString(36).substring(2, 9)}`;

    await this.redis.zadd(key, timestamp, member);
    await this.redis.zremrangebyscore(key, "-inf", cutoff);

    const count = await this.redis.zcard(key);

    const ttlSeconds = Math.max(Math.ceil(windowMs / 1000) * 2, 3600);
    await this.redis.expire(key, ttlSeconds);

    return count;
  }
}
