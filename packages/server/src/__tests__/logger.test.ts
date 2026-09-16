import { describe, it, expect } from "vitest";
import { logger, httpLogger } from "../logger.js";

describe("logger", () => {
  it("initializes pino logger instance", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("initializes httpLogger middleware", () => {
    expect(httpLogger).toBeDefined();
    expect(typeof httpLogger).toBe("function");
  });
});
