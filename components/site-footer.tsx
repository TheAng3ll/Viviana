import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/60 bg-paper-warm">
      <div className="shell flex flex-col items-center gap-8 py-20 text-center">
        {/* Una luz pequeña, como una veladora encendida. */}
        <span
          aria-hidden
          className="animate-breathe block h-2 w-2 rounded-full bg-amber shadow-[0_0_18px_6px_var(--color-amber-soft)]"
        />

        <p className="pull-quote measure text-ink-soft">{site.epigraph}</p>

        <div className="rule w-full max-w-sm" aria-hidden>
          <span />
        </div>

        <p className="font-meta text-[0.8125rem] leading-relaxed text-ink-faint">
          Este sitio lo hicimos su familia y sus amigos, para tenerlo cerca.
          <br />
          Si tienes una foto o una historia suya,{" "}
          <Link href="/historias" className="link-quiet text-ink-soft">
            déjala en cualquier entrada
          </Link>
          .
        </p>

        <p className="font-meta text-[0.6875rem] tracking-[0.2em] uppercase text-ink-faint/80">
          En memoria de {site.fullName} · {site.years}
        </p>
      </div>
    </footer>
  );
}
