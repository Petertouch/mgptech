import { DollarSign, TrendingUp, FolderOpen } from "lucide-react";
import type { ProjectWithPhases } from "@/types/project";

interface InvestmentSummaryProps {
  projects: { invested_amount: number; project: ProjectWithPhases }[];
}

export default function InvestmentSummary({ projects }: InvestmentSummaryProps) {
  const totalInvested = projects.reduce((sum, p) => sum + p.invested_amount, 0);
  const activeProjects = projects.filter((p) => p.project.status === "active").length;
  const completedProjects = projects.filter((p) => p.project.status === "completed").length;

  const cards = [
    {
      label: "Total Invertido",
      value: `$${totalInvested.toLocaleString("es-CO")}`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Proyectos Activos",
      value: activeProjects,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Proyectos Completados",
      value: completedProjects,
      icon: FolderOpen,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4"
        >
          <div className={`${card.bg} p-3 rounded-lg`}>
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
