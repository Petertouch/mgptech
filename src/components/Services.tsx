import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "House Flipping",
    description: "Compramos propiedades con potencial, las renovamos completamente y las convertimos en hogares modernos listos para habitar o invertir.",
    image: "/flipping.png",
    features: ["Renovación integral", "Diseño actualizado", "Valor maximizado"],
  },
  {
    title: "Construcción Nueva",
    description: "Construimos tu casa ideal desde cero. Diseños modernos, materiales de primera calidad y atención al detalle en cada proyecto.",
    image: "/construction.png",
    features: ["Diseño personalizado", "Materiales premium", "Garantía de calidad"],
  },
];

const Services = () => {
  return (
    <section id="servicios" className="py-28 bg-navy-light">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-5">
            Nuestros <span className="text-primary italic">Servicios</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Dos líneas de negocio enfocadas en crear valor inmobiliario
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="group card-gradient rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-display text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-7">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
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
