import { describe, expect, it } from "vitest";
import {
  contactSpamScore,
  isContactSpam,
  isHoneypotTriggered,
  isImplausibleFormTiming,
} from "@/lib/contact-spam";

const instagramSpam = {
  name: "Gemma Marshall",
  contact: "7056468259",
  message:
    "Hi, I took a quick look at themensformula.store and thought I’d reach out. We recently built a free Instagram report that shows how an account is performing and where it could be in three months. Feel free to run your page through it if you're curious where you stand. If you like what you see, our team helps businesses organically grow their Instagram presence with real, targeted followers — 100% manual work, no bots. We've grown over 800 accounts since 2020, and you can try it free for 3 days, with no card needed. Not on Instagram yet? We can set up a new profile for you and grow it from the start. You'll find the report and the trial here: http://instagrow.business/ Thanks for your time, Gemma Not for you? Unsubscribe here and we won't contact you again: http://instagrow.business/unsubscribe.php?d=themensformula.store",
};

const pressSpam = {
  name: "Olga",
  contact: "olga.huerta@prensayseo.com",
  message:
    "Hola, soy Olga. Te escribo porque nos interesa publicar una noticia sobre The Men's Formula en nuestra red de periódicos digitales, más de 50. El proceso es simple. La noticia la escriben nuestros periodistas, tú solo apruebas el texto, y en 3 días la tienes publicada. Garantizado. Piensa en el barbero que necesita reponer catálogo y busca productos profesionales para barbería en Google, o se lo pregunta directamente a ChatGPT, y acaba llamando a los dos o tres proveedores que le salen primero. Ahí es donde queremos que esté The Men's Formula. Hoy quienes deciden quién sale en esos primeros puestos son Google y ChatGPT, y lo deciden leyendo la prensa. Con los periódicos hablando de The Men's Formula, cuando alguien busque productos para cabello, barba o afeitado, aparecéis vosotros, arriba y recomendados. Trabajamos con tarifas desde 99 euros, con garantía de devolución por resultados. ¿Me pasas un teléfono?",
};

describe("isContactSpam", () => {
  it("flags Instagram growth outreach with external links", () => {
    expect(isContactSpam(instagramSpam)).toBe(true);
    expect(contactSpamScore(instagramSpam)).toBeGreaterThanOrEqual(4);
  });

  it("flags digital press / SEO outreach", () => {
    expect(isContactSpam(pressSpam)).toBe(true);
    expect(contactSpamScore(pressSpam)).toBeGreaterThanOrEqual(4);
  });

  it("allows a real product inquiry", () => {
    expect(
      isContactSpam({
        name: "Carlos",
        contact: "50255551234",
        message:
          "Hola, busco cera Level3 y el precio por caja para mi barbería en Mixco.",
      }),
    ).toBe(false);
  });

  it("allows mentioning Instagram without a growth pitch", () => {
    expect(
      isContactSpam({
        name: "Ana",
        contact: "ana@example.com",
        message: "Vi su catálogo en Instagram y quiero pomada para barba.",
      }),
    ).toBe(false);
  });
});

describe("isHoneypotTriggered", () => {
  it("treats filled hidden fields as bots", () => {
    const formData = new FormData();
    formData.set("company", "Acme SEO");
    expect(isHoneypotTriggered(formData)).toBe(true);
  });
});

describe("isImplausibleFormTiming", () => {
  it("rejects instant and missing timestamps", () => {
    expect(isImplausibleFormTiming(String(Date.now()))).toBe(true);
    expect(isImplausibleFormTiming(null)).toBe(true);
  });

  it("accepts a human-paced timestamp", () => {
    expect(isImplausibleFormTiming(String(Date.now() - 4_000))).toBe(false);
  });
});