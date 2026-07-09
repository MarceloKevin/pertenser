import type { MetadataRoute } from "next";
import { fetchEventosRealizados } from "@/lib/events";

const siteUrl = "https://www.pertenser.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const eventos = await fetchEventosRealizados();

  const eventPages: MetadataRoute.Sitemap = eventos.map((evento) => ({
    url: `${siteUrl}/eventos/${evento.slug}`,
    lastModified: evento.data,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...eventPages,
  ];
}
