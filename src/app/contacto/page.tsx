import type { Metadata } from "next";
import { ContactAside } from "@/components/contact-aside";
import { ContactForm } from "@/components/contact-form";
import { Badge } from "@/components/ui/badge";
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
      <main className="contact-page storefront-contact storefront-contact-page">
        <div className="contact-hero-band">
          <div className="shell storefront-shell">
            <header className="contact-page-header">
              <Badge className="page-eyebrow-badge" variant="secondary">
                {translate("contact.eyebrow")}
              </Badge>
              <h1>{translate("contact.title")}</h1>
              <p>{translate("contact.description")}</p>
            </header>
          </div>
        </div>
        <div className="shell storefront-shell contact-page-layout">
          <ContactForm />
          <ContactAside />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
