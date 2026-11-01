/**
 * Las fotos del sitio y sus medidas.
 *
 * Cada foto se muestra en su proporción real, así que el sitio necesita saber
 * cuánto mide. Para añadir una:
 *  1. Guárdala en `public/img/` (JPG o WebP).
 *  2. Anota aquí su nombre sin extensión y sus medidas en píxeles [ancho, alto].
 *  3. Úsala en `content/posts.ts` con `photo("nombre", "descripción", "pie")`.
 */
export const DIMENSIONS = {
  "alteno-sofa": [1179, 1340],
  "alteno-grupo": [1586, 1600],
  "alteno-gradas": [1600, 1200],
  "colombia-letras": [780, 1600],
  "colombia-sombrillas": [1178, 1089],
  "colombia-palacio": [794, 1600],
  "colombia-columnas": [812, 1600],
  "colombia-catedral": [778, 1600],
  "guanajuato-mirador": [778, 1600],
  "guanajuato-escalera": [786, 1600],
  "agua-barco": [819, 1600],
  "agua-palmeras": [804, 1600],
  "agua-arena": [1179, 1466],
  "agua-flamencos": [774, 1600],
  "paseo-cempasuchil": [843, 1175],
  "paseo-alebrije": [1025, 1158],
  "casa-mesa": [1600, 1200],
  "casa-mesa-bn": [1600, 1200],
  "casa-retrato": [1200, 1600],
  "casa-chamarra": [790, 1600],
  "casa-dibujando": [1600, 1200],
} as const satisfies Record<string, readonly [number, number]>;

export type PhotoId = keyof typeof DIMENSIONS;

export type Photo = {
  src: string;
  /** Descripción para quien no puede ver la imagen. Siempre escríbela. */
  alt: string;
  caption?: string;
  /** Medidas reales en píxeles. Con ellas el marco toma la forma de la foto. */
  width: number;
  height: number;
  /**
   * Punto de interés cuando el marco sí tiene que recortar (tarjetas).
   * Es un `object-position` de CSS, p. ej. "center 30%". Por defecto, el centro.
   */
  focus?: string;
};

export function photo(
  id: PhotoId,
  alt: string,
  caption?: string,
  focus?: string
): Photo {
  const [width, height] = DIMENSIONS[id];
  return { src: `/img/${id}.jpg`, alt, caption, width, height, focus };
}

/** Ancho entre alto. Mayor que 1 es horizontal; menor, vertical. */
export function aspectOf(photo: Pick<Photo, "width" | "height">) {
  return photo.width / photo.height;
}

export function isLandscape(photo: Pick<Photo, "width" | "height">) {
  return aspectOf(photo) >= 1;
}
