import { Link } from "react-router-dom";
import { useEmailTemplates, useDeleteEmailTemplate, useToggleEmailTemplate } from "@/hooks/useAdminEmailTemplates";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Loader2, Power, PowerOff, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EMAIL_EVENTS } from "@/types/emailTemplate";
import type { EmailEventKey } from "@/types/emailTemplate";

export default function AdminEmailTemplates() {
  const { data: templates, isLoading } = useEmailTemplates();
  const deleteTemplate = useDeleteEmailTemplate();
  const toggleTemplate = useToggleEmailTemplate();
  const { toast } = useToast();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la plantilla "${name}"?`)) return;
    try {
      await deleteTemplate.mutateAsync(id);
      toast({ title: "Plantilla eliminada" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      await toggleTemplate.mutateAsync({ id, is_active: !currentState });
      toast({ title: !currentState ? "Plantilla activada" : "Plantilla desactivada" });
    } catch {
      toast({ title: "Error al cambiar estado", variant: "destructive" });
    }
  };

  // Count how many events don't have templates yet
  const usedEvents = new Set(templates?.map((t) => t.event_key) ?? []);
  const totalEvents = Object.keys(EMAIL_EVENTS).length;
  const configured = usedEvents.size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Plantillas de Email</h1>
          <p className="text-gray-400 mt-1">
            {configured} de {totalEvents} eventos configurados
          </p>
        </div>
        <Link to="/admin/email-templates/new">
          <Button className="bg-[#D4AF37] hover:bg-[#A88C2C]">
            <Plus className="h-4 w-4 mr-2" /> Nueva Plantilla
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      ) : (
        <div className="space-y-3">
          {templates?.map((template) => {
            const eventInfo = EMAIL_EVENTS[template.event_key as EmailEventKey];
            return (
              <div
                key={template.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${template.is_active ? "bg-[#D4AF37]/10" : "bg-white/5"}`}>
                  <Mail className={`h-5 w-5 ${template.is_active ? "text-[#D4AF37]" : "text-gray-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{template.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-mono">
                      {template.event_key}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {template.subject}
                    </span>
                  </div>
                  {eventInfo && (
                    <p className="text-[11px] text-gray-600 mt-0.5">{eventInfo.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggle(template.id, template.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    template.is_active
                      ? "text-green-400 hover:bg-green-500/20"
                      : "text-gray-600 hover:bg-white/10"
                  }`}
                  title={template.is_active ? "Desactivar" : "Activar"}
                >
                  {template.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                </button>
                <Link
                  to={`/admin/email-templates/${template.id}`}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(template.id, template.name)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {templates?.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No hay plantillas aún.</p>
              <p className="text-gray-600 text-sm mt-1">Crea una plantilla para cada evento de la plataforma.</p>
            </div>
          )}
        </div>
      )}

      {/* Unconfigured events */}
      {templates && templates.length > 0 && configured < totalEvents && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Eventos sin plantilla</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EMAIL_EVENTS) as EmailEventKey[])
              .filter((key) => !usedEvents.has(key))
              .map((key) => (
                <Link
                  key={key}
                  to={`/admin/email-templates/new?event=${key}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors"
                >
                  + {EMAIL_EVENTS[key].label}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
