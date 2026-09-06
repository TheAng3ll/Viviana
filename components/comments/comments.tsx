import { Suspense } from "react";
import { CommentForm } from "@/components/comments/comment-form";
import {
  CommentList,
  CommentListSkeleton,
} from "@/components/comments/comment-list";

export function Comments({ slug }: { slug: string }) {
  return (
    <section
      id="recuerdos"
      aria-labelledby="recuerdos-titulo"
      className="border-t border-line/60 bg-paper-warm py-24 sm:py-32"
    >
      <div className="shell">
        <div className="measure-wide space-y-14">
          <header className="space-y-4 text-center">
            <p className="eyebrow">Para quien lo conoció</p>
            <h2 id="recuerdos-titulo" className="heading text-section text-ink">
              Deja un recuerdo
            </h2>
            <p className="measure text-ink-soft">
              Cualquier cosa sirve: una anécdota, una frase suya, el día que lo
              conociste. Van a quedar aquí, y las vamos a leer todas.
            </p>
          </header>

          <CommentForm slug={slug} />

          <Suspense fallback={<CommentListSkeleton />}>
            <CommentList slug={slug} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
