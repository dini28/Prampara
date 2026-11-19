import type { MetadataRoute } from "next";
import { getAdminPathSegment } from "@/lib/admin-config";

export default function robots(): MetadataRoute.Robots {
  const desk = getAdminPathSegment();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/staff", `/${desk}`, "/api/staff"],
    },
  };
}
