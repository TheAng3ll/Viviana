import Link from "next/link";
import { Photo } from "@/components/photo";
import type { Post } from "@/content/posts";
import { formatMonth } from "@/lib/format";

export function PostCard({
  post,
  priority = false,
}: {
  post: Post;
  priority?: boolean;
}) {
  const meta = [post.place, post.date ? formatMonth(post.date) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article>
      <Link href={`/historias/${post.slug}`} className="group block space-y-5">
        {/*
          La portada conserva su forma, con un límite: una foto de celular muy
          alta se recorta un poco para que las tres tarjetas queden parejas.
        */}
        <Photo
          photo={post.cover}
          clamp={[0.8, 1.05]}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imageClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]"
        />

        <div className="space-y-2.5">
          {meta && (
            <p className="font-meta text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
              {meta}
            </p>
          )}

          <h3 className="heading text-2xl text-ink transition-colors duration-500 group-hover:text-sage-deep">
            {post.title}
          </h3>

          <p className="text-[0.975rem] leading-relaxed text-ink-soft">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
