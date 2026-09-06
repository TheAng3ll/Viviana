"use server";

import { headers } from "next/headers";
import { refresh } from "next/cache";
import { posts } from "@/content/posts";
import type { CommentFormState } from "@/lib/comment-form-state";
import { addComment } from "@/lib/comments";

const LIMITS = {
  name: { min: 2, max: 60 },
  relation: { max: 80 },
  message: { min: 3, max: 1500 },
} as const;

/** Los mensajes con enlaces son casi siempre spam en un sitio como este. */
const LINK_PATTERN =
  /(https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(com|net|org|io|ru|cn|xyz|top|info|shop|club|online|site|link|biz|live)\b)/i;

/** Caracteres de control invisibles, que sólo sirven para romper el formato. */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Límite de envíos por IP, en memoria. Se reinicia cuando se reinicia el
 * servidor, y eso está bien: sólo busca frenar a un bot que dispara en
 * ráfaga, no llevar un registro.
 */
const RATE_LIMIT = { max: 4, windowMs: 10 * 60 * 1000 };
const recentPosts = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentPosts.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT.windowMs
  );

  if (hits.length >= RATE_LIMIT.max) {
    recentPosts.set(ip, hits);
    return true;
  }

  hits.push(now);
  recentPosts.set(ip, hits);

  // Limpieza ocasional para que el Map no crezca sin límite.
  if (recentPosts.size > 500) {
    for (const [key, times] of recentPosts) {
      if (times.every((time) => now - time >= RATE_LIMIT.windowMs)) {
        recentPosts.delete(key);
      }
    }
  }
  return false;
}

async function clientIp() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return list.get("x-real-ip") ?? "desconocida";
}

/** Quita caracteres de control y colapsa los saltos de línea de más. */
function clean(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function submitComment(
  _previous: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const slug = clean(formData.get("slug"));
  const name = clean(formData.get("name"));
  const relation = clean(formData.get("relation"));
  const message = clean(formData.get("message"));
  const values = { name, relation, message };

  if (!posts.some((post) => post.slug === slug)) {
    return { status: "error", message: "No encontramos esa entrada.", values };
  }

  // Campo trampa: está oculto, una persona nunca lo llena. Se responde con
  // éxito a propósito para que el bot no aprenda que fue rechazado.
  if (clean(formData.get("sitio-web"))) {
    return { status: "ok", message: "Gracias por tu recuerdo." };
  }

  const errors: CommentFormState["errors"] = {};

  if (name.length < LIMITS.name.min) {
    errors.name = "Escribe tu nombre, aunque sea sólo el de pila.";
  } else if (name.length > LIMITS.name.max) {
    errors.name = `El nombre no puede pasar de ${LIMITS.name.max} caracteres.`;
  }

  if (message.length < LIMITS.message.min) {
    errors.message = "Escribe tu recuerdo antes de enviarlo.";
  } else if (message.length > LIMITS.message.max) {
    errors.message = `El mensaje no puede pasar de ${LIMITS.message.max} caracteres.`;
  } else if (LINK_PATTERN.test(message)) {
    errors.message =
      "Para evitar spam no aceptamos mensajes con enlaces. Cuéntalo con tus palabras.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  if (isRateLimited(await clientIp())) {
    return {
      status: "error",
      message:
        "Ya enviaste varios recuerdos seguidos. Espera unos minutos e inténtalo otra vez.",
      values,
    };
  }

  try {
    await addComment(slug, {
      name,
      relation: relation.slice(0, LIMITS.relation.max) || undefined,
      message,
    });
  } catch (error) {
    console.error("No se pudo guardar el comentario:", error);
    return {
      status: "error",
      message:
        "No pudimos guardar tu recuerdo. Vuelve a intentarlo en un momento.",
      values,
    };
  }

  // Vuelve a pedir la lista de recuerdos al servidor para que aparezca el nuevo.
  refresh();

  return { status: "ok", message: "Gracias por tu recuerdo." };
}
