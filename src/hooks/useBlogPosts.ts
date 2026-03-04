import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

export function useBlogPosts(page: number = 1, pageSize: number = 9) {
  return useQuery<BlogPostSummary[]>({
    queryKey: ["blog-posts", page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, author, published_at, tags, reading_time")
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data as BlogPostSummary[];
    },
  });
}

export function useBlogPostCount() {
  return useQuery<number>({
    queryKey: ["blog-posts-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString());

      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost | null>({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return data as BlogPost;
    },
    enabled: !!slug,
  });
}
