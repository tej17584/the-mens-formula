import { describe, expect, it } from "vitest";
import { parseSiteSettingsForm } from "@/lib/site-settings-form";
import {
  formatWhatsappNumber,
  socialLinksFromSettings,
} from "@/lib/site-links";

describe("parseSiteSettingsForm", () => {
  it("normalizes a local WhatsApp number and keeps social URLs", () => {
    const formData = new FormData();
    formData.set("whatsappNumber", "5512 3456");
    formData.set(
      "whatsappProductMessage",
      'Hola, me interesa "{{product_name}}".',
    );
    formData.set("instagramUrl", "https://www.instagram.com/themensformulagt");
    formData.set("facebookUrl", "");
    formData.set("tiktokUrl", "https://www.tiktok.com/@themensformula");

    expect(parseSiteSettingsForm(formData)).toEqual({
      success: true,
      data: {
        whatsappNumber: "50255123456",
        whatsappProductMessage: 'Hola, me interesa "{{product_name}}".',
        instagramUrl: "https://www.instagram.com/themensformulagt",
        facebookUrl: null,
        tiktokUrl: "https://www.tiktok.com/@themensformula",
      },
    });
  });

  it("rejects an invalid social URL", () => {
    const formData = new FormData();
    formData.set("whatsappNumber", "50255123456");
    formData.set(
      "whatsappProductMessage",
      "Mensaje de consulta para productos.",
    );
    formData.set("instagramUrl", "not-a-url");
    formData.set("facebookUrl", "");
    formData.set("tiktokUrl", "");

    expect(parseSiteSettingsForm(formData).success).toBe(false);
  });
});

describe("formatWhatsappNumber", () => {
  it("formats Guatemala numbers for display", () => {
    expect(formatWhatsappNumber("50255123456")).toBe("+502 5512 3456");
  });
});

describe("socialLinksFromSettings", () => {
  it("omits empty and invalid links", () => {
    expect(
      socialLinksFromSettings({
        instagramUrl: "https://www.instagram.com/themensformulagt",
        facebookUrl: "nope",
        tiktokUrl: "",
      }),
    ).toEqual([
      {
        network: "instagram",
        href: "https://www.instagram.com/themensformulagt",
        label: "Instagram",
      },
    ]);
  });
});
