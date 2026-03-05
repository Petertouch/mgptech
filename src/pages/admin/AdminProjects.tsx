import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminProjects, useCreateProject, useDeleteProject } from "@/hooks/useAdminProjects";
import ProjectForm from "@/components/admin/ProjectForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Settings, Loader2, MapPin, Users, Eye, EyeOff, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VisibilityFilter = "all" | "public" | "hidden";

export default function AdminProjects() {
  const { data: projects, isLoading } = useAdminProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [search, setSearch] = useState("");

  const filteredProjects = projects?.filter((p) => {
    if (visibility === "public" && !p.is_public) return false;
    if (visibility === "hidden" && p.is_public) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      await createProject.mutateAsync(data);
      toast({ title: "Proyecto creado" });
      setShowForm(false);
    } catch (err: unknown) {
      toast({ title: `Error: ${err instanceof Error ? err.message : "Error desconocido"}`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el proyecto "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: "Proyecto eliminado" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-gray-400 mt-1">Gestiona los proyectos de inversión</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#0047FF] hover:bg-[#0035cc]">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Proyecto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none focus:border-[#0047FF]/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        {([
          { key: "all" as VisibilityFilter, label: "Todos", icon: null },
          { key: "public" as VisibilityFilter, label: "Públicos", icon: Eye },
          { key: "hidden" as VisibilityFilter, label: "Ocultos", icon: EyeOff },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => setVisibility(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              visibility === f.key
                ? "bg-[#0047FF] text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {f.icon && <f.icon className="h-3 w-3" />}
            {f.label}
            {f.key === "all" && projects ? ` (${projects.length})` : ""}
            {f.key === "public" && projects ? ` (${projects.filter(p => p.is_public).length})` : ""}
            {f.key === "hidden" && projects ? ` (${projects.filter(p => !p.is_public).length})` : ""}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Crear Proyecto</h3>
          <ProjectForm onSubmit={handleCreate} submitLabel="Crear Proyecto" />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#0047FF]" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects?.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#0047FF]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-[#0047FF]">{project.name.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{project.name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  {project.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {project.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {project.project_investors?.length ?? 0} inv.
                  </span>
                  <span>Fase {project.current_phase}/5</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  project.is_public
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {project.is_public ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
                {project.is_public ? "Público" : "Oculto"}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  project.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : project.status === "completed"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {project.status === "active" ? "Activo" : project.status === "completed" ? "Completado" : "Pausado"}
              </span>
              <div className="flex items-center gap-1">
                <Link
                  to={`/admin/projects/${project.id}`}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.name)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredProjects?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {visibility === "all" ? "No hay proyectos aún. Crea el primero." : "No hay proyectos en esta categoría."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
