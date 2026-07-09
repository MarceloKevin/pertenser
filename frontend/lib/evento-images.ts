export function normalizeEventoImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("/uploads/eventos/")) {
    return url.replace("/uploads/eventos/", "/eventos/");
  }
  return url;
}

export function isLocalEventoImage(url: string): boolean {
  return url.startsWith("/eventos/");
}
