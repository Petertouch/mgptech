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
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/2] overflow-hidden rounded-3xl cursor-col-resize select-none border border-white/5 shadow-2xl shadow-black/20"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (full background) */}
      <img src={after} alt={`${alt} - Después`} className="absolute inset-0 w-full h-full object-cover" />

      {/* Before Image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img src={before} alt={`${alt} - Antes`} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 cursor-col-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center backdrop-blur-sm">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[11px] px-3.5 py-1.5 rounded-full font-medium tracking-wide uppercase">Antes</div>
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-[11px] px-3.5 py-1.5 rounded-full font-medium tracking-wide uppercase">Después</div>
    </div>
  );
};

const comparisons = [
  { before: "/before1.png", after: "/after1.png", alt: "Renovación proyecto 1" },
  { before: "/before2.png", after: "/after2.png", alt: "Renovación proyecto 2" },
];

const BeforeAfter = () => {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-5">
            Antes y <span className="text-primary italic">Después</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Acá puedes ver las renovaciones reales de proyectos hechos por OFG
          </p>
        </div>

        {/* Before/After Grid */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {comparisons.map((comp, index) => (
            <BeforeAfterSlider key={index} {...comp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
