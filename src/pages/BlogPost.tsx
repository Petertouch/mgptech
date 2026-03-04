import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import BlogContent from "@/components/blog/BlogContent";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { blogPostingSchema, blogPostBreadcrumbSchema } from "@/lib/seo";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBlogPost(slug || "");

  if (!isLoading && (!post || isError)) {
    return <Navigate to="/blog" replace />;
  }

  const formattedDate = post?.published_at
    ? new Date(post.published_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-background">
      {post && (
        <BlogSEO
          title={`${post.title} | Blog OGF Real Estate`}
          description={post.meta_description}
          canonical={`https://ofgrealstate.com/blog/${post.slug}`}
          ogImage={post.cover_image || undefined}
          ogType="article"
          publishedTime={post.published_at || undefined}
          modifiedTime={post.updated_at}
          tags={post.tags}
          jsonLd={[blogPostingSchema(post), blogPostBreadcrumbSchema(post)]}
        />
      )}
      <Header />
      <main>
        <article className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="Migas de pan" className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <a href="/" className="hover:text-foreground transition-colors">Inicio</a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground truncate max-w-[200px]">
                  {post?.title}
                </li>
              </ol>
            </nav>

            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al blog
            </Link>

            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-10 w-3/4 bg-white/5 rounded" />
                <div className="h-6 w-1/3 bg-white/5 rounded" />
                <div className="h-80 w-full bg-white/5 rounded-2xl" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
              </div>
            ) : (
              post && (
                <>
                  <header className="mb-10 opacity-0 animate-fade-in-up">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-6 leading-tight">
                      {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/80">{post.author}</span>
                      <span aria-hidden="true">&middot;</span>
                      <time dateTime={post.published_at!}>{formattedDate}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.reading_time} min de lectura</span>
                    </div>
                  </header>

                  {post.cover_image && (
                    <figure className="mb-12 opacity-0 animate-fade-in-up animation-delay-200">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-auto rounded-2xl border border-white/10"
                        loading="eager"
                        width="768"
                        height="432"
                      />
                    </figure>
                  )}

                  <div className="opacity-0 animate-fade-in-up animation-delay-400">
                    <BlogContent content={post.content} />
                  </div>
                </>
              )
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
