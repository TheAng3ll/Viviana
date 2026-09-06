import Image from "next/image";
import type { Photo as PhotoData } from "@/content/posts";

type PhotoProps = {
  photo: PhotoData;
  /** Proporción del marco. Las fotos se recortan para llenarlo. */
  ratio?: "wide" | "landscape" | "square" | "portrait" | "tall";
  /** Anchos que ocupará la imagen, para que el navegador pida el tamaño justo. */
  sizes?: string;
  /** Sólo para la imagen principal de la página: la carga sin esperar. */
  priority?: boolean;
  className?: string;
  /** Clases para la imagen misma, p. ej. un acercamiento al pasar el cursor. */
  imageClassName?: string;
  /** Muestra el pie de foto debajo del marco. */
  showCaption?: boolean;
};

const RATIOS = {
  wide: "aspect-[21/9]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
} as const;

/**
 * Marco de foto del sitio.
 *
 * Las imágenes de muestra son SVG y se sirven tal cual (`unoptimized`): el
 * optimizador de Next no procesa SVG. Cuando se reemplacen por fotos reales
 * en JPG o WebP, la condición deja de aplicar y se optimizan solas, sin
 * tocar este archivo.
 */
export function Photo({
  photo,
  ratio = "landscape",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
  imageClassName,
  showCaption = false,
}: PhotoProps) {
  const frame = (
    <div
      className={`relative overflow-hidden bg-paper-deep ${RATIOS[ratio]} ${className ?? ""}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={photo.src.endsWith(".svg")}
        className={`object-cover ${imageClassName ?? ""}`}
      />
    </div>
  );

  if (!showCaption || !photo.caption) return frame;

  return (
    <figure className="space-y-3">
      {frame}
      <figcaption className="font-meta text-[0.8125rem] leading-relaxed text-ink-faint">
        {photo.caption}
      </figcaption>
    </figure>
  );
}
