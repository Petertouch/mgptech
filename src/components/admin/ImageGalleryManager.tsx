import { useState } from "react";
import { useUploadProjectImage, useDeleteProjectImage } from "@/hooks/useAdminProjects";
import { Loader2, Upload, Trash2, Images } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ProjectImage } from "@/types/project";

interface ImageGalleryManagerProps {
  images: ProjectImage[];
  projectId: string;
}

export default function ImageGalleryManager({ images, projectId }: ImageGalleryManagerProps) {
  const uploadImage = useUploadProjectImage();
  const deleteImage = useDeleteProjectImage();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadImage.mutateAsync({
          projectId,
          file: files[i],
          sortOrder: images.length + i,
        });
      }
      toast({ title: `${files.length} imagen(es) subida(s)` });
    } catch {
      toast({ title: "Error al subir imágenes", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage.mutateAsync({ id: imageId, projectId });
      toast({ title: "Imagen eliminada" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <Images className="h-4 w-4" /> Galería del Proyecto ({images.length} fotos)
        </h4>
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0047FF] hover:bg-[#0035cc] text-white text-sm font-medium transition-colors cursor-pointer">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Subir Fotos
          </span>
        </label>
      </div>

      {sortedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {sortedImages.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-video">
              <img
                src={img.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-xl">
          <Images className="h-10 w-10 text-gray-600 mb-2" />
          <p className="text-sm text-gray-500">Sin fotos. Sube imágenes para la galería del proyecto.</p>
        </div>
      )}
    </div>
  );
}
