import { Helmet } from "react-helmet-async";

interface BlogSEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  jsonLd: object[];
}

const BlogSEO = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  tags,
  jsonLd,
}: BlogSEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content={ogType} />
    <meta property="og:image" content={ogImage || "https://grupomgp.com/og-image.png"} />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:site_name" content="MGP Capital Group LLC" />

    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
    {tags?.map((tag) => (
      <meta key={tag} property="article:tag" content={tag} />
    ))}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage || "https://grupomgp.com/og-image.png"} />

    {jsonLd.map((schema, i) => (
      <script key={i} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ))}
  </Helmet>
);

export default BlogSEO;
