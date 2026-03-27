import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/blog";
import { sendToAllInvestors } from "@/lib/email";

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function useAdminBlogPost(id: string) {
  return useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id && id !== "new",
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: Partial<BlogPost>) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select()
        .single();
      if (error) throw error;

      // Notify all investors if published
      if (post.is_published) {
        sendToAllInvestors("blog_post_published", {
          post_title: data.title,
          post_excerpt: data.excerpt || "",
          post_url: `https://grupomgp.com/blog/${data.slug}`,
        });
      }

      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog-posts"] }),
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      // Check if going from unpublished to published
      const { data: old } = await supabase.from("blog_posts").select("is_published").eq("id", id).single();

      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      // Notify if newly published
      if (updates.is_published && !old?.is_published) {
        sendToAllInvestors("blog_post_published", {
          post_title: data.title,
          post_excerpt: data.excerpt || "",
          post_url: `https://grupomgp.com/blog/${data.slug}`,
        });
      }

      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["admin-blog-post", vars.id] });
    },
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog-posts"] }),
  });
}
