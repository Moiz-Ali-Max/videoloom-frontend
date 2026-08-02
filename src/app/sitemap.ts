import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = ["", "/pricing", "/about", "/privacy", "/terms", "/login", "/signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));
}
