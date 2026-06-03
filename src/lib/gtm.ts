/**
 * Push a custom event to Google Tag Manager's dataLayer.
 * Safe to call even if GTM hasn't loaded yet.
 */
export function gtmEvent(event: string, params?: Record<string, string>) {
  if (typeof window !== "undefined") {
    (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer =
      (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer || [];
    (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
      event,
      ...params,
    });
  }
}
