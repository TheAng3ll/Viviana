/**
 * Datos del sitio. Todo lo que Viviana necesita cambiar para personalizarlo
 * está en este archivo y en `content/posts.ts`.
 */
export const site = {
  /** Nombre corto, el que aparece en el encabezado. */
  name: "Iván",
  /** Nombre completo para el encabezado principal y los metadatos. */
  fullName: "Iván",
  /** Años, tal como se muestran bajo el nombre. */
  years: "1996 — 2026",
  /** Frase de apertura. Cámbiala por algo que él dijera. */
  epigraph: "Siempre escogía el camino largo, el que daba a la vista.",
  /** Descripción para buscadores y para cuando se comparte el enlace. */
  description:
    "Un lugar tranquilo para recordar a Iván: sus viajes, sus fotos y las historias de quienes lo quisieron.",
  /**
   * Dominio del sitio. Sirve para armar las direcciones absolutas de la vista
   * previa cuando alguien comparte el enlace por WhatsApp o Facebook.
   * En el servidor se puede sobreescribir con la variable SITE_URL.
   */
  url: "https://ivanbf.com.mx",
} as const;

export const nav = [
  { href: "/sobre-el", label: "Sobre él" },
  { href: "/historias", label: "Historias" },
  { href: "/galeria", label: "Galería" },
] as const;
