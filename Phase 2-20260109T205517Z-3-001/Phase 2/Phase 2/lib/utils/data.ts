/**
 * Extract data from API response that could be an array or an object with array property
 */
export function extractArrayFromResponse<T>(
  response: T[] | Record<string, unknown>,
  arrayKey?: string
): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (arrayKey && arrayKey in response) {
    const value = response[arrayKey];
    return Array.isArray(value) ? (value as T[]) : [];
  }

  // Try to find an array property automatically
  const firstArrayProp = Object.values(response).find(Array.isArray);
  return (firstArrayProp as T[]) || [];
}
/**
 * Safe navigation helper for nested objects
 */
export function get<T>(
  obj: unknown,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result as T | undefined) ?? defaultValue;
}

/**
 * Check if a value is defined and not null
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
