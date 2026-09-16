import { describe, it, expect } from "vitest";
import { openApiSpec } from "../openapi.js";

describe("openapi specification", () => {
  it("defines standard OpenAPI 3.0 info", () => {
    expect(openApiSpec.openapi).toBe("3.0.3");
    expect(openApiSpec.info.title).toBe("Lumen Server API");
    expect(openApiSpec.paths["/cosign"]).toBeDefined();
    expect(openApiSpec.paths["/fee-bump"]).toBeDefined();
  });
});
