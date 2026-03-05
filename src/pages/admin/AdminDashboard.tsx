import { useAdminProjects } from "@/hooks/useAdminProjects";
import { useAdminInvestors } from "@/hooks/useAdminInvestors";
import { useAdminBlogPosts } from "@/hooks/useAdminBlog";
import { FolderKanban, Users, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: projects } = useAdminProjects();
  const { data: investors } = useAdminInvestors();
  const { data: posts } = useAdminBlogPosts();

  const totalInvested = projects?.reduce(
    (sum, p) =>
      sum + (p.project_investors?.reduce((s, i) => s + (i.invested_amount || 0), 0) ?? 0),
    0
  ) ?? 0;

  const cards = [
    {
      label: "Proyectos",
      value: projects?.length ?? 0,
      icon: FolderKanban,
      color: "text-blue-400 bg-blue-400/10",
      link: "/admin/projects",
    },
    {
      label: "Inversionistas",
      value: investors?.length ?? 0,
      icon: Users,
      color: "text-green-400 bg-green-400/10",
      link: "/admin/investors",
    },
    {
      label: "Artículos Blog",
      value: posts?.length ?? 0,
      icon: FileText,
      color: "text-purple-400 bg-purple-400/10",
      link: "/admin/blog",
    },
    {
      label: "Total Invertido",
      value: `$${totalInvested.toLocaleString("es-CO")}`,
      icon: TrendingUp,
      color: "text-amber-400 bg-amber-400/10",
      link: "/admin/projects",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
        <p className="text-gray-400 mt-1">Resumen general de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-[#0047FF]/50 transition-colors"
          >
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Proyectos Recientes</h2>
          <div className="space-y-2">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                to={`/admin/projects/${project.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#0047FF]/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">{project.name}</p>
                  <p className="text-xs text-gray-500">
                    {project.location} · Fase {project.current_phase}/5
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    project.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : project.status === "completed"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {project.status === "active" ? "Activo" : project.status === "completed" ? "Completado" : "Pausado"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
