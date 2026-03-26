import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Users, FileText, QrCode, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: FolderKanban, label: "Proyectos", end: false },
  { to: "/admin/investors", icon: Users, label: "Inversionistas", end: false },
  { to: "/admin/blog", icon: FileText, label: "Blog", end: false },
  { to: "/admin/contacto", icon: QrCode, label: "Contacto QR", end: false },
];

export default function AdminSidebar() {
  const { logout, profile } = useAuth();

  return (
    <aside className="w-64 bg-[#060a1f] border-r border-white/10 flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-lg font-bold text-white">
          MGP <span className="text-[#D4AF37]">Admin</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">{profile?.full_name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Home className="h-4 w-4" /> Ver Sitio
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
