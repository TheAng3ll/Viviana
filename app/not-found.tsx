import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70svh] flex-col items-center justify-center gap-7 py-32 text-center">
      <p className="eyebrow">Página no encontrada</p>
      <h1 className="heading text-title measure text-ink">
        Este camino no lleva a ningún lado
      </h1>
      <p className="measure text-ink-soft">
        Puede que el enlace esté mal escrito o que la entrada ya no exista.
      </p>
      <Link href="/" className="button">
        Volver al inicio
      </Link>
    </div>
  );
}
