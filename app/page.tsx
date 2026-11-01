import Link from "next/link";
import { HeroSky } from "@/components/hero-sky";
import { Photo } from "@/components/photo";
import { PostCard } from "@/components/post-card";
import { Reveal } from "@/components/reveal";
import { photo } from "@/content/photos";
import { allPhotos, orderedPosts } from "@/content/posts";
import { site } from "@/content/site";

/* Texto de muestra. Cámbialo por lo que quieras contar de él. */
const INTRO =
  "Este sitio no es una despedida. Es el lugar donde vamos a ir dejando lo que fue: las fotos que tomó, los caminos que anduvo y las cosas que la gente se acuerda de él. Puedes leer con calma, ver las fotos y, si lo conociste, dejar tu propio recuerdo.";

const BIO = [
  "Iván tenía veintinueve años y una manía preciosa: cada que llegaba a un lugar nuevo, lo primero que hacía era caminarlo entero, sin mapa, hasta perderse. Decía que así se aprendía de verdad una ciudad.",
  "Le gustaban los amaneceres más que los atardeceres, el café sin azúcar, y las carreteras vacías. No era de muchas palabras, pero cuando hablaba valía la pena poner atención.",
];

const featured = orderedPosts.slice(0, 3);

/* El retrato de la sección «Quién era». */
const PORTRAIT = photo(
  "casa-retrato",
  "Iván de perfil, con camisa blanca abierta y lentes oscuros colgados del cuello, frente a una pared de tabique"
);

/*
  Fotos del mosaico de la portada, por nombre de archivo. Se mezclan
  verticales y horizontales a propósito; el muro las acomoda por columnas.
*/
const MOSAIC_IDS = [
  "colombia-letras",
  "alteno-gradas",
  "guanajuato-escalera",
  "casa-dibujando",
  "agua-flamencos",
  "paseo-alebrije",
  "casa-chamarra",
  "colombia-sombrillas",
];
const mosaic = MOSAIC_IDS.map(
  (id) => allPhotos.find((item) => item.src === `/img/${id}.jpg`)!
);

export default function HomePage() {
  return (
    <>
      {/* --- Portada -------------------------------------------------- */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-36 pb-32 text-center">
        <HeroSky />

        <div className="animate-enter">
          <p className="eyebrow">En memoria de</p>
          <h1 className="display text-display mt-7 text-ink">{site.name}</h1>
          <p className="font-meta mt-8 text-[0.75rem] tracking-[0.4em] text-ink-soft uppercase">
            {site.years}
          </p>
        </div>

        <p
          className="measure text-lede animate-enter mt-14 leading-relaxed text-ink-soft italic"
          style={{ animationDelay: "0.6s" }}
        >
          {site.epigraph}
        </p>

        <a
          href="#comienzo"
          className="font-meta animate-enter absolute bottom-10 flex flex-col items-center gap-3 text-[0.625rem] tracking-[0.3em] text-ink-faint uppercase transition-colors duration-500 hover:text-ink-soft"
          style={{ animationDelay: "1.4s" }}
        >
          Pasa
          <span aria-hidden className="h-12 w-px bg-line" />
        </a>
      </section>

      {/* --- Invitación ----------------------------------------------- */}
      <section id="comienzo" className="shell py-28 sm:py-36">
        <Reveal className="measure-wide space-y-10 text-center">
          <div className="rule" aria-hidden>
            <span />
          </div>
          <p className="text-lede text-balance leading-[1.85] text-ink-soft">
            {INTRO}
          </p>
        </Reveal>
      </section>

      {/* --- Quién era ------------------------------------------------- */}
      <section className="border-y border-line/60 bg-paper-warm py-24 sm:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Photo
              photo={PORTRAIT}
              maxHeight="80vh"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>

          <Reveal delay={200} className="space-y-7 lg:col-span-6 lg:col-start-8">
            <div className="space-y-4">
              <p className="eyebrow">Quién era</p>
              <h2 className="heading text-section text-ink">
                El que siempre proponía salir un día antes
              </h2>
            </div>

            <div className="prose text-ink-soft">
              {BIO.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <Link
              href="/sobre-el"
              className="font-meta link-quiet inline-block text-[0.75rem] tracking-[0.2em] text-sage-deep uppercase"
            >
              Seguir leyendo sobre él
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- Historias ------------------------------------------------- */}
      <section className="shell py-28 sm:py-36">
        <Reveal className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="eyebrow">Sus viajes, sus días</p>
            <h2 className="heading text-section text-ink">Historias</h2>
          </div>
          <Link
            href="/historias"
            className="font-meta link-quiet text-[0.75rem] tracking-[0.2em] text-ink-soft uppercase"
          >
            Ver todas ({orderedPosts.length})
          </Link>
        </Reveal>

        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, index) => (
            <Reveal key={post.slug} delay={index * 160}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* --- Galería --------------------------------------------------- */}
      <section className="border-t border-line/60 bg-paper-warm py-24 sm:py-32">
        <div className="shell space-y-14">
          <Reveal className="space-y-3 text-center">
            <p className="eyebrow">Lo que fotografió</p>
            <h2 className="heading text-section text-ink">Galería</h2>
          </Reveal>

          <Reveal delay={150}>
            <div className="columns-2 gap-3 sm:gap-4 lg:columns-4">
              {mosaic.map((item) => (
                <Link
                  key={item.src}
                  href={`/historias/${item.postSlug}`}
                  className="group mb-3 block break-inside-avoid sm:mb-4"
                  aria-label={item.postTitle}
                >
                  <Photo
                    photo={item}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    imageClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]"
                  />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal className="text-center">
            <Link
              href="/galeria"
              className="font-meta link-quiet text-[0.75rem] tracking-[0.2em] text-sage-deep uppercase"
            >
              Ver todas las fotos
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- Cierre ---------------------------------------------------- */}
      <section className="shell py-28 text-center sm:py-40">
        <Reveal className="measure space-y-8">
          <p className="eyebrow">Si lo conociste</p>
          <h2 className="heading text-section text-ink">
            Cuéntanos algo de él
          </h2>
          <p className="text-ink-soft">
            No hace falta registrarse ni dejar tu correo. Escribe tu nombre y lo
            que te acuerdes, por chiquito que sea.
          </p>
          <Link
            href={`/historias/${orderedPosts[0]!.slug}#recuerdos`}
            className="button"
          >
            Dejar un recuerdo
          </Link>
        </Reveal>
      </section>
    </>
  );
}
