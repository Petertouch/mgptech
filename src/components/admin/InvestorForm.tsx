import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface InvestorFormProps {
  initialData?: { full_name: string; email: string; phone: string };
  onSubmit: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  isEdit?: boolean;
}

export default function InvestorForm({ initialData, onSubmit, isEdit }: InvestorFormProps) {
  const [fullName, setFullName] = useState(initialData?.full_name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ fullName, email, phone, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-white/5 border-white/10 text-white"
          placeholder="Nombre completo"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isEdit}
          className="bg-white/5 border-white/10 text-white disabled:opacity-50"
          placeholder="email@ejemplo.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
          placeholder="+57 312 442 6783"
        />
      </div>
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
      )}
      <Button type="submit" disabled={loading} className="bg-[#0047FF] hover:bg-[#0035cc]">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isEdit ? "Actualizar" : "Crear Inversionista"}
      </Button>
    </form>
  );
}
