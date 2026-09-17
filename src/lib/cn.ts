/** Joins class names and skips empty values: cn("a", isOpen && "b") */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
