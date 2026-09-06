import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { postsByDate } from "@/content/posts";
import { formatMonth } from "@/lib/format";

export const metadata: Metadata = {
  title: "Historias",
  description:
    "Los viajes, los días cualquiera y las cosas que nos acordamos de él.",
};

export default function HistoriasPage() {
  return (
    <div className="pt-36 pb-28 sm:pt-44">
      <header className="shell mb-24 space-y-5 text-center sm:mb-32">
        <Reveal>
          <p className="eyebrow">Sus viajes, sus días</p>
          <h1 className="heading text-title mt-4 text-ink">Historias</h1>
          <p className="measure text-lede mt-7 leading-relaxed text-ink-soft">
            Cada entrada tiene su espacio de recuerdos al final. Entra a la que
            te llame y deja el tuyo.
          </p>
        </Reveal>
      </header>

      <div className="shell space-y-24 sm:space-y-32">
        {postsByDate.map((post, index) => {
          // Se alterna el lado de la foto para que la lista no caiga en ritmo.
          const imageRight = index % 2 === 1;

          return (
            <Reveal key={post.slug}>
              <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <Link
                  href={`/historias/${post.slug}`}
                  tabIndex={-1}
                  aria-hidden
                  className={`group block lg:col-span-7 ${
                    imageRight ? "lg:order-2 lg:col-start-6" : ""
                  }`}
                >
                  <Photo
                    photo={post.cover}
                    ratio="landscape"
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    imageClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
                  />
                </Link>

                <div
                  className={`space-y-4 lg:col-span-4 ${
                    imageRight ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"
                  }`}
                >
                  <p className="font-meta text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
                    {post.place ? `${post.place} · ` : ""}
                    {formatMonth(post.date)}
                  </p>

                  <h2 className="heading text-2xl text-ink sm:text-3xl">
                    <Link
                      href={`/historias/${post.slug}`}
                      className="transition-colors duration-500 hover:text-sage-deep"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/historias/${post.slug}`}
                    className="font-meta link-quiet inline-block text-[0.75rem] tracking-[0.2em] text-sage-deep uppercase"
                  >
                    Leer la historia
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
