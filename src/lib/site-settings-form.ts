import { z } from "zod";
import { isHttpUrl, normalizeWhatsappNumber } from "@/lib/site-links";

const socialUrlSchema = z
  .string()
  .trim()
  .max(300)
  .transform((value) => value || null)
  .refine((value) => value === null || isHttpUrl(value), {
    message: "Revisa los enlaces de redes sociales.",
  });

export const siteSettingsSchema = z.object({
  whatsappNumber: z.string().trim().min(8).max(20),
  whatsappProductMessage: z.string().trim().min(10).max(1000),
  instagramUrl: socialUrlSchema,
  facebookUrl: socialUrlSchema,
  tiktokUrl: socialUrlSchema,
});

export type ParsedSiteSettings = {
  whatsappNumber: string;
  whatsappProductMessage: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};

export function parseSiteSettingsForm(
  formData: FormData,
):
  | { success: true; data: ParsedSiteSettings }
  | { success: false; error: string } {
  const parsed = siteSettingsSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber"),
    whatsappProductMessage: formData.get("whatsappProductMessage"),
    instagramUrl: formData.get("instagramUrl") ?? "",
    facebookUrl: formData.get("facebookUrl") ?? "",
    tiktokUrl: formData.get("tiktokUrl") ?? "",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Revisa el número, el mensaje y las redes sociales.",
    };
  }

  const whatsappNumber = normalizeWhatsappNumber(parsed.data.whatsappNumber);
  if (whatsappNumber.length < 10 || whatsappNumber.length > 15) {
    return { success: false, error: "Revisa el número y el mensaje." };
  }

  return {
    success: true,
    data: {
      whatsappNumber,
      whatsappProductMessage: parsed.data.whatsappProductMessage,
      instagramUrl: parsed.data.instagramUrl,
      facebookUrl: parsed.data.facebookUrl,
      tiktokUrl: parsed.data.tiktokUrl,
    },
  };
}
