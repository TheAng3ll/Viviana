/**
 * El estado del formulario de recuerdos.
 *
 * Vive aparte de `lib/actions.ts` porque un archivo marcado con "use server"
 * sólo puede exportar funciones asíncronas: cualquier objeto o constante que
 * exporte revienta el servidor al primer render.
 */
export type CommentFormState = {
  status: "idle" | "ok" | "error";
  /** Mensaje general, se muestra arriba del formulario. */
  message?: string;
  /** Errores por campo. */
  errors?: Partial<Record<"name" | "message", string>>;
  /** Lo que ya había escrito, para no perderlo si algo falla. */
  values?: { name: string; relation: string; message: string };
};

export const initialCommentFormState: CommentFormState = { status: "idle" };
