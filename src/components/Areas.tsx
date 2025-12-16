import { MapPin } from "lucide-react";

const areas = [
  {
    state: "Ohio",
    description: "Cleveland, Columbus, Cincinnati y áreas metropolitanas",
    color: "from-primary to-electric-blue-glow",
  },
  {
    state: "Georgia",
    description: "Atlanta, Savannah, Augusta y comunidades cercanas",
    color: "from-electric-blue-glow to-primary",
  },
  {
    state: "Florida",
    description: "Miami, Tampa, Orlando, Jacksonville y costa atlántica",
    color: "from-primary to-electric-blue-glow",
  },
];

const Areas = () => {
  return (
    <section id="areas" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Áreas de <span className="text-gradient">Operación</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Operamos en tres estados estratégicos con alto potencial de inversión inmobiliaria
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {areas.map((area, index) => (
            <div
              key={area.state}
              className="group relative p-8 rounded-2xl card-gradient border border-border/50 hover:border-primary/50 transition-all duration-500 text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-8 h-8 text-primary" />
              </div>

              {/* State Name */}
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                {area.state}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>

              {/* Gradient Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${area.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Areas;
