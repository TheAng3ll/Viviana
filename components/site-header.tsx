"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

/**
 * Encabezado fijo. Arriba del todo es invisible para no competir con la
 * portada; en cuanto se hace scroll aparece un fondo translúcido.
 *
 * No hay menú de hamburguesa a propósito: en pantallas chicas el nombre pasa
 * arriba y los enlaces abajo, y así todo queda siempre a la vista.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        scrolled
          ? "border-b border-line/70 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex flex-col items-center gap-2.5 py-4 sm:flex-row sm:justify-between sm:gap-6 sm:py-5">
        <Link
          href="/"
          className="heading text-lg tracking-[0.02em] text-ink transition-opacity duration-500 hover:opacity-70"
        >
          {site.name}
        </Link>

        <nav aria-label="Secciones del sitio">
          <ul className="font-meta flex items-center gap-6 text-[0.6875rem] font-medium tracking-[0.2em] uppercase sm:gap-8">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`link-quiet pb-0.5 transition-colors duration-500 ${
                      active ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
