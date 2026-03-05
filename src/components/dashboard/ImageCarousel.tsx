import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectImage } from "@/types/project";

interface ImageCarouselProps {
  images: ProjectImage[];
  coverImage?: string;
  alt: string;
  fallbackLetter: string;
}

export default function ImageCarousel({ images, coverImage, alt, fallbackLetter }: ImageCarouselProps) {
  const allImages: string[] = [];

  // Cover image first, then gallery images sorted by sort_order
  if (coverImage) allImages.push(coverImage);
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  sorted.forEach((img) => {
    if (img.image_url !== coverImage) allImages.push(img.image_url);
  });

  const [current, setCurrent] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0047FF]/20 to-[#0a0f2c] flex items-center justify-center">
        <span className="text-4xl font-bold text-white/20">{fallbackLetter}</span>
      </div>
    );
  }

  if (allImages.length === 1) {
    return (
      <img src={allImages[0]} alt={alt} className="w-full h-full object-cover" />
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full h-full group">
      <img
        src={allImages[current]}
        alt={`${alt} - ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        aria-label="Siguiente foto"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {allImages.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Ir a foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
