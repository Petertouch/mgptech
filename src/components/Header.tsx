import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, LayoutDashboard, Shield, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo.png";

const NAV_LINKS = [
  { label: "Servicios", hash: "servicios" },
  { label: "Áreas", hash: "areas" },
  { label: "Contacto", hash: "contacto" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, isInvestor, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-white/5" role="banner">
      <div className="container mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="OGF Real Estate - Ir al inicio">
          <img src={logo} alt="OGF Real Estate Group LLC - Logo" className="h-10 w-auto" width="120" height="40" />
        </Link>
        <nav className="hidden md:flex items-center gap-10" aria-label="Navegación principal">
          {NAV_LINKS.map(({ label, hash }) => (
            <a
              key={hash}
              href={`/#${hash}`}
              onClick={(e) => handleAnchorClick(e, hash)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium tracking-wide uppercase"
            >
              {label}
            </a>
          ))}
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium tracking-wide uppercase">
            Blog
          </Link>
        </nav>

        {/* Auth section */}
        {!loading && (
          user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#0047FF]/50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0047FF]/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-[#0047FF]" />
                </div>
                <span className="text-sm text-white hidden sm:inline">
                  {profile?.full_name?.split(" ")[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0a0f2c] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                  {isInvestor && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Mi Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <Shield className="h-4 w-4" /> Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 w-full"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#0047FF] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#0035cc] transition-all duration-300 hover:shadow-lg hover:shadow-[#0047FF]/25 flex items-center gap-2"
            >
              Portal Inversionistas
            </Link>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
