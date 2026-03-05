import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
}

const BeforeAfterSlider = ({ before, after, alt, beforeLabel, afterLabel }: BeforeAfterSliderProps) => {
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
      aria-label={`${beforeLabel} / ${afterLabel}: ${alt}`}
    >
      <img src={after} alt={`${alt} - ${afterLabel}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img src={before} alt={`${alt} - ${beforeLabel}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>

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

      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase" aria-hidden="true">{beforeLabel}</div>
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full font-medium tracking-wide uppercase" aria-hidden="true">{afterLabel}</div>
    </figure>
  );
};

const comparisons = [
  { before: "/before1.png", after: "/after1.png", alt: "Complete kitchen and interior renovation" },
  { before: "/before2.png", after: "/after2.png", alt: "Facade and exterior property transformation" },
];

const BeforeAfter = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-28 bg-background" aria-labelledby="antes-despues-titulo">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-20">
          <h2 id="antes-despues-titulo" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-4 sm:mb-5">
            {t.beforeAfter.title} <span className="text-primary italic">{t.beforeAfter.titleAccent}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t.beforeAfter.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
          {comparisons.map((comp, index) => (
            <BeforeAfterSlider key={index} {...comp} beforeLabel={t.beforeAfter.before} afterLabel={t.beforeAfter.after} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
