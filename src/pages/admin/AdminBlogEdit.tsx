import { useParams, useNavigate } from "react-router-dom";
import { useAdminBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useAdminBlog";
import BlogEditor from "@/components/admin/BlogEditor";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { data: post, isLoading } = useAdminBlogPost(id!);
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const { toast } = useToast();

  if (!isNew && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#0047FF]" />
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (isNew) {
        await createPost.mutateAsync(data);
        toast({ title: "Artículo creado" });
      } else {
        await updatePost.mutateAsync({ id: id!, ...data });
        toast({ title: "Artículo actualizado" });
      }
      navigate("/admin/blog");
    } catch (err: unknown) {
      toast({ title: `Error: ${err instanceof Error ? err.message : "Error"}`, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/blog")}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isNew ? "Nuevo Artículo" : "Editar Artículo"}
        </h1>
      </div>

      <BlogEditor initialData={isNew ? undefined : post} onSubmit={handleSubmit} />
    </div>
  );
}
