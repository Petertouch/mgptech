import type { BlogPost } from "@/types/blog";

const SITE_URL = "https://grupomgp.com";
const SITE_NAME = "MGP Capital Group LLC";

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description,
    image: post.cover_image || `${SITE_URL}/og-image.png`,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    inLanguage: "es",
    wordCount: post.content.split(/\s+/).length,
    keywords: post.tags.join(", "),
  };
}

export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog - ${SITE_NAME}`,
    description:
      "Artículos sobre inversión inmobiliaria, house flipping y construcción nueva en Ohio, Georgia y Florida.",
    url: `${SITE_URL}/blog`,
    inLanguage: "es",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
}

export function blogBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };
}

export function blogPostBreadcrumbSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };
}
