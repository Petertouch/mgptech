import { Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section id="contacto" className="py-24 bg-navy-light relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            ¿Listo para tu próxima{" "}
            <span className="text-gradient">inversión inmobiliaria?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Contáctanos hoy y descubre cómo podemos ayudarte a construir o encontrar la propiedad perfecta.
          </p>

          {/* Main CTA */}
          <div className="mb-12">
            <Button variant="cta" size="xl" asChild className="text-xl">
              <a href="tel:+1234567890" className="flex items-center gap-3">
                <Phone className="w-6 h-6" />
                (123) 456-7890
              </a>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>info@ogfrealestate.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Lun - Vie: 9AM - 6PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
