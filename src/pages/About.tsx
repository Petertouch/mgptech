import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, TrendingUp, Rocket, Clock, DollarSign, FolderKanban, Hammer, Globe, ArrowDown, Shield } from "lucide-react";

const STATS = [
  { value: "25+", label: "Años de experiencia", icon: Clock },
  { value: "$325M+", label: "USD ejecutados", icon: DollarSign },
  { value: "55+", label: "Proyectos estatales", icon: FolderKanban },
  { value: "100+", label: "Proyectos residenciales", icon: Hammer },
];

const TEAM = [
  {
    name: "Mauricio Paba",
    role: "Liderazgo Técnico",
    icon: Building2,
    description: "Ingeniero civil con amplia experiencia en obra pública y ejecución de proyectos de gran escala.",
  },
  {
    name: "Daniel Londoño",
    role: "Liderazgo Financiero",
    icon: TrendingUp,
    description: "Administrador de empresas y Country Manager de Global66, con más de 10 años en startups de tecnología.",
  },
  {
    name: "Pedro Tobar",
    role: "Liderazgo Comercial y Jurídico",
    icon: Rocket,
    description: "Emprendedor especializado en estrategia, tecnología y construcción de compañías escalables.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">

        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-foreground mb-5 opacity-0 animate-fade-in-up">
              Nuestra <span className="text-primary italic">Historia</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
              Un equipo con trayectoria comprobada, respaldado por más de dos décadas
              de ingeniería civil y cientos de millones de dólares en proyectos ejecutados.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 text-center opacity-0 animate-fade-in-up animation-delay-${(i + 1) * 200}`}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Empresas respaldo */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-foreground mb-4 opacity-0 animate-fade-in-up">
                Respaldados por <span className="text-primary italic">Experiencia</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 opacity-0 animate-fade-in-up animation-delay-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">MGP Seven Island LLC</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Operaciones en Estados Unidos, Panamá y Colombia con alcance internacional y solidez financiera.
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400">USA</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400">Panamá</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400">Colombia</span>
                </div>
              </div>
              <div className="card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 opacity-0 animate-fade-in-up animation-delay-400">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Hammer className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">MGP Constructions Corp</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Respaldada por un socio ingeniero civil con más de 25 años de experiencia y más de USD $325 millones ejecutados en 55+ proyectos estatales.
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">25+ años</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">$325M+</span>
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex flex-col items-center py-8 sm:py-12 opacity-0 animate-fade-in-up animation-delay-400">
              <p className="text-sm text-muted-foreground mb-3 italic">Sobre esa trayectoria nace...</p>
              <ArrowDown className="w-6 h-6 text-primary animate-float" />
            </div>

            {/* OGF Card destacada */}
            <div className="max-w-2xl mx-auto card-gradient rounded-2xl border-2 border-primary/30 p-8 sm:p-10 text-center opacity-0 animate-fade-in-up animation-delay-600">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display text-white mb-3">
                OGF Real Estate Group LLC
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Un vehículo independiente enfocado en <strong className="text-white">fix & flip</strong> y{" "}
                <strong className="text-white">construcción de obra nueva</strong> en Estados Unidos,
                integrado por un equipo multidisciplinario con visión estratégica y ejecución comprobada.
              </p>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-foreground mb-4 opacity-0 animate-fade-in-up">
                Nuestro <span className="text-primary italic">Equipo</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
                Tres líderes con perfiles complementarios que combinan ingeniería, finanzas y estrategia.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {TEAM.map((member, i) => (
                <div
                  key={member.name}
                  className={`card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 text-center group hover:border-primary/30 transition-all duration-500 opacity-0 animate-fade-in-up animation-delay-${(i + 1) * 200}`}
                >
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <member.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* General Contractors */}
        <section className="py-12 sm:py-16 pb-20 sm:pb-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto card-gradient rounded-2xl border border-white/5 p-8 sm:p-10 opacity-0 animate-fade-in-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-3">
                  Ejecución con <span className="text-primary italic">Excelencia</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  OGF trabaja de la mano con general contractors con historial comprobado
                  para ejecutar obras con los más altos estándares.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">50+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Proyectos Fix & Flip</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">50+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Obras de Construcción Nueva</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Control de costos</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Cronogramas estrictos</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Máxima rentabilidad</span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Mercado residencial USA</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;
