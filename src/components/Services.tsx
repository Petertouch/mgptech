import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t.services.flippingTitle,
      description: t.services.flippingDesc,
      image: "/flipping.png",
      imageAlt: "House flipping project - Renovated house by MGP Capital Group",
      features: t.services.flippingFeatures,
    },
    {
      title: t.services.constructionTitle,
      description: t.services.constructionDesc,
      image: "/construction.png",
      imageAlt: "New construction - Modern house built by MGP Capital Group",
      features: t.services.constructionFeatures,
    },
  ];

  return (
    <section id="servicios" className="py-16 sm:py-28 bg-navy-light" aria-labelledby="servicios-titulo">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-20">
          <h2 id="servicios-titulo" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-4 sm:mb-5">
            {t.services.title} <span className="text-primary italic">{t.services.titleAccent}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
          {services.map((service) => (
            <article
              key={service.title}
              className="group card-gradient rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="relative h-48 sm:h-72 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width="600"
                  height="288"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" aria-hidden="true" />
              </div>

              <div className="p-5 sm:p-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display text-foreground mb-3 sm:mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 sm:mb-7">
                  {service.description}
                </p>

                <ul className="space-y-2.5 sm:space-y-3" aria-label={service.title}>
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
