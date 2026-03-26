import { Link } from "react-router-dom";
import { useAdminBlogPosts, useDeleteBlogPost } from "@/hooks/useAdminBlog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlog() {
  const { data: posts, isLoading } = useAdminBlogPosts();
  const deleteBlogPost = useDeleteBlogPost();
  const { toast } = useToast();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar el artículo "${title}"?`)) return;
    try {
      await deleteBlogPost.mutateAsync(id);
      toast({ title: "Artículo eliminado" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-gray-400 mt-1">Gestiona los artículos del blog</p>
        </div>
        <Link to="/admin/blog/new">
          <Button className="bg-[#D4AF37] hover:bg-[#A88C2C]">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Artículo
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      ) : (
        <div className="space-y-3">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-purple-400">{post.title.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{post.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.created_at).toLocaleDateString("es-CO")}
                  {post.excerpt && ` · ${post.excerpt.slice(0, 60)}...`}
                </p>
              </div>
              <span className={`flex items-center gap-1 text-xs ${post.published ? "text-green-400" : "text-gray-500"}`}>
                {post.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {post.published ? "Publicado" : "Borrador"}
              </span>
              <div className="flex items-center gap-1">
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {posts?.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay artículos aún.</p>
          )}
        </div>
      )}
    </div>
  );
}
