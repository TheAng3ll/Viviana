import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Guarda los recuerdos que deja la gente en archivos JSON, uno por entrada.
 *
 * Sin base de datos: en el plan de Node.js de Hostinger la aplicación corre en
 * un solo proceso con disco persistente, así que un archivo por entrada es
 * suficiente y es fácil de respaldar (basta con copiar la carpeta).
 *
 * La carpeta se puede mover fuera del proyecto con la variable de entorno
 * DATA_DIR, para que un `git pull` en el servidor nunca la toque.
 */
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

const COMMENTS_DIR = path.join(DATA_DIR, "comentarios");

export type Comment = {
  id: string;
  /** Quién lo escribe. */
  name: string;
  /** De dónde lo conocía. Opcional. */
  relation?: string;
  message: string;
  /** Fecha ISO en UTC. */
  createdAt: string;
};

/**
 * Una cola de escritura por entrada. Node atiende varias peticiones a la vez,
 * así que sin esto dos personas comentando al mismo tiempo podrían leer el
 * mismo archivo y una sobrescribiría a la otra.
 */
const writeQueues = new Map<string, Promise<unknown>>();

function queue<T>(slug: string, task: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(slug) ?? Promise.resolve();
  const next = previous.then(task, task);
  // Se mantiene la cadena viva aunque una escritura falle.
  writeQueues.set(
    slug,
    next.catch(() => {})
  );
  return next;
}

/** Evita que un slug manipulado escape de la carpeta de datos. */
function fileFor(slug: string) {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    throw new Error(`Slug inválido: ${slug}`);
  }
  return path.join(COMMENTS_DIR, `${slug}.json`);
}

export async function getComments(slug: string): Promise<Comment[]> {
  try {
    const raw = await readFile(fileFor(slug), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Comment[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function countComments(slug: string): Promise<number> {
  return (await getComments(slug)).length;
}

export async function addComment(
  slug: string,
  input: Pick<Comment, "name" | "relation" | "message">
): Promise<Comment> {
  return queue(slug, async () => {
    const comment: Comment = {
      id: randomUUID(),
      name: input.name,
      ...(input.relation ? { relation: input.relation } : {}),
      message: input.message,
      createdAt: new Date().toISOString(),
    };

    const existing = await getComments(slug);
    const file = fileFor(slug);
    await mkdir(COMMENTS_DIR, { recursive: true });

    // Se escribe a un temporal y se renombra: si el proceso muere a media
    // escritura, el archivo bueno sigue intacto en lugar de quedar truncado.
    const temp = `${file}.${process.pid}.tmp`;
    await writeFile(temp, JSON.stringify([...existing, comment], null, 2), "utf8");
    await rename(temp, file);

    return comment;
  });
}
