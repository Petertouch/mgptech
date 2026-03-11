import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";
import { Save, QrCode, User, Building2, Phone, Mail, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useContactInfo,
  useSaveContactInfo,
  buildVCard,
  type ContactInfo,
} from "@/hooks/useContactInfo";

export default function AdminContacto() {
  const { data: contact, isLoading } = useContactInfo();
  const saveMutation = useSaveContactInfo();
  const { toast } = useToast();

  const { register, handleSubmit, reset, watch } = useForm<ContactInfo>();
  const watched = watch();

  useEffect(() => {
    if (contact) reset(contact);
  }, [contact, reset]);

  const onSubmit = (data: ContactInfo) => {
    saveMutation.mutate(data, {
      onSuccess: () =>
        toast({ title: "Guardado", description: "Datos de contacto actualizados." }),
      onError: (err: Error & { message?: string; code?: string; details?: string }) => {
        console.error("Save contact error:", err);
        toast({ title: "Error", description: err?.message || "No se pudo guardar.", variant: "destructive" });
      },
    });
  };

  const vcard = buildVCard({
    ...watched,
    full_name: watched.full_name || "",
    company: watched.company || "",
    title: watched.title || "",
    phone: watched.phone || "",
    email: watched.email || "",
    website: watched.website || "",
    address: watched.address || "",
    city: watched.city || "",
    state: watched.state || "",
    zip: watched.zip || "",
    country: watched.country || "",
    whatsapp: watched.whatsapp || "",
    instagram: watched.instagram || "",
    facebook: watched.facebook || "",
    linkedin: watched.linkedin || "",
    photo_url: watched.photo_url || "",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0047FF]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <QrCode className="h-6 w-6 text-[#0047FF]" />
        <h1 className="text-2xl font-bold text-white">Contacto QR</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          {/* Personal */}
          <fieldset className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/10">
            <legend className="flex items-center gap-2 text-white font-semibold px-2">
              <User className="h-4 w-4 text-[#0047FF]" /> Información Personal
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Nombre completo *</Label>
                <Input {...register("full_name")} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400">Cargo / Título</Label>
                <Input {...register("title")} className="bg-white/5 border-white/10 text-white" placeholder="CEO, Director, etc." />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400 flex items-center gap-1"><Building2 className="h-3 w-3" /> Empresa</Label>
                <Input {...register("company")} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400">URL Foto (opcional)</Label>
                <Input {...register("photo_url")} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
              </div>
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/10">
            <legend className="flex items-center gap-2 text-white font-semibold px-2">
              <Phone className="h-4 w-4 text-[#0047FF]" /> Contacto
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400 flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono *</Label>
                <Input {...register("phone")} className="bg-white/5 border-white/10 text-white" placeholder="+1 555 123 4567" />
              </div>
              <div>
                <Label className="text-gray-400">WhatsApp</Label>
                <Input {...register("whatsapp")} className="bg-white/5 border-white/10 text-white" placeholder="+1 555 123 4567" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</Label>
                <Input {...register("email")} type="email" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400 flex items-center gap-1"><Globe className="h-3 w-3" /> Sitio Web</Label>
                <Input {...register("website")} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
              </div>
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/10">
            <legend className="flex items-center gap-2 text-white font-semibold px-2">
              <MapPin className="h-4 w-4 text-[#0047FF]" /> Dirección
            </legend>
            <div>
              <Label className="text-gray-400">Dirección</Label>
              <Input {...register("address")} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label className="text-gray-400">Ciudad</Label>
                <Input {...register("city")} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400">Estado</Label>
                <Input {...register("state")} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400">Código Postal</Label>
                <Input {...register("zip")} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400">País</Label>
                <Input {...register("country")} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          </fieldset>

          {/* Social */}
          <fieldset className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/10">
            <legend className="flex items-center gap-2 text-white font-semibold px-2">
              <Globe className="h-4 w-4 text-[#0047FF]" /> Redes Sociales
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-400">Instagram</Label>
                <Input {...register("instagram")} className="bg-white/5 border-white/10 text-white" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <Label className="text-gray-400">Facebook</Label>
                <Input {...register("facebook")} className="bg-white/5 border-white/10 text-white" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <Label className="text-gray-400">LinkedIn</Label>
                <Input {...register("linkedin")} className="bg-white/5 border-white/10 text-white" placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
          </fieldset>

          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-[#0047FF] hover:bg-[#0035cc] text-white px-8 py-3"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Guardando..." : "Guardar Contacto"}
          </Button>
        </form>

        {/* QR Preview */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <h3 className="text-white font-semibold mb-4">Vista previa del QR</h3>
            <div className="bg-white rounded-xl p-4 inline-block">
              <QRCodeSVG
                value={vcard}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-gray-400 text-xs mt-4">
              Este QR se mostrará en <span className="text-[#0047FF]">/contacto</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Al escanearlo, el celular creará un contacto con estos datos.
            </p>
          </div>

          {/* Preview Card */}
          {watched.full_name && (
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-2">
              <h3 className="text-white font-semibold text-sm">Vista previa del contacto</h3>
              <p className="text-white font-medium">{watched.full_name}</p>
              {watched.title && <p className="text-gray-400 text-sm">{watched.title}</p>}
              {watched.company && <p className="text-gray-400 text-sm">{watched.company}</p>}
              {watched.phone && <p className="text-gray-400 text-sm">{watched.phone}</p>}
              {watched.email && <p className="text-gray-400 text-sm">{watched.email}</p>}
              {watched.website && <p className="text-[#0047FF] text-sm">{watched.website}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
