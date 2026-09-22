import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { translate } from "@/i18n";

export const metadata: Metadata = {
  title: translate("contact.metaTitle"),
  description: translate("contact.metaDescription"),
};
export default function ContactPage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="contact-page shell">
        <div>
          <p className="eyebrow">{translate("contact.eyebrow")}</p>
          <h1>{translate("contact.title")}</h1>
          <p>{translate("contact.description")}</p>
        </div>
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
