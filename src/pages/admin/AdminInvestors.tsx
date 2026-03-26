import { useState } from "react";
import { useAdminInvestors, useCreateInvestor, useUpdateInvestor, useDeleteInvestor } from "@/hooks/useAdminInvestors";
import InvestorForm from "@/components/admin/InvestorForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Loader2, Mail, Phone, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminInvestors() {
  const { data: investors, isLoading } = useAdminInvestors();
  const createInvestor = useCreateInvestor();
  const updateInvestor = useUpdateInvestor();
  const deleteInvestor = useDeleteInvestor();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = async (data: { fullName: string; email: string; phone: string; password: string }) => {
    try {
      await createInvestor.mutateAsync(data);
      toast({ title: "Inversionista creado" });
      setShowForm(false);
    } catch (err: unknown) {
      toast({ title: `Error: ${err instanceof Error ? err.message : "Error"}`, variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string, data: { fullName: string; email: string; phone: string }) => {
    try {
      await updateInvestor.mutateAsync({ id, ...data });
      toast({ title: "Inversionista actualizado" });
      setEditingId(null);
    } catch {
      toast({ title: "Error al actualizar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a "${name}"? Se eliminará su cuenta y acceso.`)) return;
    try {
      await deleteInvestor.mutateAsync(id);
      toast({ title: "Inversionista eliminado" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inversionistas</h1>
          <p className="text-gray-400 mt-1">Gestiona las cuentas de inversionistas</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="bg-[#D4AF37] hover:bg-[#A88C2C]">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Inversionista
        </Button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Crear Inversionista</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <InvestorForm onSubmit={handleCreate} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      ) : (
        <div className="space-y-3">
          {investors?.map((investor) => (
            <div key={investor.id}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#D4AF37]">
                    {investor.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{investor.full_name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {investor.email}
                    </span>
                    {investor.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {investor.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingId(editingId === investor.id ? null : investor.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(investor.id, investor.full_name)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {editingId === investor.id && (
                <div className="mt-2 bg-white/5 border border-white/10 rounded-xl p-5">
                  <InvestorForm
                    initialData={investor}
                    isEdit
                    onSubmit={async (data) => handleUpdate(investor.id, data)}
                  />
                </div>
              )}
            </div>
          ))}
          {investors?.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay inversionistas registrados.</p>
          )}
        </div>
      )}
    </div>
  );
}
