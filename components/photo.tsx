import Image from "next/image";
import type { CSSProperties } from "react";
import { aspectOf, type Photo as PhotoData } from "@/content/photos";

type Ratio = "wide" | "landscape" | "square" | "portrait" | "tall";

type PhotoProps = {
  photo: PhotoData;
  /**
   * Marco de proporción fija. Si se omite, la foto se muestra en su proporción
   * real, sin recortes: una vertical se ve vertical y una horizontal, horizontal.
   */
  ratio?: Ratio;
  /**
   * Sólo con proporción real. Límites [mínimo, máximo] de ancho÷alto. Una foto
   * fuera de ellos se recorta lo justo para entrar; sirve en tarjetas, donde
   * una foto de celular a lo alto rompería la fila.
   */
  clamp?: [number, number];
  /**
   * Sólo con proporción real. Alto máximo del marco (p. ej. "85vh"). Las fotos
   * que lo rebasen se encogen y se centran en lugar de volverse una tira.
   */
  maxHeight?: string;
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

const RATIOS: Record<Ratio, string> = {
  wide: "aspect-[21/9]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
};

/**
 * Marco de foto del sitio.
 *
 * Las fotos reales son JPG y Next las optimiza. Los SVG de muestra que quedan
 * en `public/img` se sirven tal cual, porque el optimizador no los procesa.
 */
export function Photo({
  photo,
  ratio,
  clamp,
  maxHeight,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
  imageClassName,
  showCaption = false,
}: PhotoProps) {
  let frameClass = "";
  const frameStyle: CSSProperties = {};
  const outerStyle: CSSProperties = {};

  if (ratio) {
    frameClass = RATIOS[ratio];
  } else {
    let aspect = aspectOf(photo);
    if (clamp) aspect = Math.min(Math.max(aspect, clamp[0]), clamp[1]);
    frameStyle.aspectRatio = `${aspect}`;

    if (maxHeight) {
      // Ancho que cabe en el alto máximo; si es menos que el disponible, se centra.
      outerStyle.width = `min(100%, calc(${maxHeight} * ${aspect}))`;
      outerStyle.marginInline = "auto";
    }
  }

  const frame = (
    <div
      className={`relative w-full overflow-hidden bg-paper-deep ${frameClass} ${className ?? ""}`}
      style={frameStyle}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={photo.src.endsWith(".svg")}
        className={`object-cover ${imageClassName ?? ""}`}
        style={photo.focus ? { objectPosition: photo.focus } : undefined}
      />
    </div>
  );

  if (!showCaption || !photo.caption) {
    return maxHeight ? <div style={outerStyle}>{frame}</div> : frame;
  }

  return (
    <figure className="space-y-3" style={outerStyle}>
      {frame}
      <figcaption className="font-meta text-[0.8125rem] leading-relaxed text-ink-faint">
        {photo.caption}
      </figcaption>
    </figure>
  );
}
