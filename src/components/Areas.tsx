import { MapPin } from "lucide-react";

const areas = [
  {
    state: "Georgia",
    description: "Atlanta, Savannah, Augusta y comunidades cercanas",
  },
  {
    state: "Ohio",
    description: "Cleveland, Columbus, Cincinnati y áreas metropolitanas",
  },
  {
    state: "Florida",
    description: "Miami, Tampa, Orlando, Jacksonville y costa atlántica",
  },
];

const Areas = () => {
  return (
    <section id="areas" className="py-28 bg-background" aria-labelledby="areas-titulo">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 id="areas-titulo" className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-5">
            Áreas de <span className="text-primary italic">Operación</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Operamos en tres estados estratégicos con alto potencial de inversión inmobiliaria
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto" role="list">
          {areas.map((area) => (
            <article
              key={area.state}
              role="listitem"
              className="group relative p-10 rounded-3xl card-gradient border border-white/5 hover:border-primary/30 transition-all duration-500 text-center hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-7 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300" aria-hidden="true">
                <MapPin className="w-6 h-6 text-primary" />
              </div>

              {/* State Name */}
              <h3 className="text-2xl font-display text-foreground mb-3">
                {area.state}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {area.description}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Areas;
