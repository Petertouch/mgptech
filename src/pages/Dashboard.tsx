import { useAuth } from "@/contexts/AuthContext";
import { useInvestorProjects } from "@/hooks/useProjects";
import InvestmentSummary from "@/components/dashboard/InvestmentSummary";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Loader2, LogOut, FolderOpen } from "lucide-react";

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const { data: investments, isLoading } = useInvestorProjects(user?.id);

  return (
    <div className="min-h-screen bg-[#0B1F3A]">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#0B1F3A]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              MGP <span className="text-[#D4AF37]">Capital Group</span>
            </h1>
            <p className="text-sm text-gray-400">Portal de Inversionistas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{profile?.full_name}</p>
              <p className="text-xs text-gray-400">{profile?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Bienvenido, {profile?.full_name?.split(" ")[0]}
          </h2>
          <p className="text-gray-400">Aquí puedes ver el estado de tus inversiones.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
          </div>
        ) : investments && investments.length > 0 ? (
          <>
            <InvestmentSummary projects={investments} />

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Mis Proyectos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map((inv) => (
                  <ProjectCard
                    key={inv.project.id}
                    project={inv.project}
                    investedAmount={inv.invested_amount}
                    investmentDate={inv.investment_date}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No tienes proyectos asignados aún.</p>
            <p className="text-sm text-gray-500 mt-1">
              Contacta al administrador para más información.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
