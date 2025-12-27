export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD for internal use
}

export const toLocalInput = (d: Date | string) =>
  new Date(d).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm  (local)

export const fromLocalInput = (iso: string) => new Date(iso).toISOString();

export function fmtAR(d: Date | string | undefined): string {
  if (!d) return ""; // ← guard
  const date = new Date(d);
  date.setHours(date.getHours() + 3); // Add 3 hours for Argentine timezone
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hour = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${min}`;
}

export function fmtARid(d: Date | string | undefined): string {
  if (!d) return ""; // ← guard
  const date = new Date(d);
  date.setHours(date.getHours());
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hour = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${min}`;
}

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
