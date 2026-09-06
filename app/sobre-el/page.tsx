import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Sobre él",
  description: `Quién fue ${site.fullName}, contado por quienes lo conocieron.`,
};

/*
  TEXTO DE MUESTRA. Todo lo de este archivo está para que Viviana lo reemplace
  por lo que ella quiera contar. La estructura aguanta secciones más largas o
  más cortas sin tocar el diseño.
*/
const SECTIONS = [
  {
    title: "De dónde venía",
    paragraphs: [
      "Nacio en un rinconcito de los altos de Jalisco, el de enmedio de 3 hermanos, donde siempre había alguien cocinando. Desde niño era creativo le encantaba crear cosas nuevas, vestir diferente y ser único en lo que hacía.",
      "Viajo lo que quiso y hasta donde le alcanzó tenía muchos lugares aún por visitar pero estoy segura que desde el plano espiritual está viajando sin barreras.",
    ],
  },
  {
    title: "Lo que le gustaba",
    paragraphs: [
      "Manejar de noche. El café de olla de la esquina. Las canciones tristes puestas a todo volumen. Llegar a los lugares antes que nadie. Los perros ajenos. Discutir de futbol sin tener demasiada información.",
      "Y sobre todo, irse. Le podías decir «vámonos» un jueves a las once de la noche y ya estaba buscando las llaves.",
    ],
  },
  {
    title: "Cómo lo recordamos",
    paragraphs: [
      "Hace seis meses que no está y todavía nos pasa: vemos un cielo bonito y le queremos mandar la foto. Esa costumbre no se va a quitar, y creemos que está bien que no se quite.",
      "Este sitio es de él, pero también es de todos los que lo quisieron. Si tú eres uno de ellos, escribe. No hay una forma correcta de hacerlo.",
    ],
  },
];

/* Detalles chiquitos. Son los que más se extrañan. */
const LITTLE_THINGS = [
  "Nunca aprendió a doblar un mapa",
  "Le decía «jefa» a mi mamá",
  "Se sabía todos los nombres de los perros de la cuadra",
  "Llegaba temprano a todo, menos a las bodas",
  "Odiaba el cilantro con una pasión rara",
  "Guardaba los boletos de todos los camiones",
];

export default function SobreElPage() {
  return (
    <div className="pt-36 pb-28 sm:pt-44">
      <header className="shell mb-16 space-y-5 text-center">
        <Reveal>
          <p className="eyebrow">Quién era</p>
          <h1 className="heading text-title mt-4 text-ink">{site.fullName}</h1>
          <p className="font-meta mt-5 text-[0.75rem] tracking-[0.35em] text-ink-faint uppercase">
            {site.years}
          </p>
        </Reveal>
      </header>

      <Reveal className="shell mb-20 sm:mb-28">
        <div className="measure-wide">
          <Photo
            photo={{
              src: "/img/retrato.svg",
              alt: "Retrato de Iván, de pie contra una pared iluminada",
              caption:
                "Una de las últimas fotos que le tomamos. Se estaba riendo de algo que ya nadie recuerda.",
            }}
            ratio="landscape"
            priority
            sizes="(max-width: 768px) 100vw, 46rem"
            showCaption
          />
        </div>
      </Reveal>

      <div className="shell space-y-20 sm:space-y-24">
        {SECTIONS.map((section, index) => (
          <Reveal key={section.title}>
            <section className="measure space-y-5">
              <h2 className="heading text-2xl text-ink">{section.title}</h2>
              <div className="prose text-ink-soft">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            {index === 0 && (
              <p className="pull-quote measure-wide mt-20 text-center">
                {site.epigraph}
              </p>
            )}
          </Reveal>
        ))}

        <Reveal>
          <section className="measure-wide space-y-8 border-t border-line/70 pt-16">
            <h2 className="heading text-center text-2xl text-ink">
              Cosas suyas
            </h2>
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {LITTLE_THINGS.map((thing) => (
                <li
                  key={thing}
                  className="flex gap-3 text-ink-soft before:mt-[0.7em] before:h-px before:w-4 before:shrink-0 before:bg-line before:content-['']"
                >
                  {thing}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal className="measure space-y-7 text-center">
          <div className="rule" aria-hidden>
            <span />
          </div>
          <p className="text-ink-soft">
            Sus viajes y sus días están contados uno por uno en las historias.
          </p>
          <Link href="/historias" className="button">
            Ver las historias
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
