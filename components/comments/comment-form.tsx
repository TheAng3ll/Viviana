"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitComment } from "@/lib/actions";
import { initialCommentFormState } from "@/lib/comment-form-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="button" disabled={pending}>
      {pending ? "Enviando…" : "Dejar el recuerdo"}
    </button>
  );
}

export function CommentForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(
    submitComment,
    initialCommentFormState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Al enviarse bien se vacían los campos, para que quede claro que ya se fue
  // y para que quien quiera escribir otro empiece en limpio.
  useEffect(() => {
    if (state.status === "ok") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />

      {/*
        Campo trampa para bots: está fuera de la pantalla y no lo anuncia el
        lector de pantalla, así que sólo un programa automático lo llena.
      */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px" }}>
        <label>
          No llenes este campo
          <input
            type="text"
            name="sitio-web"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {state.status !== "idle" && state.message && (
        <p
          role="status"
          className={`rounded border-l-2 py-3 pl-4 text-[0.95rem] ${
            state.status === "ok"
              ? "border-sage bg-sage/8 text-sage-deep"
              : "border-amber bg-amber/8 text-ink-soft"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Tu nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={60}
            autoComplete="name"
            defaultValue={state.values?.name}
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className="field-input"
            placeholder="María"
          />
          {state.errors?.name && (
            <p id="name-error" className="mt-2 text-sm text-amber">
              {state.errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="relation" className="field-label">
            De dónde lo conocías{" "}
            <span className="normal-case tracking-normal opacity-70">
              (opcional)
            </span>
          </label>
          <input
            id="relation"
            name="relation"
            type="text"
            maxLength={80}
            defaultValue={state.values?.relation}
            className="field-input"
            placeholder="De la prepa"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Tu recuerdo
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={1500}
          defaultValue={state.values?.message}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={
            state.errors?.message ? "message-error" : "message-hint"
          }
          className="field-input resize-y"
          placeholder="Una anécdota, algo que te dijo, una foto que tienes en la cabeza…"
        />
        {state.errors?.message ? (
          <p id="message-error" className="mt-2 text-sm text-amber">
            {state.errors.message}
          </p>
        ) : (
          <p
            id="message-hint"
            className="font-meta mt-2 text-[0.75rem] text-ink-faint"
          >
            No hace falta registrarse. Tu mensaje se publica tal cual, con el
            nombre que escribas.
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
