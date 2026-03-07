import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { usePublicProjectsPaginated, type PublicProjectsFilters } from "@/hooks/useProjects";
import { Link } from "react-router-dom";
import { MapPin, Ruler, BedDouble, Bath, DollarSign, Loader2, X, Home } from "lucide-react";
import ImageCarousel from "@/components/dashboard/ImageCarousel";
import type { ProjectWithPhases } from "@/types/project";
import { useState, useRef, useEffect, useMemo, memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type ProjectFilter = "all" | "active" | "completed";
type PriceRange = "all" | "under200" | "200to400" | "over400";

const ProjectCard = memo(function ProjectCard({ project, onClick }: { project: ProjectWithPhases; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#0047FF]/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-28 sm:h-36 overflow-hidden">
        <ImageCarousel
          images={project.project_images ?? []}
          coverImage={project.cover_image}
          alt={project.name}
          fallbackLetter={project.name.charAt(0)}
        />
        {project.status === "active" && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-[9px] sm:text-xs font-extrabold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-xl shadow-orange-500/30 uppercase tracking-wide">
            🔥 ¡Invierte ahora!
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3.5 space-y-1 sm:space-y-2">
        <h3 className="text-xs sm:text-base font-semibold text-white leading-tight">{project.name}</h3>
        {project.location && (
          <p className="text-[10px] sm:text-sm text-gray-400 flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 flex-shrink-0" /> {project.location}
          </p>
        )}
        {(project.sqft || project.bedrooms || project.bathrooms) && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-gray-400">
            {project.sqft && (
              <span className="flex items-center gap-0.5 sm:gap-1">
                <Ruler className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> {project.sqft.toLocaleString()} ft²
              </span>
            )}
            {project.bedrooms && (
              <span className="flex items-center gap-0.5 sm:gap-1">
                <BedDouble className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> {project.bedrooms}
              </span>
            )}
            {project.bathrooms && (
              <span className="flex items-center gap-0.5 sm:gap-1">
                <Bath className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> {project.bathrooms}
              </span>
            )}
          </div>
        )}
        {project.sale_value && project.status === "completed" && (
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm">
            <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-400 flex-shrink-0" />
            <span className="text-green-400 font-semibold">
              ${project.sale_value.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

function ProjectModal({ project, onClose }: { project: ProjectWithPhases; onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#0a0f2c] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="h-56 sm:h-72">
          <ImageCarousel images={project.project_images ?? []} coverImage={project.cover_image} alt={project.name} fallbackLetter={project.name.charAt(0)} />
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{project.name}</h2>
            {project.location && (
              <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4 flex-shrink-0" /> {project.location}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {project.sale_value && project.status === "completed" && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-semibold text-sm">${project.sale_value.toLocaleString()}</span>
              </div>
            )}
            {project.sqft && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Ruler className="h-4 w-4 text-gray-400" />
                <span className="text-white text-sm">{project.sqft.toLocaleString()} ft²</span>
              </div>
            )}
            {project.bedrooms && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <BedDouble className="h-4 w-4 text-gray-400" />
                <span className="text-white text-sm">{project.bedrooms} {t.projects.beds}</span>
              </div>
            )}
            {project.bathrooms && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Bath className="h-4 w-4 text-gray-400" />
                <span className="text-white text-sm">{project.bathrooms} {t.projects.baths}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Home className="h-4 w-4 text-gray-400" />
              <span className="text-white text-sm">
                {project.investment_type === "new_construction" ? t.projects.newConstruction : t.projects.houseFlipping}
              </span>
            </div>
          </div>

          {project.description && (
            <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>
          )}

          {project.status === "active" && (
            <div className="pt-2">
              <a
                href={`https://wa.me/573124426783?text=${encodeURIComponent(`Hola, estuve en tu página web de OGF y deseo más información sobre la propiedad ${project.name}${project.location ? `, ${project.location}` : ""}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1eba59] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Hablar con un asesor
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const KNOWN_LOCATIONS = ["Florida", "Georgia", "Ohio"];

function PublicProjects({ onStickyChange }: { onStickyChange: (sticky: boolean) => void }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [location, setLocation] = useState("all");
  const [investmentType, setInvestmentType] = useState("all");
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [minBathrooms, setMinBathrooms] = useState(0);
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [isSticky, setIsSticky] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithPhases | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filters: PublicProjectsFilters = useMemo(() => ({
    status: filter, location, investmentType, minBedrooms, minBathrooms, priceRange,
  }), [filter, location, investmentType, minBedrooms, minBathrooms, priceRange]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = usePublicProjectsPaginated(filters);

  const allProjects = useMemo(() => data?.pages.flatMap((page) => page.projects) ?? [], [data]);
  const totalCount = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { const sticky = !entry.isIntersecting; setIsSticky(sticky); onStickyChange(sticky); },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onStickyChange]);

  const pageCount = data?.pages.length ?? 0;
  useEffect(() => {
    if (pageCount < 2) return;
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) fetchNextPage(); }, { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const statusFilters: { key: ProjectFilter; label: string }[] = [
    { key: "all", label: t.projects.all },
    { key: "active", label: t.projects.active },
    { key: "completed", label: t.projects.completed },
  ];

  const selectClass = "bg-white/5 border border-white/10 text-gray-400 text-xs sm:text-xs rounded-lg px-2 py-2 sm:px-2.5 sm:py-1.5 outline-none focus:border-[#0047FF]/50 transition-colors appearance-none cursor-pointer min-h-[36px] sm:min-h-0";

  return (
    <section id="proyectos" className="bg-[#060a1f] pb-16 sm:pb-20 min-h-screen">
      <div ref={stickyRef} className="h-0" />
      <div className={`sticky top-0 z-30 bg-[#060a1f]/95 backdrop-blur-sm transition-shadow duration-300 ${isSticky ? "shadow-lg shadow-black/30" : ""}`}>
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 transition-all duration-300 ${isSticky ? "sm:justify-center" : "sm:justify-center sm:flex-col sm:items-center"}`}>
            <h2 className={`font-bold text-white whitespace-nowrap transition-all duration-300 ${isSticky ? "hidden" : "text-xl sm:text-3xl md:text-4xl sm:mb-2 text-center"}`}>
              {t.projects.title} <span className="text-[#0047FF]">{t.projects.titleAccent}</span>
            </h2>
            <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 transition-all duration-300 ${isSticky ? "justify-center" : "justify-center"}`}>
              {statusFilters.map((f) => (
                <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 sm:py-1 rounded-full text-xs font-medium transition-all duration-300 ${filter === f.key ? "bg-[#0047FF] text-white shadow-lg shadow-[#0047FF]/25" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"}`}>
                  {f.label}
                </button>
              ))}
              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
                <option value="all">{t.projects.location}</option>
                {KNOWN_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <select value={investmentType} onChange={(e) => setInvestmentType(e.target.value)} className={selectClass}>
                <option value="all">{t.projects.type}</option>
                <option value="house_flipping">{t.projects.houseFlipping}</option>
                <option value="new_construction">{t.projects.newConstruction}</option>
              </select>
              <select value={minBedrooms} onChange={(e) => setMinBedrooms(Number(e.target.value))} className={selectClass}>
                <option value={0}>{t.projects.bedrooms}</option>
                <option value={1}>1+</option><option value={2}>2+</option><option value={3}>3+</option><option value={4}>4+</option>
              </select>
              <select value={minBathrooms} onChange={(e) => setMinBathrooms(Number(e.target.value))} className={selectClass}>
                <option value={0}>{t.projects.bathrooms}</option>
                <option value={1}>1+</option><option value={2}>2+</option><option value={3}>3+</option>
              </select>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value as PriceRange)} className={selectClass}>
                <option value="all">{t.projects.price}</option>
                <option value="under200">&lt; $200k</option><option value="200to400">$200k-$400k</option><option value="over400">&gt; $400k</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 text-[#0047FF] animate-spin" /></div>
        ) : allProjects.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{t.projects.noProjects}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            {allProjects.map((project: ProjectWithPhases) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && pageCount < 2 && (
          <div className="flex justify-center py-6">
            <button onClick={() => fetchNextPage()} className="px-5 py-2 rounded-full text-xs font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all">
              {t.projects.viewMore}
            </button>
          </div>
        )}

        {isFetchingNextPage && <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 text-[#0047FF] animate-spin" /></div>}

        <div ref={loadMoreRef} className="h-1" />

        {!isLoading && allProjects.length > 0 && !hasNextPage && (
          <p className="text-center text-gray-600 text-xs mt-4">{allProjects.length} {t.projects.of} {totalCount}</p>
        )}

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-[#0047FF] hover:underline text-xs sm:text-sm font-medium">
            {t.projects.portalCta}
          </Link>
        </div>
      </div>
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
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
