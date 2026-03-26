import { useParams, useNavigate } from "react-router-dom";
import { useAdminProjectDetail, useUpdateProject } from "@/hooks/useAdminProjects";
import ProjectForm from "@/components/admin/ProjectForm";
import PhaseManager from "@/components/admin/PhaseManager";
import DocumentUploader from "@/components/admin/DocumentUploader";
import InvestorAssigner from "@/components/admin/InvestorAssigner";
import ImageGalleryManager from "@/components/admin/ImageGalleryManager";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const tabs = [
  { id: "general", label: "General" },
  { id: "gallery", label: "Galería" },
  { id: "phases", label: "Fases" },
  { id: "investors", label: "Inversionistas" },
  { id: "documents", label: "Documentos" },
];

export default function AdminProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useAdminProjectDetail(id!);
  const updateProject = useUpdateProject();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!project) {
    return <p className="text-gray-400 text-center py-20">Proyecto no encontrado.</p>;
  }

  const handleUpdate = async (data: Record<string, unknown>) => {
    try {
      await updateProject.mutateAsync({ id: id!, ...data });
      toast({ title: "Proyecto actualizado" });
    } catch {
      toast({ title: "Error al actualizar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/projects")}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400 text-sm">Editar proyecto</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-[#D4AF37] border-[#D4AF37]"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "general" && (
        <ProjectForm initialData={project} onSubmit={handleUpdate} submitLabel="Actualizar" />
      )}

      {activeTab === "gallery" && (
        <ImageGalleryManager images={(project as any).project_images ?? []} projectId={id!} />
      )}

      {activeTab === "phases" && (
        <PhaseManager phases={project.project_phases ?? []} projectId={id!} />
      )}

      {activeTab === "investors" && (
        <InvestorAssigner
          projectId={id!}
          currentInvestors={project.project_investors as any ?? []}
        />
      )}

      {activeTab === "documents" && (
        <DocumentUploader documents={project.project_documents ?? []} projectId={id!} />
      )}
    </div>
  );
}
