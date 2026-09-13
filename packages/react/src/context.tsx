import { createContext, useContext } from "react";
import type { LumenClient } from "@lumen/web-sdk";

export interface LumenContextValue {
  client: LumenClient;
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
  return (
    <LumenContext.Provider value={{ client }}>
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