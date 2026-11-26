export const DEFAULT_SOCIAL_URLS = {
  instagram: "https://www.instagram.com/themensformulagt",
  facebook: "https://www.facebook.com/share/1EL1L8pdwk/",
  tiktok: "https://www.tiktok.com/@themensformula",
} as const;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeWhatsappNumber(value: string) {
  const digits = digitsOnly(value);
  if (digits.length === 8) return `502${digits}`;
  return digits;
}

export function whatsappHref(number: string, text?: string) {
  const digits = digitsOnly(number);
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function formatWhatsappNumber(number: string) {
  const digits = digitsOnly(number);
  if (digits.startsWith("502") && digits.length === 11) {
    return `+502 ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 8) {
    return `+502 ${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  if (!digits) return "";
  return `+${digits}`;
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeSocialUrl(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  return isHttpUrl(trimmed) ? trimmed : null;
}

export type SocialNetwork = "instagram" | "facebook" | "tiktok";

export type SocialLink = {
  network: SocialNetwork;
  href: string;
  label: string;
};

export function socialLinksFromSettings(input: {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
}): SocialLink[] {
  const links: SocialLink[] = [];
  const instagram = sanitizeSocialUrl(input.instagramUrl);
  const facebook = sanitizeSocialUrl(input.facebookUrl);
  const tiktok = sanitizeSocialUrl(input.tiktokUrl);
  if (instagram)
    links.push({ network: "instagram", href: instagram, label: "Instagram" });
  if (facebook)
    links.push({ network: "facebook", href: facebook, label: "Facebook" });
  if (tiktok) links.push({ network: "tiktok", href: tiktok, label: "TikTok" });
  return links;
}
