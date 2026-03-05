import { useState } from "react";
import { useUpdatePhase, useUploadPhasePhoto, useDeletePhasePhoto } from "@/hooks/useAdminProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Trash2, Image, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PhaseWithPhotos } from "@/types/project";

interface PhaseManagerProps {
  phases: PhaseWithPhotos[];
  projectId: string;
}

export default function PhaseManager({ phases, projectId }: PhaseManagerProps) {
  const sortedPhases = [...phases].sort((a, b) => a.phase_number - b.phase_number);
  const updatePhase = useUpdatePhase();
  const uploadPhoto = useUploadPhasePhoto();
  const deletePhoto = useDeletePhasePhoto();
  const { toast } = useToast();
  const [uploadingPhase, setUploadingPhase] = useState<string | null>(null);

  const handleStatusChange = async (phaseId: string, status: string) => {
    try {
      await updatePhase.mutateAsync({
        id: phaseId,
        status: status as "pending" | "in_progress" | "completed",
        ...(status === "in_progress" ? { started_at: new Date().toISOString() } : {}),
        ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}),
      });
      toast({ title: "Fase actualizada" });
    } catch {
      toast({ title: "Error al actualizar fase", variant: "destructive" });
    }
  };

  const handleNotesChange = async (phaseId: string, notes: string) => {
    await updatePhase.mutateAsync({ id: phaseId, notes });
  };

  const handleReportUrl = async (phaseId: string, reportUrl: string) => {
    await updatePhase.mutateAsync({ id: phaseId, report_url: reportUrl || null });
  };

  const handlePhotoUpload = async (phaseId: string, files: FileList | null) => {
    if (!files?.length) return;
    setUploadingPhase(phaseId);
    try {
      for (const file of Array.from(files)) {
        await uploadPhoto.mutateAsync({
          phaseId,
          projectId,
          file,
          caption: "",
        });
      }
      toast({ title: "Fotos subidas" });
    } catch {
      toast({ title: "Error al subir fotos", variant: "destructive" });
    } finally {
      setUploadingPhase(null);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await deletePhoto.mutateAsync({ id: photoId, projectId });
      toast({ title: "Foto eliminada" });
    } catch {
      toast({ title: "Error al eliminar foto", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {sortedPhases.map((phase) => (
        <div
          key={phase.id}
          className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">
              Fase {phase.phase_number}: {phase.phase_name}
            </h4>
            <select
              value={phase.status}
              onChange={(e) => handleStatusChange(phase.id, e.target.value)}
              className="rounded-md bg-white/5 border border-white/10 text-white px-3 py-1.5 text-sm"
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Notas</label>
            <textarea
              defaultValue={phase.notes}
              onBlur={(e) => handleNotesChange(phase.id, e.target.value)}
              rows={2}
              className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
              placeholder="Notas de la fase..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" /> URL del reporte
            </label>
            <Input
              defaultValue={phase.report_url ?? ""}
              onBlur={(e) => handleReportUrl(phase.id, e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://... (PDF del reporte)"
            />
          </div>

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 flex items-center gap-1">
                <Image className="h-3 w-3" /> Fotos ({phase.phase_photos?.length ?? 0})
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(phase.id, e.target.files)}
                />
                <span className="inline-flex items-center gap-1 text-xs text-[#0047FF] hover:underline">
                  {uploadingPhase === phase.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  Subir fotos
                </span>
              </label>
            </div>
            {phase.phase_photos && phase.phase_photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {phase.phase_photos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || ""}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
