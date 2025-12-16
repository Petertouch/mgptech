import { Phone, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-home.jpg";
import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Casa moderna de lujo" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-3xl">
          {/* Logo */}
          <div className="mb-8 opacity-0 animate-fade-in-up">
            <img src={logo} alt="OGF Real Estate" className="h-24 md:h-32 w-auto" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-in-up animation-delay-200">
            Transformamos casas con historia en{" "}
            <span className="text-gradient">inversiones con futuro</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl opacity-0 animate-fade-in-up animation-delay-400">
            Construimos hogares desde cero y renovamos propiedades con potencial en Ohio, Georgia y Florida. 
            Tu próxima inversión comienza aquí.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up animation-delay-600">
            <Button variant="cta" size="xl" asChild>
              <a href="tel:+1234567890" className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                Llámanos Ahora
              </a>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <a href="#servicios" className="flex items-center gap-3">
                <Building2 className="w-5 h-5" />
                Ver Servicios
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground opacity-0 animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Ohio • Georgia • Florida</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Construcción & Flipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
