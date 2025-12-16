import { Hammer, RotateCcw, ArrowRight } from "lucide-react";
import constructionImage from "@/assets/construction.jpg";
import flippingImage from "@/assets/flipping.jpg";

const services = [
  {
    icon: Hammer,
    title: "Construcción Nueva",
    description: "Construimos tu casa ideal desde cero. Diseños modernos, materiales de primera calidad y atención al detalle en cada proyecto.",
    image: constructionImage,
    features: ["Diseño personalizado", "Materiales premium", "Garantía de calidad"],
  },
  {
    icon: RotateCcw,
    title: "House Flipping",
    description: "Compramos propiedades con potencial, las renovamos completamente y las convertimos en hogares modernos listos para habitar o invertir.",
    image: flippingImage,
    features: ["Renovación integral", "Diseño actualizado", "Valor maximizado"],
  },
];

const Services = () => {
  return (
    <section id="servicios" className="py-24 bg-navy-light">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dos líneas de negocio enfocadas en crear valor inmobiliario
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group card-gradient rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
