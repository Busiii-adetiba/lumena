/**
 * Lumen i18n context and useTranslation hook.
 *
 * Consumed internally by all prebuilt @lumen/react components.
 * Exposed publicly so host applications can read translations too.
 */

import { createContext, useContext } from "react";
import { translations } from "./translations.js";
import type { LumenLocale, LumenTranslations } from "./translations.js";

export type { LumenLocale, LumenTranslations };
export { translations };

export interface LumenI18nContextValue {
  locale: LumenLocale;
  t: LumenTranslations;
}

export const LumenI18nContext = createContext<LumenI18nContextValue>({
  locale: "en",
  t: translations["en"],
});

/**
 * Returns the active locale and its full translation dictionary.
 *
 * @example
 * const { t, locale } = useTranslation();
 * <button aria-label={t.balance.refreshLabel}>↻</button>
 */
export function useTranslation(): LumenI18nContextValue {
  return useContext(LumenI18nContext);
}

/**
 * Resolves a {@link LumenTranslations} object for the given locale,
 * falling back to English for any unrecognised locale string.
 */
export function resolveTranslations(locale: string): LumenTranslations {
  const key = locale as LumenLocale;
  return translations[key] ?? translations["en"];
}
