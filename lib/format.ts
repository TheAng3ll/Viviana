const LONG_DATE = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const MONTH_YEAR = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "14 de enero de 2024" */
export function formatDate(iso: string) {
  return LONG_DATE.format(new Date(iso));
}

/** "enero de 2024" — para las tarjetas, donde el día no aporta. */
export function formatMonth(iso: string) {
  return MONTH_YEAR.format(new Date(iso));
}

/**
 * "hace 3 días" para los recuerdos recientes; la fecha completa para los
 * viejos, porque a partir de cierto punto "hace 8 meses" deja de decir algo.
 */
export function formatRelative(iso: string) {
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);

  if (days < 1) return "hoy";
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "hace una semana" : `hace ${weeks} semanas`;
  }
  return formatDate(iso);
}
