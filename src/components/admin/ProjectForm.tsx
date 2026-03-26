import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Image } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/project";

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  submitLabel?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ initialData, onSubmit, submitLabel = "Guardar" }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.cover_image ?? "");
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      cover_image: initialData?.cover_image ?? "",
      status: initialData?.status ?? "active",
      is_public: initialData?.is_public ?? false,
      investment_type: initialData?.investment_type ?? "new_construction",
      total_value: initialData?.total_value ?? 0,
      sqft: initialData?.sqft ?? null,
      bedrooms: initialData?.bedrooms ?? null,
      bathrooms: initialData?.bathrooms ?? null,
      sale_value: initialData?.sale_value ?? null,
    },
  });

  const handleCoverUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `covers/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-photos")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("project-photos")
        .getPublicUrl(path);

      setValue("cover_image", urlData.publicUrl);
      setPreviewUrl(urlData.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      await onSubmit(data as Partial<Project>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
          <Input
            {...register("name", { required: true })}
            onChange={(e) => {
              register("name").onChange(e);
              if (!initialData?.slug) {
                setValue("slug", slugify(e.target.value));
              }
            }}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Nombre del proyecto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
          <Input
            {...register("slug", { required: true })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="slug-del-proyecto"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
          placeholder="Descripción del proyecto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Ubicación</label>
          <Input
            {...register("location")}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ciudad, País"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Imagen de portada</label>
          <input type="hidden" {...register("cover_image")} />
          {previewUrl ? (
            <div className="relative rounded-lg overflow-hidden h-32">
              <img src={previewUrl} alt="Portada" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setValue("cover_image", ""); setPreviewUrl(""); }}
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
                  if (file) handleCoverUpload(file);
                }}
              />
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500">Subir imagen</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
          <select
            {...register("status")}
            className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
          >
            <option value="active">Activo</option>
            <option value="paused">Pausado</option>
            <option value="completed">Completado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Inversión</label>
          <select
            {...register("investment_type")}
            className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
          >
            <option value="new_construction">Construcción Nueva</option>
            <option value="house_flipping">House Flipping</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Valor Total</label>
          <Input
            type="number"
            {...register("total_value", { valueAsNumber: true })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="0"
          />
        </div>
      </div>

      {watch("status") === "completed" && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Valor de Venta</label>
          <Input
            type="number"
            {...register("sale_value", { valueAsNumber: true })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ej: 430000"
          />
          <p className="text-xs text-gray-500 mt-1">Precio final de venta del proyecto completado</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Pies² (sqft)</label>
          <Input
            type="number"
            {...register("sqft", { valueAsNumber: true })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ej: 2500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cuartos</label>
          <Input
            type="number"
            {...register("bedrooms", { valueAsNumber: true })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ej: 4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Baños</label>
          <Input
            type="number"
            {...register("bathrooms", { valueAsNumber: true })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ej: 3"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_public"
          {...register("is_public")}
          className="rounded border-white/20"
        />
        <label htmlFor="is_public" className="text-sm text-gray-300">
          Proyecto público (visible en la página principal)
        </label>
      </div>

      <Button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-[#A88C2C]">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
