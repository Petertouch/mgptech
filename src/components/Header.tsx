import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, LayoutDashboard, Shield, User, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logoIcon from "@/assets/logo-icon.png";

const NAV_LINKS = [
  { label: "Proyectos", to: "/#proyectos" },
  { label: "Servicios", to: "/servicios" },
  { label: "Contacto", to: "/contacto" },
];

const Header = ({ hidden = false }: { hidden?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, isInvestor, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, to: string) => {
    setMobileMenuOpen(false);
    if (to.startsWith("/#")) {
      e.preventDefault();
      const hash = to.slice(2);
      if (location.pathname === "/") {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  return (
    <header style={mobileMenuOpen ? { backgroundColor: "#030712" } : undefined} className={`fixed top-0 left-0 right-0 z-50 ${mobileMenuOpen ? "" : "bg-background/70 backdrop-blur-xl"} border-b border-white/5 transition-all duration-300 ${hidden ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"}`} role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" aria-label="OGF Real Estate - Ir al inicio">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden flex-shrink-0">
            <img src={logoIcon} alt="OGF Real Estate Group LLC" className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <span className="text-white font-bold text-sm sm:text-base tracking-wide">OGF REAL ESTATE</span>
            <span className="block text-[9px] sm:text-[10px] text-gray-400 tracking-widest uppercase">Group LLC</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={(e) => handleNavClick(e, to)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium tracking-wide uppercase"
            >
              {label}
            </Link>
          ))}
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium tracking-wide uppercase">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
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
                className="hidden sm:flex bg-[#0047FF] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#0035cc] transition-all duration-300 hover:shadow-lg hover:shadow-[#0047FF]/25 items-center gap-2"
              >
                Portal Inversionistas
              </Link>
            )
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40" style={{ backgroundColor: "#030712" }}>
          <nav className="flex flex-col px-6 py-8 space-y-1" aria-label="Navegación móvil">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={(e) => handleNavClick(e, to)}
                className="text-lg text-gray-300 hover:text-white py-3.5 border-b border-white/5 font-medium transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg text-gray-300 hover:text-white py-3.5 border-b border-white/5 font-medium transition-colors"
            >
              Blog
            </Link>

            {!loading && !user && (
              <div className="pt-6">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#0047FF] text-white w-full py-3.5 rounded-xl font-medium text-base hover:bg-[#0035cc] transition-colors"
                >
                  Portal Inversionistas
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
