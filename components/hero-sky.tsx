/**
 * El cielo de la portada.
 *
 * Es todo CSS salvo la silueta del fondo, así que no hay ninguna imagen
 * grande que cargar: la página abre con el degradado ya pintado.
 */
export function HeroSky() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Cielo: de un azul pálido arriba al color del papel abajo. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #dbe3e7 0%, #e6e0d6 42%, #f2ece1 72%, var(--color-paper) 100%)",
        }}
      />

      {/* Luz cálida que se desplaza muy despacio, como el sol de la mañana. */}
      <div
        className="animate-drift absolute top-[-28%] left-[52%] aspect-square w-[min(150vh,150vw)] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(231,201,158,0.62) 0%, rgba(231,201,158,0.2) 42%, transparent 68%)",
        }}
      />

      {/* Un frío tenue en la esquina, para que el cálido no lo invada todo. */}
      <div
        className="absolute top-[-10%] left-[-15%] aspect-square w-[min(90vh,90vw)] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,140,123,0.22) 0%, transparent 65%)",
        }}
      />

      {/*
        Cerros lejanos al pie del cielo. La máscara los desvanece hacia arriba
        para que no aparezca un borde recto donde empieza la imagen.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element -- adorno decorativo de pocos KB; next/image no aportaría nada aquí */}
      <img
        src="/img/niebla.svg"
        alt=""
        className="absolute inset-x-0 bottom-0 h-[42vh] w-full object-cover opacity-45"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 55%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 55%)",
        }}
      />

      {/* Cierre hacia el color de fondo, para entrar sin costura a la sección siguiente. */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-paper))",
        }}
      />
    </div>
  );
}
