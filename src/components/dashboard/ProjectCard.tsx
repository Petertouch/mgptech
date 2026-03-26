import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import type { ProjectWithPhases } from "@/types/project";

interface ProjectCardProps {
  project: ProjectWithPhases;
  investedAmount: number;
  investmentDate: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "Activo", color: "bg-green-500/20 text-green-400" },
  completed: { label: "Completado", color: "bg-blue-500/20 text-blue-400" },
  paused: { label: "Pausado", color: "bg-amber-500/20 text-amber-400" },
};

export default function ProjectCard({ project, investedAmount, investmentDate }: ProjectCardProps) {
  const completedPhases = project.project_phases?.filter((p) => p.status === "completed").length ?? 0;
  const status = statusLabels[project.status] ?? statusLabels.active;

  return (
    <Link
      to={`/dashboard/project/${project.id}`}
      className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        {project.cover_image ? (
          <img
            src={project.cover_image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/20 to-[#0B1F3A] flex items-center justify-center">
            <span className="text-4xl font-bold text-white/20">{project.name.charAt(0)}</span>
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
          {project.name}
        </h3>

        {project.location && (
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {project.location}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(investmentDate).toLocaleDateString("es-CO", { year: "numeric", month: "short" })}
          </span>
          <span className="text-white font-semibold">
            ${investedAmount.toLocaleString("es-CO")}
          </span>
        </div>

        {/* Phase progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Fase {project.current_phase} de 5</span>
            <span>{completedPhases}/5 completadas</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
              const phase = project.project_phases?.find((p) => p.phase_number === n);
              let bg = "bg-white/10";
              if (phase?.status === "completed") bg = "bg-green-500";
              else if (phase?.status === "in_progress") bg = "bg-[#D4AF37] animate-pulse";
              return <div key={n} className={`h-1.5 flex-1 rounded-full ${bg}`} />;
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
