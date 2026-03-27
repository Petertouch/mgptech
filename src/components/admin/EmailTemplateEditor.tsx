import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Edit, Copy } from "lucide-react";
import type { EmailTemplate, EmailEventKey } from "@/types/emailTemplate";
import { EMAIL_EVENTS } from "@/types/emailTemplate";

interface Props {
  initialData?: Partial<EmailTemplate>;
  onSubmit: (data: Partial<EmailTemplate>) => Promise<void>;
}

const SAMPLE_VALUES: Record<string, string> = {
  investor_name: "Juan Pérez",
  investor_email: "juan@ejemplo.com",
  login_url: "https://grupomgp.com/login",
  reset_url: "https://grupomgp.com/reset",
  project_name: "854 Glastonbury Dr",
  project_location: "Kissimmee, Florida",
  invested_amount: "$25,000",
  investment_date: "15 de marzo, 2026",
  dashboard_url: "https://grupomgp.com/dashboard",
  old_status: "Activo",
  new_status: "Completado",
  sale_value: "$195,000",
  phase_name: "Construcción",
  phase_number: "3",
  next_phase_name: "Acabados",
  report_url: "https://grupomgp.com/report.pdf",
  photo_count: "5",
  document_name: "Contrato de inversión",
  document_type: "Contrato",
  post_title: "Guía de inversión en Ohio",
  post_excerpt: "Todo lo que necesitas saber para invertir...",
  post_url: "https://grupomgp.com/blog/guia-ohio",
  announcement_title: "Actualización importante",
  announcement_body: "Queremos informarles sobre novedades en nuestros proyectos...",
};

function renderPreview(html: string, subject: string) {
  let renderedHtml = html;
  let renderedSubject = subject;
  for (const [key, value] of Object.entries(SAMPLE_VALUES)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    renderedHtml = renderedHtml.replace(regex, `<strong style="color:#D4AF37">${value}</strong>`);
    renderedSubject = renderedSubject.replace(regex, value);
  }
  return { renderedHtml, renderedSubject };
}

export default function EmailTemplateEditor({ initialData, onSubmit }: Props) {
  const [eventKey, setEventKey] = useState<EmailEventKey | "">(initialData?.event_key ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [subject, setSubject] = useState(initialData?.subject ?? "");
  const [bodyHtml, setBodyHtml] = useState(initialData?.body_html ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedEvent = eventKey ? EMAIL_EVENTS[eventKey] : null;

  const handleEventChange = (key: string) => {
    const k = key as EmailEventKey;
    setEventKey(k);
    if (!initialData?.event_key) {
      const ev = EMAIL_EVENTS[k];
      setName(ev.label);
      setDescription(ev.description);
    }
  };

  const insertVariable = (variable: string) => {
    const tag = `{{${variable}}}`;
    setBodyHtml((prev) => prev + tag);
  };

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventKey) return;
    setLoading(true);
    try {
      await onSubmit({
        event_key: eventKey,
        name,
        subject,
        body_html: bodyHtml,
        description,
        is_active: isActive,
        available_variables: selectedEvent?.variables ?? [],
      });
    } finally {
      setLoading(false);
    }
  };

  const { renderedHtml, renderedSubject } = renderPreview(bodyHtml, subject);

  // Find already-used event keys - will be provided via context if needed
  const usedEvents = initialData?.event_key ? [initialData.event_key] : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Event selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Evento / Proceso</label>
        <select
          value={eventKey}
          onChange={(e) => handleEventChange(e.target.value)}
          disabled={!!initialData?.event_key}
          required
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm disabled:opacity-50"
        >
          <option value="">Seleccionar evento...</option>
          {(Object.keys(EMAIL_EVENTS) as EmailEventKey[]).map((key) => (
            <option key={key} value={key} disabled={usedEvents.includes(key) && key !== initialData?.event_key}>
              {EMAIL_EVENTS[key].label}
            </option>
          ))}
        </select>
        {selectedEvent && (
          <p className="text-xs text-gray-500 mt-1">{selectedEvent.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nombre de la plantilla</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ej: Bienvenida Inversionista"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Asunto del email</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ej: Bienvenido {{investor_name}} a MGP Capital Group"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción interna</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Nota interna sobre cuándo se usa esta plantilla"
        />
      </div>

      {/* Variables */}
      {selectedEvent && selectedEvent.variables.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Variables disponibles <span className="text-gray-500 font-normal">(clic para insertar, doble clic para copiar)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {selectedEvent.variables.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => insertVariable(v)}
                onDoubleClick={() => copyVariable(v)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/20"
              >
                <Copy className="h-2.5 w-2.5" />
                {`{{${v}}}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body editor */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-300">Cuerpo del email (HTML)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
          >
            {preview ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {preview ? "Editar" : "Vista previa"}
          </button>
        </div>
        {preview ? (
          <div className="bg-white rounded-lg p-6 min-h-[300px]">
            <div className="mb-4 pb-3 border-b border-gray-200">
              <p className="text-xs text-gray-500">Asunto:</p>
              <p className="text-sm font-medium text-gray-800">{renderedSubject}</p>
            </div>
            <div
              className="text-sm text-gray-700 leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-2 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        ) : (
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={15}
            className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm font-mono"
            placeholder="<h1>Bienvenido {{investor_name}}</h1>&#10;<p>Gracias por unirte a MGP Capital Group...</p>"
          />
        )}
      </div>

      {/* Active toggle + Save */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-white/20"
          />
          <label htmlFor="is_active" className="text-sm text-gray-300">Activo</label>
        </div>
        <Button type="submit" disabled={loading || !eventKey} className="bg-[#D4AF37] hover:bg-[#A88C2C]">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Guardar Plantilla
        </Button>
      </div>
    </form>
  );
}
