import { Link } from "react-router-dom";
import type { BlogPostSummary } from "@/types/blog";

interface BlogCardProps {
  post: BlogPostSummary;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = new Date(post.published_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group card-gradient rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      <Link to={`/blog/${post.slug}`}>
        {post.cover_image && (
          <div className="relative h-52 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width="600"
              height="208"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" aria-hidden="true" />
          </div>
        )}
        <div className="p-7">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3 className="text-xl font-display text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
            <time dateTime={post.published_at}>{formattedDate}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{post.reading_time} min de lectura</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
