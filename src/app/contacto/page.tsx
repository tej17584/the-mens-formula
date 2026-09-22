import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Consulta productos profesionales de barbería con The Men's Formula.",
};
export default function ContactPage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="contact-page shell">
        <div>
          <p className="eyebrow">Contacto</p>
          <h1>Hablemos de tu próxima compra.</h1>
          <p>
            Cuéntanos qué producto o herramienta buscas. Te ayudaremos a
            ubicarlo dentro del catálogo.
          </p>
        </div>
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
