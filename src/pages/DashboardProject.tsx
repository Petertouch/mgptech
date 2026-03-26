import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProjectDetail, useProjectInvestment, useProjectDocuments } from "@/hooks/useProjects";
import PhaseTimeline from "@/components/dashboard/PhaseTimeline";
import DocumentList from "@/components/dashboard/DocumentList";
import { ArrowLeft, MapPin, DollarSign, Calendar, Loader2 } from "lucide-react";
import type { PhaseWithPhotos } from "@/types/project";

export default function DashboardProject() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: project, isLoading: loadingProject } = useProjectDetail(id!);
  const { data: investment } = useProjectInvestment(id!, user?.id);
  const { data: documents } = useProjectDocuments(id!, user?.id);

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <p className="text-gray-400">Proyecto no encontrado.</p>
      </div>
    );
  }

  const phases = (project.project_phases ?? []) as PhaseWithPhotos[];

  return (
    <div className="min-h-screen bg-[#0B1F3A]">
      {/* Header with cover */}
      <div className="relative">
        {project.cover_image ? (
          <div className="h-56 sm:h-72">
            <img
              src={project.cover_image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent" />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-[#D4AF37]/20 to-[#0B1F3A]" />
        )}

        <div className="absolute top-4 left-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white text-sm hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-12 space-y-8">
        {/* Project info */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
          {project.location && (
            <p className="text-gray-400 flex items-center gap-1 mb-3">
              <MapPin className="h-4 w-4" /> {project.location}
            </p>
          )}
          {project.description && (
            <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
          )}
        </div>

        {/* Investment details */}
        {investment && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-green-400/10 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Monto Invertido</p>
                <p className="text-2xl font-bold text-white">
                  ${investment.invested_amount?.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
              <div className="bg-blue-400/10 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Fecha de Inversión</p>
                <p className="text-xl font-bold text-white">
                  {new Date(investment.investment_date).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Phase Timeline */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Progreso del Proyecto</h2>
          <PhaseTimeline phases={phases} />
        </div>

        {/* Documents */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Documentos</h2>
          <DocumentList documents={documents ?? []} />
        </div>
      </main>
    </div>
  );
}
