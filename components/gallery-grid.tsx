"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { allPhotos } from "@/content/posts";

type GalleryPhoto = (typeof allPhotos)[number];

/**
 * Mosaico de fotos con vista ampliada.
 *
 * Usa el `<dialog>` del navegador en modo modal, que ya trae gratis el cierre
 * con Escape, el foco atrapado dentro y el resto de la página inerte.
 */
export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex === null) {
      if (dialog.open) dialog.close();
    } else if (!dialog.open) {
      dialog.showModal();
    }
  }, [openIndex]);

  const move = (step: number) =>
    setOpenIndex((current) =>
      current === null
        ? null
        : (current + step + photos.length) % photos.length
    );

  const active = openIndex === null ? null : photos[openIndex]!;

  return (
    <>
      {/*
        Alturas alternadas: cada tercera foto es vertical. Rompe la retícula
        lo suficiente para que se lea como un muro de fotos y no como una tabla.
      */}
      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {photos.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group mb-3 block w-full cursor-zoom-in sm:mb-4"
          >
            <span
              className={`relative block overflow-hidden bg-paper-deep ${
                index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                unoptimized={photo.src.endsWith(".svg")}
                className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]"
              />
            </span>
            {photo.caption && (
              <span className="font-meta mt-2 block text-left text-[0.75rem] leading-snug text-ink-faint">
                {photo.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenIndex(null)}
        onClick={(event) => {
          // Un clic fuera de la imagen cierra la vista ampliada.
          if (event.target === event.currentTarget) setOpenIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-4 text-paper backdrop:bg-ink/95 backdrop:backdrop-blur-md"
      >
        {active && (
          <div className="flex flex-col items-center gap-5">
            <div className="relative h-[72dvh] w-[92vw] max-w-5xl">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="92vw"
                unoptimized={active.src.endsWith(".svg")}
                className="object-contain"
              />
            </div>

            <div className="max-w-xl space-y-2 text-center">
              {active.caption && (
                <p className="text-[0.95rem] text-paper/85">{active.caption}</p>
              )}
              <p className="font-meta text-[0.6875rem] tracking-[0.2em] text-paper/55 uppercase">
                <Link
                  href={`/historias/${active.postSlug}`}
                  onClick={() => setOpenIndex(null)}
                  className="link-quiet"
                >
                  {active.postTitle}
                </Link>
              </p>
            </div>

            <div className="font-meta flex items-center gap-6 text-[0.6875rem] tracking-[0.2em] uppercase">
              <button
                type="button"
                onClick={() => move(-1)}
                className="text-paper/70 transition-colors hover:text-paper"
              >
                ← Anterior
              </button>
              <span className="text-paper/40">
                {openIndex! + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => move(1)}
                className="text-paper/70 transition-colors hover:text-paper"
              >
                Siguiente →
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="font-meta text-[0.6875rem] tracking-[0.2em] text-paper/50 uppercase transition-colors hover:text-paper"
            >
              Cerrar
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
