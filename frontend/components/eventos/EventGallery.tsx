"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isLocalEventoImage, normalizeEventoImageUrl } from "@/lib/evento-images";

type EventGalleryProps = {
  fotos: string[];
  eventoNome: string;
};

export function EventGallery({ fotos, eventoNome }: EventGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);

  const goPrev = useCallback(() => {
    setSelectedIndex((i) =>
      i === null ? null : (i - 1 + fotos.length) % fotos.length,
    );
  }, [fotos.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % fotos.length));
  }, [fotos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, close, goPrev, goNext]);

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-4 [column-fill:_balance]">
        {fotos.map((foto, i) => {
          const src = normalizeEventoImageUrl(foto);
          return (
          <button
            key={foto + i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className="mb-4 break-inside-avoid rounded-xl2 overflow-hidden shadow-card relative w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-500"
            aria-label={`Ampliar foto ${i + 1} do evento ${eventoNome}`}
          >
            <Image
              src={src}
              alt={`Foto ${i + 1} do evento ${eventoNome}`}
              width={500}
              height={i % 2 === 0 ? 650 : 400}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="w-full h-auto object-cover"
              unoptimized={isLocalEventoImage(src)}
            />
          </button>
        );
        })}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Visualização ampliada da foto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[90vh] max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={normalizeEventoImageUrl(fotos[selectedIndex])}
                alt={`Foto ${selectedIndex + 1} do evento ${eventoNome}`}
                width={1600}
                height={1200}
                sizes="100vw"
                className="w-full h-auto max-h-[90vh] object-contain rounded-xl2"
                priority
                unoptimized={isLocalEventoImage(
                  normalizeEventoImageUrl(fotos[selectedIndex]),
                )}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
