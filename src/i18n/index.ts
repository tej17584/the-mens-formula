import es from "@/i18n/locales/es.json";

type Primitive = string | number | boolean | null | undefined;
type DotPath<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive
        ? K
        : K | `${K}.${DotPath<T[K]>}`;
    }[keyof T & string];

export type TranslationKey = DotPath<typeof es>;

function valueFor(key: TranslationKey): string {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current)
      return (current as Record<string, unknown>)[part];
    return undefined;
  }, es);
  return typeof value === "string" ? value : key;
}

export function translate(key: TranslationKey): string {
  return valueFor(key);
}

/** Static Spanish translator. The API remains ready for a locale provider later. */
export function useTranslations() {
  return translate;
}
