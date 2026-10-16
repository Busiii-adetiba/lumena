import { createContext, useContext } from "react";
import type { LumenClient } from "@lumen/web-sdk";
import { LumenI18nContext, resolveTranslations } from "./i18n/index.js";
import type { LumenLocale } from "./i18n/index.js";

export interface LumenContextValue {
  client: LumenClient;
}

export const LumenContext = createContext<LumenContextValue | null>(null);

export interface LumenProviderProps {
  client: LumenClient;
  /**
   * BCP-47 locale code used to translate all prebuilt Lumen UI components.
   * Supported values: "en" | "es" | "pt" | "fr" | "ja"
   * Defaults to "en".
   */
  locale?: LumenLocale;
  children: React.ReactNode;
}

export function LumenProvider({
  client,
  locale = "en",
  children,
}: LumenProviderProps) {
  const t = resolveTranslations(locale);

  return (
    <LumenContext.Provider value={{ client }}>
      <LumenI18nContext.Provider value={{ locale, t }}>
        {children}
      </LumenI18nContext.Provider>
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
