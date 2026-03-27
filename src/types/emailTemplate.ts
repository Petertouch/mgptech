export type EmailEventKey =
  | "investor_welcome"
  | "investor_password_reset"
  | "project_assigned"
  | "project_removed"
  | "project_status_changed"
  | "project_completed"
  | "phase_started"
  | "phase_completed"
  | "phase_report_uploaded"
  | "phase_photos_added"
  | "document_uploaded"
  | "document_uploaded_private"
  | "blog_post_published"
  | "general_announcement"
  | "investment_confirmation";

export interface EmailTemplate {
  id: string;
  event_key: EmailEventKey;
  name: string;
  subject: string;
  body_html: string;
  description: string;
  is_active: boolean;
  available_variables: string[];
  created_at: string;
  updated_at: string;
}

export const EMAIL_EVENTS: Record<
  EmailEventKey,
  { label: string; description: string; variables: string[] }
> = {
  investor_welcome: {
    label: "Bienvenida Inversionista",
    description: "Se envía cuando se crea una nueva cuenta de inversionista",
    variables: ["investor_name", "investor_email", "login_url"],
  },
  investor_password_reset: {
    label: "Restablecer Contraseña",
    description: "Se envía cuando el inversionista solicita restablecer su contraseña",
    variables: ["investor_name", "reset_url"],
  },
  project_assigned: {
    label: "Asignado a Proyecto",
    description: "Se envía cuando un inversionista es asignado a un proyecto",
    variables: ["investor_name", "project_name", "project_location", "invested_amount", "investment_date", "dashboard_url"],
  },
  project_removed: {
    label: "Removido de Proyecto",
    description: "Se envía cuando un inversionista es removido de un proyecto",
    variables: ["investor_name", "project_name"],
  },
  project_status_changed: {
    label: "Cambio de Estado del Proyecto",
    description: "Se envía a los inversionistas cuando el estado del proyecto cambia",
    variables: ["investor_name", "project_name", "old_status", "new_status", "dashboard_url"],
  },
  project_completed: {
    label: "Proyecto Completado",
    description: "Se envía a los inversionistas cuando un proyecto se marca como completado",
    variables: ["investor_name", "project_name", "project_location", "sale_value", "dashboard_url"],
  },
  phase_started: {
    label: "Fase Iniciada",
    description: "Se envía cuando una fase del proyecto cambia a 'en progreso'",
    variables: ["investor_name", "project_name", "phase_name", "phase_number", "dashboard_url"],
  },
  phase_completed: {
    label: "Fase Completada",
    description: "Se envía cuando una fase del proyecto se completa",
    variables: ["investor_name", "project_name", "phase_name", "phase_number", "next_phase_name", "dashboard_url"],
  },
  phase_report_uploaded: {
    label: "Reporte de Fase Subido",
    description: "Se envía cuando se sube un reporte a una fase",
    variables: ["investor_name", "project_name", "phase_name", "report_url", "dashboard_url"],
  },
  phase_photos_added: {
    label: "Fotos de Fase Agregadas",
    description: "Se envía cuando se agregan nuevas fotos a una fase",
    variables: ["investor_name", "project_name", "phase_name", "photo_count", "dashboard_url"],
  },
  document_uploaded: {
    label: "Documento Subido (General)",
    description: "Se envía cuando se sube un documento general al proyecto",
    variables: ["investor_name", "project_name", "document_name", "document_type", "dashboard_url"],
  },
  document_uploaded_private: {
    label: "Documento Privado Subido",
    description: "Se envía cuando se sube un documento asignado a un inversionista específico",
    variables: ["investor_name", "project_name", "document_name", "document_type", "dashboard_url"],
  },
  blog_post_published: {
    label: "Nuevo Artículo del Blog",
    description: "Se envía a todos los inversionistas cuando se publica un nuevo artículo",
    variables: ["investor_name", "post_title", "post_excerpt", "post_url"],
  },
  general_announcement: {
    label: "Anuncio General",
    description: "Email manual enviado desde el admin a todos los inversionistas",
    variables: ["investor_name", "announcement_title", "announcement_body"],
  },
  investment_confirmation: {
    label: "Confirmación de Inversión",
    description: "Se envía para confirmar el monto y fecha de inversión",
    variables: ["investor_name", "project_name", "invested_amount", "investment_date", "dashboard_url"],
  },
};
