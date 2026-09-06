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
  return (
    <article>
      <Link href={`/historias/${post.slug}`} className="group block space-y-5">
        <Photo
          photo={post.cover}
          ratio="portrait"
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imageClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]"
        />

        <div className="space-y-2.5">
          <p className="font-meta text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
            {post.place ? `${post.place} · ` : ""}
            {formatMonth(post.date)}
          </p>

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
