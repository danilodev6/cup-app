export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD for internal use
}

export const toLocalInput = (d: Date | string) =>
  new Date(d).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm  (local)

export const fromLocalInput = (iso: string) => new Date(iso).toISOString();

export const fmtAR = (d: Date | string) =>
  new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(d));

/**
 * Mostrar fecha y hora en Argentina (solo display)
 */
export function formatArgentinianDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Variante KO
 */
export function formatArgentinianDateKo(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(date))
    .replace(",", "\n");
}

export function formatArgentinianDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
