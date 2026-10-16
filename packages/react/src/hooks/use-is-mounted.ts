import { useEffect, useState } from "react";

/**
 * Returns `true` once the component has mounted on the client.
 *
 * Always `false` during server-side rendering and the first client render,
 * which makes it safe to gate browser-only APIs (`window`, `navigator`,
 * `window.crypto`, `navigator.credentials`) behind it. Use it together with
 * a `typeof window !== "undefined"` check to avoid
 * `ReferenceError: window is not defined` during SSR hydration.
 *
 * @example
 * ```tsx
 * function PasskeyButton() {
 *   const isMounted = useIsMounted();
 *
 *   if (!isMounted) {
 *     return <button disabled>Loading…</button>;
 *   }
 *
 *   return <button onClick={register}>Register passkey</button>;
 * }
 * ```
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
