export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD for internal use
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function parseDateTimeLocal(value: string): Date {
  // value: "2024-12-26T20:00"
  return new Date(value);
}

/**
 * Convierte una fecha de la DB (UTC)
 * a value válido para datetime-local
 */
export function toDateTimeLocalValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  // convertir UTC → hora local del navegador
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
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

export function formatDateTimeLocal(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}
