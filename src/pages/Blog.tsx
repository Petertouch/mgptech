import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogSEO from "@/components/blog/BlogSEO";
import { useBlogPosts, useBlogPostCount } from "@/hooks/useBlogPosts";
import { blogSchema, blogBreadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");

  const { data: posts, isLoading } = useBlogPosts(page, PAGE_SIZE);
  const { data: totalCount } = useBlogPostCount();
  const totalPages = Math.ceil((totalCount || 0) / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO
        title="Blog | MGP Capital Group - Inversión Inmobiliaria"
        description="Artículos sobre inversión inmobiliaria, house flipping, construcción nueva y tendencias del mercado en Ohio, Georgia y Florida."
        canonical="https://grupomgp.com/blog"
        jsonLd={[blogSchema(), blogBreadcrumbSchema()]}
      />
      <Header />
      <main>
        <section className="py-20 sm:py-28" aria-labelledby="blog-titulo">
          <div className="container mx-auto px-4 sm:px-6">
            <BlogHeader
              title="Nuestro"
              accent="Blog"
              subtitle="Tendencias, consejos y noticias del mundo inmobiliario"
            />

            <nav aria-label="Migas de pan" className="mb-10 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <a href="/" className="hover:text-foreground transition-colors">Inicio</a>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">Blog</li>
              </ol>
            </nav>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-gradient rounded-3xl overflow-hidden border border-white/5 animate-pulse">
                    <div className="h-52 bg-white/5" />
                    <div className="p-7 space-y-3">
                      <div className="h-4 w-20 bg-white/5 rounded" />
                      <div className="h-6 w-full bg-white/5 rounded" />
                      <div className="h-4 w-full bg-white/5 rounded" />
                      <div className="h-4 w-2/3 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">
                  Próximamente publicaremos artículos sobre inversión inmobiliaria.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Paginación del blog" className="flex justify-center gap-2 mt-16">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchParams({ page: String(i + 1) })}
                    className={cn(
                      "w-11 h-11 sm:w-10 sm:h-10 rounded-full text-sm font-medium transition-all duration-300",
                      page === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                    aria-current={page === i + 1 ? "page" : undefined}
                    aria-label={`Página ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
