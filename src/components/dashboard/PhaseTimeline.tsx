import { useState } from "react";
import { Key, FileCheck, Hammer, Paintbrush, Home, ChevronDown, FileText, Image } from "lucide-react";
import type { PhaseWithPhotos } from "@/types/project";

const phaseIcons = [Key, FileCheck, Hammer, Paintbrush, Home];

const statusColors: Record<string, { dot: string; line: string; text: string }> = {
  completed: { dot: "bg-green-500 border-green-400", line: "bg-green-500", text: "text-green-400" },
  in_progress: { dot: "bg-[#D4AF37] border-blue-400 animate-pulse", line: "bg-[#D4AF37]", text: "text-[#D4AF37]" },
  pending: { dot: "bg-white/10 border-white/20", line: "bg-white/10", text: "text-gray-500" },
};

interface PhaseTimelineProps {
  phases: PhaseWithPhotos[];
}

export default function PhaseTimeline({ phases }: PhaseTimelineProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const sortedPhases = [...phases].sort((a, b) => a.phase_number - b.phase_number);

  return (
    <div className="space-y-0">
      {sortedPhases.map((phase, index) => {
        const Icon = phaseIcons[index] ?? Hammer;
        const colors = statusColors[phase.status] ?? statusColors.pending;
        const isExpanded = expandedPhase === phase.id;
        const isLast = index === sortedPhases.length - 1;

        return (
          <div key={phase.id} className="relative">
            {/* Connector line */}
            {!isLast && (
              <div
                className={`absolute left-5 top-12 w-0.5 h-full -translate-x-1/2 ${
                  phase.status === "completed" ? colors.line : "bg-white/10"
                }`}
              />
            )}

            {/* Phase header */}
            <button
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              className="relative z-10 flex items-center gap-4 w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${colors.dot}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${colors.text}`}>
                  Fase {phase.phase_number}: {phase.phase_name}
                </p>
                <p className="text-xs text-gray-500">
                  {phase.status === "completed" && phase.completed_at
                    ? `Completada el ${new Date(phase.completed_at).toLocaleDateString("es-CO")}`
                    : phase.status === "in_progress"
                    ? "En progreso"
                    : "Pendiente"}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="ml-14 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                {phase.notes && (
                  <p className="text-sm text-gray-300 bg-white/5 rounded-lg p-3">{phase.notes}</p>
                )}

                {phase.report_url && (
                  <a
                    href={phase.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:underline"
                  >
                    <FileText className="h-4 w-4" /> Ver reporte de fase
                  </a>
                )}

                {phase.phase_photos && phase.phase_photos.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Image className="h-3.5 w-3.5" /> {phase.phase_photos.length} fotos
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {phase.phase_photos.map((photo) => (
                        <a
                          key={photo.id}
                          href={photo.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group rounded-lg overflow-hidden aspect-video"
                        >
                          <img
                            src={photo.image_url}
                            alt={photo.caption || "Foto de fase"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {photo.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
                              <p className="text-xs text-white truncate">{photo.caption}</p>
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Sin fotos aún</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
