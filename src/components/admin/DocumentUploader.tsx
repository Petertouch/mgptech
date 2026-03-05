import { useState } from "react";
import { useUploadDocument, useDeleteDocument } from "@/hooks/useAdminProjects";
import { useAllInvestors } from "@/hooks/useAdminInvestors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ProjectDocument } from "@/types/project";

interface DocumentUploaderProps {
  documents: ProjectDocument[];
  projectId: string;
}

export default function DocumentUploader({ documents, projectId }: DocumentUploaderProps) {
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();
  const { data: investors } = useAllInvestors();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("contract");
  const [investorId, setInvestorId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !docName) return;
    setUploading(true);
    try {
      await uploadDoc.mutateAsync({
        projectId,
        investorId: investorId || null,
        file,
        name: docName,
        documentType: docType,
      });
      toast({ title: "Documento subido" });
      setDocName("");
      setFile(null);
      setInvestorId("");
    } catch {
      toast({ title: "Error al subir documento", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc.mutateAsync({ id: docId, projectId });
      toast({ title: "Documento eliminado" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-medium text-white">Subir Documento</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Nombre del documento"
            className="bg-white/5 border-white/10 text-white"
          />
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
          >
            <option value="contract">Contrato</option>
            <option value="legal">Legal</option>
            <option value="report">Informe</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <select
          value={investorId}
          onChange={(e) => setInvestorId(e.target.value)}
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm"
        >
          <option value="">Visible para todos los inversionistas</option>
          {investors?.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.full_name} ({inv.email})
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white">
              <Upload className="h-4 w-4" />
              {file ? file.name : "Seleccionar archivo"}
            </div>
          </label>
          <Button
            onClick={handleUpload}
            disabled={!file || !docName || uploading}
            className="bg-[#0047FF] hover:bg-[#0035cc]"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subir"}
          </Button>
        </div>
      </div>

      {/* Documents list */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{doc.name}</p>
              <p className="text-xs text-gray-500">
                {doc.document_type} · {new Date(doc.uploaded_at).toLocaleDateString("es-CO")}
                {doc.investor_id && " · Privado"}
              </p>
            </div>
            <button
              onClick={() => handleDelete(doc.id)}
              className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">Sin documentos</p>
        )}
      </div>
    </div>
  );
}
