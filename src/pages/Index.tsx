import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Areas from "@/components/Areas";
import CTA from "@/components/CTA";
import BeforeAfter from "@/components/BeforeAfter";
import Footer from "@/components/Footer";
import { usePublicProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";
import { MapPin, Ruler, BedDouble, Bath, DollarSign } from "lucide-react";
import ImageCarousel from "@/components/dashboard/ImageCarousel";
import type { ProjectWithPhases } from "@/types/project";

function PublicProjects() {
  const { data: projects, isLoading } = usePublicProjects();

  if (isLoading || !projects || projects.length === 0) return null;

  return (
    <section id="proyectos" className="py-16 sm:py-20 bg-[#060a1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Nuestros <span className="text-[#0047FF]">Proyectos</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Conoce los proyectos de inversión inmobiliaria que estamos desarrollando.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project: ProjectWithPhases) => {
            const completedPhases = project.project_phases?.filter((p) => p.status === "completed").length ?? 0;
            return (
              <div
                key={project.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#0047FF]/50 transition-all duration-300"
              >
                <div className="h-44 sm:h-48 overflow-hidden">
                  <ImageCarousel
                    images={project.project_images ?? []}
                    coverImage={project.cover_image}
                    alt={project.name}
                    fallbackLetter={project.name.charAt(0)}
                  />
                </div>
                <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white">{project.name}</h3>
                  {project.location && (
                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" /> {project.location}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{project.description}</p>
                  )}
                  {project.sale_value && project.status === "completed" && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <DollarSign className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                      <span className="text-green-400 font-semibold">
                        Vendido: ${project.sale_value.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {(project.sqft || project.bedrooms || project.bathrooms) && (
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                      {project.sqft && (
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {project.sqft.toLocaleString()} ft²
                        </span>
                      )}
                      {project.bedrooms && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {project.bedrooms}
                        </span>
                      )}
                      {project.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {project.bathrooms}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-400">
                      <span>Progreso</span>
                      <span>{completedPhases}/5 fases</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const phase = project.project_phases?.find((p) => p.phase_number === n);
                        let bg = "bg-white/10";
                        if (phase?.status === "completed") bg = "bg-green-500";
                        else if (phase?.status === "in_progress") bg = "bg-[#0047FF] animate-pulse";
                        return <div key={n} className={`h-1.5 flex-1 rounded-full ${bg}`} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#0047FF] hover:underline text-xs sm:text-sm font-medium"
          >
            Accede al portal de inversionistas para más información
          </Link>
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <PublicProjects />
        <Services />
        <Areas />
        <CTA />
        <BeforeAfter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
