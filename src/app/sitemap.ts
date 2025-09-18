import type { MetadataRoute } from "next";

type ChangeFrequency = "weekly" | "yearly";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://acl-hobby-works.vercel.app";
  const lastmod = new Date().toISOString();

  const routes = ["", "/gallery", "/quote", "/shop"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: lastmod,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: p === "" ? 1 : 0.6,
  }));

  // Add legal pages if present
  routes.push(
    { url: `${base}/legal/terms`, lastModified: lastmod, changeFrequency: "yearly" as ChangeFrequency, priority: 0.3 },
    { url: `${base}/legal/privacy`, lastModified: lastmod, changeFrequency: "yearly" as ChangeFrequency, priority: 0.3 },
  );

  return routes;
}
