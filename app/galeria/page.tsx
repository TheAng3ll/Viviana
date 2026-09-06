import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { Reveal } from "@/components/reveal";
import { allPhotos } from "@/content/posts";

export const metadata: Metadata = {
  title: "Galería",
  description: "Todas las fotos suyas que hemos ido juntando.",
};

export default function GaleriaPage() {
  return (
    <div className="pt-36 pb-28 sm:pt-44">
      <header className="shell mb-16 space-y-5 text-center sm:mb-20">
        <Reveal>
          <p className="eyebrow">Lo que fotografió</p>
          <h1 className="heading text-title mt-4 text-ink">Galería</h1>
          <p className="measure text-lede mt-7 leading-relaxed text-ink-soft">
            Toca cualquiera para verla en grande. Si tienes fotos suyas que
            aquí no están, mándalas y las subimos.
          </p>
        </Reveal>
      </header>

      <Reveal className="shell">
        <GalleryGrid photos={allPhotos} />
      </Reveal>
    </div>
  );
}
