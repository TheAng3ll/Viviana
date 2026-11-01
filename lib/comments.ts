import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

/**
 * Guarda los recuerdos que deja la gente.
 *
 * En el servidor (Hostinger) van a una base MySQL: la variable de entorno
 * DATABASE_URL trae la conexión y la escribe el propio panel al crear la base.
 * La tabla se crea sola la primera vez que se usa.
 *
 * Sin DATABASE_URL (en local) se guardan en archivos JSON, uno por entrada,
 * en `data/comentarios/`, o en la carpeta que diga DATA_DIR. Así `npm run dev`
 * no necesita una base de datos.
 */
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

type Store = {
  list(slug: string): Promise<Comment[]>;
  add(slug: string, comment: Comment): Promise<void>;
};

/** Evita que un slug manipulado escape de la carpeta de datos o ensucie la consulta. */
function assertSlug(slug: string) {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    throw new Error(`Slug inválido: ${slug}`);
  }
}

/* --- MySQL --------------------------------------------------------------- */

function mysqlStore(url: string): Store {
  const pool = mysql.createPool({
    uri: url,
    connectionLimit: 5,
    // Las fechas se guardan y se leen como texto, sin que el driver las
    // convierta a la zona horaria del servidor.
    dateStrings: true,
    charset: "utf8mb4",
  });

  // La tabla se crea una vez por proceso; las demás llamadas esperan a esta.
  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS recuerdos (
      id         CHAR(36)     NOT NULL,
      slug       VARCHAR(80)  NOT NULL,
      name       VARCHAR(60)  NOT NULL,
      relation   VARCHAR(80)  NULL,
      message    TEXT         NOT NULL,
      created_at DATETIME(3)  NOT NULL,
      PRIMARY KEY (id),
      INDEX idx_slug_created (slug, created_at)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  type Row = {
    id: string;
    name: string;
    relation: string | null;
    message: string;
    created_at: string;
  };

  /** "2026-11-01 22:10:05.123" (UTC) -> ISO. */
  const toIso = (value: string) => `${value.replace(" ", "T")}Z`;
  /** ISO -> "2026-11-01 22:10:05.123" para DATETIME. */
  const toSql = (iso: string) => iso.replace("T", " ").replace("Z", "");

  return {
    async list(slug) {
      await ready;
      const [rows] = await pool.query<(Row & mysql.RowDataPacket)[]>(
        `SELECT id, name, relation, message, created_at
           FROM recuerdos
          WHERE slug = ?
          ORDER BY created_at ASC`,
        [slug]
      );
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        ...(row.relation ? { relation: row.relation } : {}),
        message: row.message,
        createdAt: toIso(row.created_at),
      }));
    },

    async add(slug, comment) {
      await ready;
      await pool.execute(
        `INSERT INTO recuerdos (id, slug, name, relation, message, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          comment.id,
          slug,
          comment.name,
          comment.relation ?? null,
          comment.message,
          toSql(comment.createdAt),
        ]
      );
    },
  };
}

/* --- Archivos JSON (local) ----------------------------------------------- */

function fileStore(): Store {
  const dataDir = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(process.cwd(), "data");
  const dir = path.join(dataDir, "comentarios");
  const fileFor = (slug: string) => path.join(dir, `${slug}.json`);

  /**
   * Una cola de escritura por entrada. Node atiende varias peticiones a la
   * vez, así que sin esto dos personas comentando al mismo tiempo podrían
   * leer el mismo archivo y una sobrescribiría a la otra.
   */
  const queues = new Map<string, Promise<unknown>>();
  const queue = <T>(slug: string, task: () => Promise<T>): Promise<T> => {
    const previous = queues.get(slug) ?? Promise.resolve();
    const next = previous.then(task, task);
    queues.set(slug, next.catch(() => {}));
    return next;
  };

  const list = async (slug: string): Promise<Comment[]> => {
    try {
      const raw = await readFile(fileFor(slug), "utf8");
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Comment[]) : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  };

  return {
    list,
    add: (slug, comment) =>
      queue(slug, async () => {
        const existing = await list(slug);
        await mkdir(dir, { recursive: true });
        // Se escribe a un temporal y se renombra: si el proceso muere a
        // media escritura, el archivo bueno sigue intacto.
        const file = fileFor(slug);
        const temp = `${file}.${process.pid}.tmp`;
        await writeFile(
          temp,
          JSON.stringify([...existing, comment], null, 2),
          "utf8"
        );
        await rename(temp, file);
      }),
  };
}

/* ------------------------------------------------------------------------- */

let store: Store | undefined;

function getStore(): Store {
  if (!store) {
    // Se lee en tiempo de ejecución, no al compilar: en Hostinger la variable
    // existe cuando la aplicación arranca, no cuando se hace el build.
    const url = process.env["DATABASE_URL"];
    store = url ? mysqlStore(url) : fileStore();
  }
  return store;
}

export async function getComments(slug: string): Promise<Comment[]> {
  assertSlug(slug);
  return getStore().list(slug);
}

export async function countComments(slug: string): Promise<number> {
  return (await getComments(slug)).length;
}

export async function addComment(
  slug: string,
  input: Pick<Comment, "name" | "relation" | "message">
): Promise<Comment> {
  assertSlug(slug);
  const comment: Comment = {
    id: randomUUID(),
    name: input.name,
    ...(input.relation ? { relation: input.relation } : {}),
    message: input.message,
    createdAt: new Date().toISOString(),
  };
  await getStore().add(slug, comment);
  return comment;
}
