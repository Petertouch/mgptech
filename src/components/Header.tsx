import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="OGF Real Estate Group LLC" className="h-12 w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Servicios
          </a>
          <a href="#areas" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Áreas
          </a>
          <a href="#contacto" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Contacto
          </a>
        </nav>
        <a 
          href="tel:+1234567890" 
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
        >
          Llámanos
        </a>
      </div>
    </header>
  );
};

export default Header;
