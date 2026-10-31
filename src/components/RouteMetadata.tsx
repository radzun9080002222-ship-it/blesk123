import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import pages from "@/content/seo-pages.json";

type PageMetadata = { title: string; description: string; robots?: string };

export default function RouteMetadata() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const meta: PageMetadata = (pages as Record<string, PageMetadata>)[path] || {
    title: "Империя Блеска — Сочи",
    description: "Профессиональный клининг в Сочи, Адлере и Красной Поляне.",
    robots: "noindex, follow",
  };
  const url = `https://blesk123.ru${path}`;
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={meta.robots || "index, follow"} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
    </Helmet>
  );
}
