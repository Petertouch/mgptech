import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { usePublicProjectsPaginated, type PublicProjectsFilters } from "@/hooks/useProjects";
import { Link } from "react-router-dom";
import { MapPin, Ruler, BedDouble, Bath, DollarSign, Loader2 } from "lucide-react";
import ImageCarousel from "@/components/dashboard/ImageCarousel";
import type { ProjectWithPhases } from "@/types/project";
import { useState, useRef, useEffect, useMemo, memo } from "react";

type ProjectFilter = "all" | "active" | "completed";
type PriceRange = "all" | "under200" | "200to400" | "over400";

// Memoized project card to prevent re-renders
const ProjectCard = memo(function ProjectCard({ project }: { project: ProjectWithPhases }) {
  const completedPhases = project.project_phases?.filter((p) => p.status === "completed").length ?? 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#0047FF]/50 transition-all duration-300">
      <div className="h-32 sm:h-36 overflow-hidden">
        <ImageCarousel
          images={project.project_images ?? []}
          coverImage={project.cover_image}
          alt={project.name}
          fallbackLetter={project.name.charAt(0)}
        />
      </div>
      <div className="p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-white">{project.name}</h3>
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
});

// Known locations for the filter dropdown (avoids an extra query)
const KNOWN_LOCATIONS = ["Florida", "Georgia", "Ohio"];

function PublicProjects({ onStickyChange }: { onStickyChange: (sticky: boolean) => void }) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [location, setLocation] = useState("all");
  const [investmentType, setInvestmentType] = useState("all");
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [minBathrooms, setMinBathrooms] = useState(0);
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filters: PublicProjectsFilters = useMemo(() => ({
    status: filter,
    location,
    investmentType,
    minBedrooms,
    minBathrooms,
    priceRange,
  }), [filter, location, investmentType, minBedrooms, minBathrooms, priceRange]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePublicProjectsPaginated(filters);

  const allProjects = useMemo(
    () => data?.pages.flatMap((page) => page.projects) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.total ?? 0;

  // Sticky detection
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const sticky = !entry.isIntersecting;
        setIsSticky(sticky);
        onStickyChange(sticky);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onStickyChange]);

  // Infinite scroll: only auto-load after user has scrolled past first batch
  const pageCount = data?.pages.length ?? 0;
  useEffect(() => {
    if (pageCount < 2) return;           // first expansion is manual via button
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const statusFilters: { key: ProjectFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "En Proceso" },
    { key: "completed", label: "Completados" },
  ];

  const selectClass = "bg-white/5 border border-white/10 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#0047FF]/50 transition-colors appearance-none cursor-pointer";

  return (
    <section id="proyectos" className="bg-[#060a1f] pb-16 sm:pb-20 min-h-screen">
      {/* Sentinel for sticky detection */}
      <div ref={stickyRef} className="h-0" />

      {/* Sticky header bar */}
      <div className={`sticky top-0 z-30 bg-[#060a1f]/95 backdrop-blur-sm transition-shadow duration-300 ${isSticky ? "shadow-lg shadow-black/30" : ""}`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 transition-all duration-300 ${isSticky ? "sm:justify-center" : "sm:justify-center sm:flex-col sm:items-center"}`}>
            <h2 className={`font-bold text-white whitespace-nowrap transition-all duration-300 ${isSticky ? "hidden" : "text-2xl sm:text-3xl md:text-4xl sm:mb-2"}`}>
              Nuestros <span className="text-[#0047FF]">Proyectos</span>
            </h2>
            <div className={`flex flex-wrap items-center gap-2 transition-all duration-300 ${isSticky ? "justify-center" : "justify-center"}`}>
              {statusFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    filter === f.key
                      ? "bg-[#0047FF] text-white shadow-lg shadow-[#0047FF]/25"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
                <option value="all">Ubicación</option>
                {KNOWN_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <select value={investmentType} onChange={(e) => setInvestmentType(e.target.value)} className={selectClass}>
                <option value="all">Tipo</option>
                <option value="house_flipping">House Flipping</option>
                <option value="new_construction">Construcción Nueva</option>
              </select>
              <select value={minBedrooms} onChange={(e) => setMinBedrooms(Number(e.target.value))} className={selectClass}>
                <option value={0}>Hab.</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
              <select value={minBathrooms} onChange={(e) => setMinBathrooms(Number(e.target.value))} className={selectClass}>
                <option value={0}>Baños</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
              </select>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value as PriceRange)} className={selectClass}>
                <option value="all">Precio</option>
                <option value="under200">&lt; $200k</option>
                <option value="200to400">$200k-$400k</option>
                <option value="over400">&gt; $400k</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Project cards */}
      <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 text-[#0047FF] animate-spin" />
          </div>
        ) : allProjects.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No hay proyectos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {allProjects.map((project: ProjectWithPhases) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Load more: button for first page, auto-scroll after */}
        {hasNextPage && !isFetchingNextPage && pageCount < 2 && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => fetchNextPage()}
              className="px-5 py-2 rounded-full text-xs font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
            >
              Ver más proyectos
            </button>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 text-[#0047FF] animate-spin" />
          </div>
        )}

        {/* Sentinel for auto-load after first manual expansion */}
        <div ref={loadMoreRef} className="h-1" />

        {!isLoading && allProjects.length > 0 && !hasNextPage && (
          <p className="text-center text-gray-600 text-xs mt-4">
            {allProjects.length} de {totalCount} proyectos
          </p>
        )}

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
  const [projectsSticky, setProjectsSticky] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header hidden={projectsSticky} />
      <main>
        <Hero />
        <div className="relative z-10">
          <PublicProjects onStickyChange={setProjectsSticky} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
