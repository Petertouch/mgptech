import { FileText, Download, File, Scale, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProjectDocument } from "@/types/project";

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  contract: { icon: FileText, label: "Contrato", color: "text-blue-400 bg-blue-400/10" },
  legal: { icon: Scale, label: "Legal", color: "text-purple-400 bg-purple-400/10" },
  report: { icon: BarChart3, label: "Informe", color: "text-green-400 bg-green-400/10" },
  other: { icon: File, label: "Otro", color: "text-gray-400 bg-gray-400/10" },
};

interface DocumentListProps {
  documents: ProjectDocument[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const handleDownload = async (doc: ProjectDocument) => {
    const { data } = await supabase.storage
      .from("project-documents")
      .createSignedUrl(doc.document_url, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay documentos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => {
        const config = typeConfig[doc.document_type] ?? typeConfig.other;
        const Icon = config.icon;

        return (
          <button
            key={doc.id}
            onClick={() => handleDownload(doc)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#0047FF]/50 transition-colors text-left group"
          >
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{doc.name}</p>
              <p className="text-xs text-gray-500">
                {config.label} · {new Date(doc.uploaded_at).toLocaleDateString("es-CO")}
              </p>
            </div>
            <Download className="h-4 w-4 text-gray-500 group-hover:text-[#0047FF] transition-colors" />
          </button>
        );
      })}
    </div>
  );
}
