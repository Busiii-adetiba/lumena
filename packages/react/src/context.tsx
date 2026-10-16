import { createContext, useContext } from "react";
import type { LumenClient } from "@lumen/web-sdk";
import { useIsMounted } from "./hooks/use-is-mounted.js";

export interface LumenContextValue {
  client: LumenClient;
  /**
   * `true` once the provider has mounted on the client, `false` during
   * server-side rendering and hydration. Gate browser-only APIs
   * (`window.crypto`, `navigator.credentials`, …) behind this flag together
   * with `typeof window !== "undefined"` to avoid
   * `ReferenceError: window is not defined` on the server.
   */
  isMounted: boolean;
}

export const LumenContext = createContext<LumenContextValue | null>(null);

export interface LumenProviderProps {
  client: LumenClient;
  children: React.ReactNode;
}

export function LumenProvider({
  client,
  children,
}: LumenProviderProps) {
  const isMounted = useIsMounted();

  return (
    <LumenContext.Provider value={{ client, isMounted }}>
      {children}
    </LumenContext.Provider>
  );
}

export function useLumen(): LumenContextValue {
  const context = useContext(LumenContext);

  if (!context) {
    throw new Error("useLumen must be used within a LumenProvider");
  }

  return context;
}
