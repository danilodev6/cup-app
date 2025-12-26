export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD for internal use
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function parseDateTimeLocal(dateString: string): Date {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset(); // En minutos
  const argentinaOffset = 180; // Argentina es UTC-3 = 180 minutos

  const adjustedDate = new Date(
    date.getTime() + (offset - argentinaOffset) * 60000,
  );

  return adjustedDate;
}

/**
 * Formatea una fecha para mostrarla en formato argentino
 */
export function formatArgentinianDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  // Usar toLocaleString con la zona horaria de Argentina
  const argentinaDate = new Date(
    d.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    }),
  );

  const day = String(argentinaDate.getDate()).padStart(2, "0");
  const month = String(argentinaDate.getMonth() + 1).padStart(2, "0");
  const year = argentinaDate.getFullYear();
  const hours = String(argentinaDate.getHours()).padStart(2, "0");
  const minutes = String(argentinaDate.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} - ${hours}:${minutes}`;
}

/**
 * Formatea una fecha para knockout matches (con salto de línea)
 */
export function formatArgentinianDateKo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  // Usar toLocaleString con la zona horaria de Argentina
  const argentinaDate = new Date(
    d.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    }),
  );

  const day = String(argentinaDate.getDate()).padStart(2, "0");
  const month = String(argentinaDate.getMonth() + 1).padStart(2, "0");
  const year = argentinaDate.getFullYear();
  const hours = String(argentinaDate.getHours()).padStart(2, "0");
  const minutes = String(argentinaDate.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}\n${hours}:${minutes}`;
}

/**
 * Convierte una fecha de la BD a formato datetime-local para el input
 */
export function toDateTimeLocalValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  // Convertir a hora argentina
  const argentinaDate = new Date(
    d.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    }),
  );

  // Formato: "2024-12-26T20:00"
  const year = argentinaDate.getFullYear();
  const month = String(argentinaDate.getMonth() + 1).padStart(2, "0");
  const day = String(argentinaDate.getDate()).padStart(2, "0");
  const hours = String(argentinaDate.getHours()).padStart(2, "0");
  const minutes = String(argentinaDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
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
