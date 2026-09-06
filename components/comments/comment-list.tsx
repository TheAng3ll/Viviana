import { connection } from "next/server";
import { getComments } from "@/lib/comments";
import { formatRelative } from "@/lib/format";

/**
 * Los recuerdos ya publicados, del más nuevo al más viejo.
 *
 * `connection()` deja esta parte fuera del prerenderizado: el resto de la
 * entrada se sirve como HTML estático, y sólo esta lista se arma en cada
 * visita, así que un recuerdo nuevo se ve de inmediato.
 */
export async function CommentList({ slug }: { slug: string }) {
  await connection();
  const comments = (await getComments(slug)).reverse();

  if (comments.length === 0) {
    return (
      <p className="border-t border-line/70 pt-10 text-center text-ink-faint italic">
        Todavía no hay recuerdos en esta entrada. Puedes ser quien empiece.
      </p>
    );
  }

  return (
    <section aria-label="Recuerdos publicados" className="space-y-10">
      <p className="font-meta text-[0.6875rem] tracking-[0.2em] text-ink-faint uppercase">
        {comments.length === 1
          ? "Un recuerdo"
          : `${comments.length} recuerdos`}
      </p>

      <ul className="space-y-10">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="flex gap-4 border-t border-line/70 pt-8 sm:gap-6"
          >
            <span
              aria-hidden
              className="heading mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-sage/12 text-base text-sage-deep"
            >
              {comment.name.trim().charAt(0).toUpperCase()}
            </span>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="heading text-lg text-ink">{comment.name}</h3>
                {comment.relation && (
                  <span className="text-[0.9rem] text-ink-faint italic">
                    {comment.relation}
                  </span>
                )}
                <time
                  dateTime={comment.createdAt}
                  className="font-meta ml-auto text-[0.75rem] text-ink-faint"
                >
                  {formatRelative(comment.createdAt)}
                </time>
              </div>

              {/* `whitespace-pre-line` respeta los saltos de línea que escribió. */}
              <p className="whitespace-pre-line text-ink-soft">
                {comment.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Se muestra mientras se leen los recuerdos del disco. */
export function CommentListSkeleton() {
  return (
    <p className="border-t border-line/70 pt-10 text-center text-ink-faint italic">
      Cargando los recuerdos…
    </p>
  );
}
