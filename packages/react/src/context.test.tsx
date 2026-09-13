import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LumenProvider, useLumen } from "./context.js";
import type { LumenClient } from "@lumen/web-sdk";

describe("LumenProvider", () => {
  it("provides the Lumen client through useLumen", () => {
    const client = {} as LumenClient;

    const { result } = renderHook(() => useLumen(), {
      wrapper: ({ children }) => (
        <LumenProvider client={client}>{children}</LumenProvider>
      ),
    });

    expect(result.current.client).toBe(client);
  });

  it("throws when useLumen is used outside the provider", () => {
    expect(() => renderHook(() => useLumen())).toThrow(
      "useLumen must be used within a LumenProvider"
    );
  });
});