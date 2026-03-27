import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEmailTemplate, useCreateEmailTemplate, useUpdateEmailTemplate } from "@/hooks/useAdminEmailTemplates";
import EmailTemplateEditor from "@/components/admin/EmailTemplateEditor";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EmailEventKey } from "@/types/emailTemplate";
import { EMAIL_EVENTS } from "@/types/emailTemplate";

export default function AdminEmailTemplateEdit() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { data: template, isLoading } = useEmailTemplate(id!);
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const { toast } = useToast();

  if (!isNew && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  // Pre-fill event from URL param when creating new
  const prefilledEvent = searchParams.get("event") as EmailEventKey | null;
  const prefilledData = isNew && prefilledEvent && EMAIL_EVENTS[prefilledEvent]
    ? {
        event_key: prefilledEvent,
        name: EMAIL_EVENTS[prefilledEvent].label,
        description: EMAIL_EVENTS[prefilledEvent].description,
      }
    : undefined;

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (isNew) {
        await createTemplate.mutateAsync(data);
        toast({ title: "Plantilla creada" });
      } else {
        await updateTemplate.mutateAsync({ id: id!, ...data });
        toast({ title: "Plantilla actualizada" });
      }
      navigate("/admin/email-templates");
    } catch (err: unknown) {
      toast({ title: `Error: ${err instanceof Error ? err.message : "Error"}`, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/email-templates")}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isNew ? "Nueva Plantilla" : "Editar Plantilla"}
        </h1>
      </div>

      <EmailTemplateEditor
        initialData={isNew ? prefilledData : template}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
