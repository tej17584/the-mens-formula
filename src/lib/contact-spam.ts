import { siteConfig } from "@/lib/site-config";

export type ContactPayload = {
  name: string;
  contact: string;
  message: string;
};

const minElapsedMs = 2_500;
const maxElapsedMs = 6 * 60 * 60 * 1_000;
const spamScoreThreshold = 4;

const spamSignals: { pattern: RegExp; weight: number }[] = [
  { pattern: /unsubscribe/i, weight: 4 },
  { pattern: /instagrow/i, weight: 5 },
  { pattern: /targeted followers/i, weight: 4 },
  { pattern: /instagram report/i, weight: 4 },
  { pattern: /no bots/i, weight: 3 },
  { pattern: /no card needed/i, weight: 3 },
  { pattern: /organic(?:ally)? grow/i, weight: 3 },
  { pattern: /grow (?:your )?instagram/i, weight: 4 },
  { pattern: /buy followers/i, weight: 4 },
  { pattern: /free (?:3|three) days/i, weight: 3 },
  { pattern: /100%\s*manual/i, weight: 3 },
  { pattern: /peri[oó]dicos digitales/i, weight: 4 },
  { pattern: /red de peri[oó]dicos/i, weight: 4 },
  { pattern: /publicar una noticia/i, weight: 4 },
  { pattern: /prensayseo/i, weight: 5 },
  { pattern: /garant[ií]a de devoluci[oó]n/i, weight: 3 },
  { pattern: /tarifas desde/i, weight: 3 },
  { pattern: /guest posts?/i, weight: 4 },
  { pattern: /link building/i, weight: 4 },
  { pattern: /seo (?:agency|package|service|press)/i, weight: 4 },
];

function allowedHost() {
  try {
    return new URL(siteConfig.url).hostname.replace(/^www\./, "");
  } catch {
    return "themensformula.store";
  }
}

function hasExternalUrl(text: string) {
  const host = allowedHost();
  const urls = text.match(/https?:\/\/[^\s<>"]+/gi) ?? [];
  const foreign = urls.filter((value) => {
    try {
      const hostname = new URL(value).hostname.replace(/^www\./, "");
      return hostname !== host && hostname !== "localhost";
    } catch {
      return true;
    }
  });
  if (foreign.length) return true;
  return /(?:^|\s)www\.(?!themensformula\.store)/i.test(text);
}

export function contactSpamScore(payload: ContactPayload) {
  const text = `${payload.name}\n${payload.contact}\n${payload.message}`;
  let score = 0;
  if (hasExternalUrl(text)) score += 4;
  for (const signal of spamSignals) {
    if (signal.pattern.test(text)) score += signal.weight;
  }
  const mentionsLlm = /chatgpt|openai/i.test(text);
  const mentionsPress =
    /prensa|peri[oó]dico|noticia|posicionamiento|\bseo\b/i.test(text);
  if (mentionsLlm && mentionsPress) score += 4;
  if (payload.message.length > 900 && score > 0) score += 1;
  return score;
}

export function isContactSpam(payload: ContactPayload) {
  return contactSpamScore(payload) >= spamScoreThreshold;
}

export function isHoneypotTriggered(formData: FormData) {
  return ["company", "website"].some((name) => {
    const value = formData.get(name);
    return typeof value === "string" && value.trim().length > 0;
  });
}

export function isImplausibleFormTiming(formStartedAt: FormDataEntryValue | null) {
  const startedAt = Number(formStartedAt);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  const elapsed = Date.now() - startedAt;
  return elapsed < minElapsedMs || elapsed > maxElapsedMs;
}