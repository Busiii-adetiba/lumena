import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useIsMounted } from "./use-is-mounted.js";

describe("useIsMounted", () => {
  it("returns false on the first render (SSR-safe), then true after mount", () => {
    const seen: boolean[] = [];

    const { result } = renderHook(() => {
      const isMounted = useIsMounted();
      seen.push(isMounted);
      return isMounted;
    });

    // First render happens before the mount effect fires.
    expect(seen[0]).toBe(false);
    // After effects flush, the hook reports mounted.
    expect(result.current).toBe(true);
    expect(seen[seen.length - 1]).toBe(true);
  });
});
