/**
 * Format a date string to a readable format
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Format a date string to a short format
 */
export function formatShortDate(dateString: string): string {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

/**
 * Alias for isFutureDate for consistency
 */
export function isUpcoming(dateString: string): boolean {
  return isFutureDate(dateString);
}

/**
 * Sort items by date in descending order (newest first)
 */
export function sortByDateDesc<
  T extends { createdAt?: string; startAt?: string }
>(items: T[]): T[] {
  return items.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.startAt || 0).getTime();
    const dateB = new Date(b.createdAt || b.startAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Format time from date string
 */
export function formatTime(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date and time together
 */
export function formatDateTime(dateString: string | Date): string {
  return `${formatDate(
    typeof dateString === "string" ? dateString : dateString.toISOString()
  )} at ${formatTime(dateString)}`;
}

/**
 * Format date for input fields (YYYY-MM-DDTHH:MM)
 */
export function formatDateForInput(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Get time until event
 */
export function timeUntil(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) return "Past event";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} away`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} away`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} away`;

  return "Starting soon";
}
