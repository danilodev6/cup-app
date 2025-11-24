export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD for internal use
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function formatArgentinianDate(dateString: string): string {
  const date = parseDate(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}
