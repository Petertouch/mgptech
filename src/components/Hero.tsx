import heroImage from "@/assets/hero-home.jpg";

const Hero = () => {
  return (
    <section className="sticky top-0 z-0 min-h-[55svh] sm:min-h-[70svh] flex items-center overflow-hidden" aria-label="Inicio - OGF Real Estate">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={heroImage}
          alt="Proyecto de casa moderna terminada por OGF Real Estate en Florida"
          className="w-full h-full object-cover scale-105"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-8 sm:pb-12">
        <div className="max-w-3xl">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-5 sm:mb-8 opacity-0 animate-fade-in-up animation-delay-200 leading-[1.1]">
            Transformamos casas con historia en{" "}
            <span className="text-gradient italic">inversiones con futuro</span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-0 sm:mb-0 max-w-xl opacity-0 animate-fade-in-up animation-delay-400 leading-relaxed">
            Construimos hogares desde cero y renovamos propiedades con potencial en <strong>Ohio</strong>, <strong>Georgia</strong> y <strong>Florida</strong>.
            Tu próxima inversión comienza aquí.
          </p>

        </div>
      </div>

      {/* Scroll Indicator - hidden on small mobile */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float hidden sm:block" aria-hidden="true">
        <div className="w-5 h-9 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-white/40 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
