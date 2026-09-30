import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { translate } from "@/i18n";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const { email, whatsapp, instagram } = siteConfig.contact;

  return (
    <footer className="site-footer">
      <div className="shell storefront-shell footer-top">
        <div className="footer-brand-block">
          <BrandLogo inverted />
          <p className="footer-statement">{translate("footer.statement")}</p>
          <Button
            className="footer-cta"
            nativeButton={false}
            render={<Link href="/catalogo" />}
            size="lg"
            variant="secondary"
          >
            {translate("footer.exploreCatalog")}
          </Button>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <p className="footer-column-title">{translate("footer.navigate")}</p>
            <div className="footer-links">
              <Link href="/">{translate("header.home")}</Link>
              <Link href="/catalogo">{translate("header.catalog")}</Link>
              <Link href="/contacto">{translate("header.contact")}</Link>
            </div>
          </div>
          <div className="footer-column">
            <p className="footer-column-title">{translate("footer.contact")}</p>
            <div className="footer-links">
              {email ? (
                <a href={`mailto:${email}`}>{email}</a>
              ) : (
                <Link href="/contacto">{translate("footer.writeUs")}</Link>
              )}
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
              ) : null}
              {instagram ? (
                <a href={instagram} rel="noopener noreferrer" target="_blank">
                  Instagram
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Separator className="footer-separator" />
      <div className="shell storefront-shell footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          {translate("footer.copyright")}
        </p>
        <p className="footer-tagline">{translate("footer.tagline")}</p>
      </div>
    </footer>
  );
}
