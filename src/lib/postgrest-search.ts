/** Escape user input embedded in PostgREST `.or()` / `ilike` filter strings. */
export function escapePostgrestSearchTerm(term: string) {
  return term
    .trim()
    .replaceAll("\\", "\\\\")
    .replaceAll(",", "\\,")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}