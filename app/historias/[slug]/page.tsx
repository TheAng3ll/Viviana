import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments/comments";
import { Photo } from "@/components/photo";
import { PhotoFlow } from "@/components/photo-flow";
import { Reveal } from "@/components/reveal";
import { getPost, orderedPosts, posts } from "@/content/posts";
import { formatDate } from "@/lib/format";

/** Deja todas las entradas listas como HTML al compilar. */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/historias/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [
        {
          url: post.cover.src,
          alt: post.cover.alt,
          width: post.cover.width,
          height: post.cover.height,
        },
      ],
    },
  };
}

export default async function PostPage(props: PageProps<"/historias/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  // La frase destacada va después del segundo párrafo: ya entraste en la
  // historia, y todavía queda texto por delante.
  const opening = post.body.slice(0, 2);
  const rest = post.body.slice(2);

  const index = orderedPosts.findIndex((item) => item.slug === post.slug);
  const previous = orderedPosts[index + 1];
  const next = orderedPosts[index - 1];

  return (
    <article>
      <header className="shell pt-36 pb-14 text-center sm:pt-44">
        <Reveal className="measure-wide space-y-6">
          {(post.place || post.date) && (
            <p className="eyebrow">
              {post.place}
              {post.place && post.date ? " · " : ""}
              {post.date && (
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              )}
            </p>
          )}
          <h1 className="heading text-title text-ink">{post.title}</h1>
          <p className="text-lede leading-relaxed text-ink-soft italic">
            {post.excerpt}
          </p>
        </Reveal>
      </header>

      {/*
        La foto manda. Una horizontal ocupa el ancho; una vertical se encoge
        hasta caber en la pantalla y se centra, sin recortar nada.
      */}
      <Reveal className="shell">
        <Photo
          photo={post.cover}
          maxHeight="85vh"
          priority
          sizes="(max-width: 1024px) 100vw, 78rem"
          showCaption
        />
      </Reveal>

      <div className="shell py-20 sm:py-24">
        <div className="measure prose text-ink-soft">
          {opening.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {post.pullQuote && (
          <Reveal className="measure-wide py-14 text-center">
            <p className="pull-quote">{post.pullQuote}</p>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="measure prose text-ink-soft">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        {post.gallery && post.gallery.length > 0 && (
          <Reveal className="measure-wide mt-20 sm:mt-24">
            <PhotoFlow photos={post.gallery} />
          </Reveal>
        )}
      </div>

      {/* --- Entrada anterior y siguiente ------------------------------ */}
      {(previous || next) && (
        <nav
          aria-label="Otras historias"
          className="shell grid gap-8 border-t border-line/60 py-14 sm:grid-cols-2"
        >
          {previous ? (
            <Link href={`/historias/${previous.slug}`} className="group">
              <p className="font-meta text-[0.6875rem] tracking-[0.2em] text-ink-faint uppercase">
                Anterior
              </p>
              <p className="heading mt-2 text-xl text-ink transition-colors duration-500 group-hover:text-sage-deep">
                {previous.title}
              </p>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/historias/${next.slug}`}
              className="group sm:text-right"
            >
              <p className="font-meta text-[0.6875rem] tracking-[0.2em] text-ink-faint uppercase">
                Siguiente
              </p>
              <p className="heading mt-2 text-xl text-ink transition-colors duration-500 group-hover:text-sage-deep">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      )}

      <Comments slug={post.slug} />
    </article>
  );
}
