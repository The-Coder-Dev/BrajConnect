/**
 * Converts a string into a URL-safe slug.
 * 
 * - Converts to lowercase
 * - Replaces spaces and underscores with hyphens
 * - Removes non-alphanumeric characters (except hyphens)
 * - Trims consecutive hyphens and leading/trailing hyphens
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, "") // Remove non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
}
