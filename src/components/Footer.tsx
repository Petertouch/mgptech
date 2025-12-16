import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="OGF Real Estate" className="h-12 w-auto" />
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} OGF Real Estate Group LLC. Todos los derechos reservados.
          </p>

          {/* States */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Ohio</span>
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span>Georgia</span>
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span>Florida</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
