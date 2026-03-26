import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, DollarSign, FolderKanban, Hammer, Globe, ArrowDown, Shield } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const STATS = [
    { value: "25+", label: t.about.stats.years, icon: Clock },
    { value: "$420M+", label: t.about.stats.executed, icon: DollarSign },
    { value: "55+", label: t.about.stats.stateProjects, icon: FolderKanban },
    { value: "100+", label: t.about.stats.residential, icon: Hammer },
  ];

  const TEAM = [
    { name: "Mauricio Paba", role: t.about.mauricioRole, photo: "https://bgapniabglowonophvaz.supabase.co/storage/v1/object/public/project-photos/team/mauricio-paba.webp", description: t.about.mauricioDesc },
    { name: "Daniel Londoño", role: t.about.danielRole, photo: "https://bgapniabglowonophvaz.supabase.co/storage/v1/object/public/project-photos/team/daniel-londono.webp", description: t.about.danielDesc },
    { name: "Pedro Tobar", role: t.about.pedroRole, photo: "https://bgapniabglowonophvaz.supabase.co/storage/v1/object/public/project-photos/team/pedro-tobar.webp", description: t.about.pedroDesc },
    { name: "Gloria Rodríguez", role: t.about.gloriaRole, photo: "https://bgapniabglowonophvaz.supabase.co/storage/v1/object/public/project-photos/team/gloria-rodriguez.webp", description: t.about.gloriaDesc },
    { name: "Carlos Guerrero", role: t.about.carlosRole, photo: "https://bgapniabglowonophvaz.supabase.co/storage/v1/object/public/project-photos/team/carlos-guerrero.webp", description: t.about.carlosDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">

        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-foreground mb-5 opacity-0 animate-fade-in-up">
              {t.about.heroTitle} <span className="text-primary italic">{t.about.heroTitleAccent}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
              {t.about.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat, i) => (
                <div key={stat.label} className={`card-gradient rounded-2xl border border-white/5 p-4 sm:p-8 text-center opacity-0 animate-fade-in-up animation-delay-${(i + 1) * 200}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-[11px] sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-foreground mb-4 opacity-0 animate-fade-in-up">
                {t.about.backingTitle} <span className="text-primary italic">{t.about.backingTitleAccent}</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 opacity-0 animate-fade-in-up animation-delay-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Globe className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    MGP Seven Island LLC
                    <svg className="w-6 h-4 flex-shrink-0 rounded-[2px] shadow-sm" viewBox="0 0 60 40" aria-label="USA"><rect width="60" height="40" fill="#B22234"/><rect y="3.08" width="60" height="3.08" fill="#fff"/><rect y="9.23" width="60" height="3.08" fill="#fff"/><rect y="15.38" width="60" height="3.08" fill="#fff"/><rect y="21.54" width="60" height="3.08" fill="#fff"/><rect y="27.69" width="60" height="3.08" fill="#fff"/><rect y="33.85" width="60" height="3.08" fill="#fff"/><rect width="24" height="21.54" fill="#3C3B6E"/></svg>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.about.mgpSevenDesc}</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400">USA</span>
                </div>
              </div>
              <div className="card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 opacity-0 animate-fade-in-up animation-delay-400">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Hammer className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    MGP Constructions Corp
                    <svg className="w-6 h-4 flex-shrink-0 rounded-[2px] shadow-sm" viewBox="0 0 60 40" aria-label="Colombia"><rect width="60" height="20" fill="#FCD116"/><rect y="20" width="60" height="10" fill="#003893"/><rect y="30" width="60" height="10" fill="#CE1126"/></svg>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.about.mgpConstructionsDesc}</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">{t.about.years25}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">$420M+</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-8 sm:py-12 opacity-0 animate-fade-in-up animation-delay-400">
              <p className="text-sm text-muted-foreground mb-3 italic">{t.about.arrowText}</p>
              <ArrowDown className="w-6 h-6 text-primary animate-float" />
            </div>

            <div className="max-w-2xl mx-auto card-gradient rounded-2xl border-2 border-primary/30 p-8 sm:p-10 text-center opacity-0 animate-fade-in-up animation-delay-600">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center"><Shield className="w-8 h-8 text-primary" /></div>
              <h3 className="text-2xl sm:text-3xl font-display text-white mb-3">MGP Capital Group LLC</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t.about.ogfDesc1} <strong className="text-white">{t.about.ogfFixFlip}</strong> {t.about.ogfAnd}{" "}
                <strong className="text-white">{t.about.ogfNewConst}</strong> {t.about.ogfDesc2}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-foreground mb-4 opacity-0 animate-fade-in-up">
                {t.about.teamTitle} <span className="text-primary italic">{t.about.teamTitleAccent}</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">{t.about.teamSubtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {TEAM.map((member, i) => (
                <div key={member.name} className={`card-gradient rounded-2xl border border-white/5 p-6 sm:p-8 text-center group hover:border-primary/30 transition-all duration-500 opacity-0 animate-fade-in-up animation-delay-${(i + 1) * 200}`}>
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 pb-20 sm:pb-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto card-gradient rounded-2xl border border-white/5 p-5 sm:p-10 opacity-0 animate-fade-in-up">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-3xl font-display text-foreground mb-3">
                  {t.about.executionTitle} <span className="text-primary italic">{t.about.executionTitleAccent}</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t.about.executionSubtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6">
                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xl sm:text-3xl font-bold text-primary mb-1">50+</p>
                  <p className="text-[11px] sm:text-sm text-muted-foreground">{t.about.fixFlipProjects}</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xl sm:text-3xl font-bold text-primary mb-1">50+</p>
                  <p className="text-[11px] sm:text-sm text-muted-foreground">{t.about.newConstructionProjects}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{t.about.costControl}</span>
                <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{t.about.strictTimelines}</span>
                <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{t.about.maxReturn}</span>
                <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{t.about.usMarket}</span>
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
