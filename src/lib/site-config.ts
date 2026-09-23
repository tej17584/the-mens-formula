export const siteConfig = {
  name: "The Men's Formula",
  description: "Productos profesionales para barbería.",
  locale: "es-GT",
  currency: "GTQ",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  },
} as const;

export function formatPrice(price: number | null) {
  if (price === null) return translate("catalog.priceOnRequest");

  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(price);
}
import { translate } from "@/i18n";
