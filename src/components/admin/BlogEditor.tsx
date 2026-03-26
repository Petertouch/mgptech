import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Edit, Upload, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types/blog";

interface BlogEditorProps {
  initialData?: Partial<BlogPost>;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogEditor({ initialData, onSubmit }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? "");
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `blog/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("project-photos").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("project-photos").getPublicUrl(path);
      setCoverImage(urlData.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        published,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!initialData?.slug) setSlug(slugify(e.target.value));
            }}
            required
            className="bg-white/5 border-white/10 text-white"
            placeholder="Título del artículo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white"
            placeholder="titulo-del-articulo"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Extracto</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
          placeholder="Breve descripción del artículo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Imagen de portada</label>
        {coverImage ? (
          <div className="relative rounded-lg overflow-hidden h-40">
            <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:border-[#D4AF37]/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-500 mb-1" />
                <span className="text-xs text-gray-500">Subir imagen de portada</span>
              </>
            )}
          </label>
        )}
      </div>

      {/* Content editor with preview toggle */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-300">Contenido (Markdown)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
          >
            {preview ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {preview ? "Editar" : "Vista previa"}
          </button>
        </div>
        {preview ? (
          <div className="prose prose-invert max-w-none bg-white/5 border border-white/10 rounded-md p-4 min-h-[300px]">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm font-mono"
            placeholder="Escribe el contenido en Markdown..."
          />
        )}
      </div>

      {/* SEO fields */}
      <details className="group">
        <summary className="text-sm font-medium text-gray-400 cursor-pointer hover:text-white">
          SEO (opcional)
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Meta Title</label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Título para motores de búsqueda"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
              placeholder="Descripción para motores de búsqueda"
            />
          </div>
        </div>
      </details>

      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-white/20"
          />
          <label htmlFor="published" className="text-sm text-gray-300">
            Publicado
          </label>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-[#A88C2C]">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Guardar
        </Button>
      </div>
    </form>
  );
}
