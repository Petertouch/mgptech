import { useState } from "react";
import { useAllInvestors } from "@/hooks/useAdminInvestors";
import { useAssignInvestor, useRemoveInvestor } from "@/hooks/useAdminProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Trash2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectInvestorWithProfile {
  id: string;
  investor_id: string;
  invested_amount: number;
  investment_date: string;
  investor: { full_name: string; email: string };
}

interface InvestorAssignerProps {
  projectId: string;
  currentInvestors: ProjectInvestorWithProfile[];
}

export default function InvestorAssigner({ projectId, currentInvestors }: InvestorAssignerProps) {
  const { data: allInvestors } = useAllInvestors();
  const assignInvestor = useAssignInvestor();
  const removeInvestor = useRemoveInvestor();
  const { toast } = useToast();
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const assignedIds = new Set(currentInvestors.map((i) => i.investor_id));
  const availableInvestors = allInvestors?.filter((i) => !assignedIds.has(i.id)) ?? [];

  const handleAssign = async () => {
    if (!selectedInvestor || !amount) return;
    setLoading(true);
    try {
      await assignInvestor.mutateAsync({
        projectId,
        investorId: selectedInvestor,
        investedAmount: parseFloat(amount),
        investmentDate: date,
      });
      toast({ title: "Inversionista asignado" });
      setSelectedInvestor("");
      setAmount("");
    } catch {
      toast({ title: "Error al asignar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeInvestor.mutateAsync({ id, projectId });
      toast({ title: "Inversionista removido" });
    } catch {
      toast({ title: "Error al remover", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Assign form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Asignar Inversionista
        </h4>
        <select
          value={selectedInvestor}
          onChange={(e) => setSelectedInvestor(e.target.value)}
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
        >
          <option value="">Seleccionar inversionista...</option>
          {availableInvestors.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.full_name} ({inv.email})
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto invertido"
            className="bg-white/5 border-white/10 text-white"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button
          onClick={handleAssign}
          disabled={!selectedInvestor || !amount || loading}
          className="bg-[#D4AF37] hover:bg-[#A88C2C]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Asignar
        </Button>
      </div>

      {/* Current investors */}
      <div className="space-y-2">
        {currentInvestors.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="bg-blue-400/10 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{inv.investor.full_name}</p>
              <p className="text-xs text-gray-500">
                ${inv.invested_amount.toLocaleString("es-CO")} · {new Date(inv.investment_date).toLocaleDateString("es-CO")}
              </p>
            </div>
            <button
              onClick={() => handleRemove(inv.id)}
              className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {currentInvestors.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">Sin inversionistas asignados</p>
        )}
      </div>
    </div>
  );
}
