import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Areas = () => {
  const { t } = useLanguage();

  const areas = [
    { state: "Georgia", description: t.areas.georgia },
    { state: "Ohio", description: t.areas.ohio },
    { state: "Florida", description: t.areas.florida },
  ];

  return (
    <section id="areas" className="py-16 sm:py-28 bg-background" aria-labelledby="areas-titulo">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-20">
          <h2 id="areas-titulo" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-4 sm:mb-5">
            {t.areas.title} <span className="text-primary italic">{t.areas.titleAccent}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t.areas.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto" role="list">
          {areas.map((area) => (
            <article
              key={area.state}
              role="listitem"
              className="group relative p-6 sm:p-10 rounded-2xl sm:rounded-3xl card-gradient border border-white/5 hover:border-primary/30 transition-all duration-500 text-center hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-7 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300" aria-hidden="true">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-foreground mb-2 sm:mb-3">
                {area.state}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {area.description}
              </p>
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Areas;
