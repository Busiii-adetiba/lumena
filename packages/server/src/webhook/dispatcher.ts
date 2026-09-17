import { createHmac, randomUUID } from "node:crypto";
import type {
  WebhookConfig,
  WebhookEventType,
  WebhookPayload,
  WebhookDeliveryResult,
} from "@lumen/types";
import { logger } from "../logger.js";

export interface WebhookDispatcherOpts {
  webhooks?: WebhookConfig[];
  timeoutMs?: number;
}

export class WebhookDispatcher {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private timeoutMs: number;

  constructor(opts: WebhookDispatcherOpts = {}) {
    this.timeoutMs = opts.timeoutMs ?? 5000;
    if (opts.webhooks) {
      for (const wh of opts.webhooks) {
        this.register(wh);
      }
    }
  }

  register(config: WebhookConfig): void {
    this.webhooks.set(config.id, {
      ...config,
      enabled: config.enabled ?? true,
    });
  }

  unregister(id: string): boolean {
    return this.webhooks.delete(id);
  }

  get(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id);
  }

  list(): WebhookConfig[] {
    return Array.from(this.webhooks.values());
  }

  generateSignature(payload: string, secret: string): string {
    const hmac = createHmac("sha256", secret);
    hmac.update(payload);
    return `sha256=${hmac.digest("hex")}`;
  }

  createPayload<T>(event: WebhookEventType, data: T): WebhookPayload<T> {
    return {
      id: randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  async dispatch<T>(event: WebhookEventType, data: T): Promise<WebhookDeliveryResult[]> {
    const matchingWebhooks = Array.from(this.webhooks.values()).filter(
      (wh) => wh.enabled !== false && (wh.events.includes(event) || wh.events.includes("*"))
    );

    if (matchingWebhooks.length === 0) {
      return [];
    }

    const payload = this.createPayload(event, data);
    const body = JSON.stringify(payload);

    const deliveryPromises = matchingWebhooks.map(async (wh) => {
      const signature = this.generateSignature(body, wh.secret);

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const res = await fetch(wh.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Lumen-Signature": signature,
            "X-Lumen-Event": event,
            "X-Lumen-Delivery": payload.id,
          },
          body,
          signal: controller.signal,
        });

        clearTimeout(timer);

        const success = res.ok;
        if (!success) {
          logger.warn({ webhookId: wh.id, status: res.status }, "Webhook delivery returned non-2xx status");
        }

        return {
          webhookId: wh.id,
          url: wh.url,
          success,
          statusCode: res.status,
          attempts: 1,
        } as WebhookDeliveryResult;
      } catch (err: any) {
        logger.error({ webhookId: wh.id, err: err.message }, "Webhook delivery failed");
        return {
          webhookId: wh.id,
          url: wh.url,
          success: false,
          attempts: 1,
          error: err.message,
        } as WebhookDeliveryResult;
      }
    });

    return Promise.all(deliveryPromises);
  }
}
