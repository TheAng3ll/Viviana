"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso en milisegundos, para que los elementos de una fila entren escalonados. */
  delay?: number;
};

/**
 * Hace que su contenido aparezca despacio la primera vez que entra en pantalla.
 *
 * Escribe el atributo directamente en el nodo en vez de guardar estado: no hay
 * re-render, y si el navegador no soporta IntersectionObserver el contenido
 * simplemente se queda visible.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => node.setAttribute("data-visible", "true");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        show();
      },
      // Se dispara un poco antes de que el elemento llegue al borde inferior,
      // para que la aparición ya vaya a medias cuando el ojo lo alcanza.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
