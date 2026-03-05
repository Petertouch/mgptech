import { useState, useRef, useCallback } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
}

const BeforeAfterSlider = ({ before, after, alt }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };
  const handleTouchStart = () => { isDragging.current = true; };
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <figure
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden rounded-2xl sm:rounded-3xl cursor-col-resize select-none border border-white/5 shadow-2xl shadow-black/20 touch-none"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      role="img"
      aria-label={`Comparación antes y después: ${alt}`}
    >
      {/* After Image (full background) */}
      <img src={after} alt={`${alt} - Después de la renovación por OGF Real Estate`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />

      {/* Before Image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img src={before} alt={`${alt} - Antes de la renovación`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 cursor-col-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 bg-white rounded-full shadow-xl flex items-center justify-center backdrop-blur-sm">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase" aria-hidden="true">Antes</div>
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase" aria-hidden="true">Después</div>
    </figure>
  );
};

const comparisons = [
  { before: "/before1.png", after: "/after1.png", alt: "Renovación completa de cocina y espacios interiores" },
  { before: "/before2.png", after: "/after2.png", alt: "Transformación de fachada y exteriores de propiedad" },
];

const BeforeAfter = () => {
  return (
    <section className="py-16 sm:py-28 bg-background" aria-labelledby="antes-despues-titulo">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-20">
          <h2 id="antes-despues-titulo" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-4 sm:mb-5">
            Antes y <span className="text-primary italic">Después</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Conoce las renovaciones reales de proyectos completados por OGF Real Estate
          </p>
        </div>

        {/* Before/After Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
          {comparisons.map((comp, index) => (
            <BeforeAfterSlider key={index} {...comp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
