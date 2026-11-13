export function siteMetadata(raw) {
  if (!raw) return null;
  const site = new URL(raw);
  if (
    site.protocol !== "https:" ||
    site.username ||
    site.password ||
    site.port ||
    site.pathname !== "/" ||
    site.search ||
    site.hash ||
    !site.hostname.includes(".") ||
    /^(?:localhost|127\.|0\.|\[)/.test(site.hostname)
  ) {
    throw new Error(
      "HOLOCAD_SITE_URL must be the public HTTPS origin without a path, credentials, query or port.",
    );
  }
  return {
    origin: site.origin,
    head: `<link rel="canonical" href="${site.origin}/" />\n<meta property="og:url" content="${site.origin}/" />\n<meta name="twitter:image" content="${site.origin}/og-image.png" />`,
    robots: `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.origin}/</loc></url></urlset>\n`,
  };
}
