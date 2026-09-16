import { describe, it, expect } from "vitest";
import { ValidationError, PolicyError, StellarError } from "../errors.js";

describe("errors", () => {
  it("initializes ValidationError with defaults", () => {
    const err = new ValidationError("bad request");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("bad request");
    expect(err.name).toBe("ValidationError");
  });

  it("supports custom status code in ValidationError", () => {
    const err = new ValidationError("unauthorized", undefined, 401);
    expect(err.statusCode).toBe(401);
  });

  it("initializes PolicyError with status code", () => {
    const err = new PolicyError("forbidden", 403);
    expect(err.statusCode).toBe(403);
    expect(err.name).toBe("PolicyError");
  });

  it("initializes StellarError with status code", () => {
    const err = new StellarError("stellar node error", 502);
    expect(err.statusCode).toBe(502);
    expect(err.name).toBe("StellarError");
  });
});
