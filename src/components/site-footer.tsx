import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SocialNetworkIcon } from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { translate } from "@/i18n";
import { getSiteSettings } from "@/lib/catalog";
import { siteConfig } from "@/lib/site-config";
import { socialLinksFromSettings, whatsappHref } from "@/lib/site-links";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const { email } = siteConfig.contact;
  const wa = settings.whatsappNumber
    ? whatsappHref(settings.whatsappNumber)
    : null;
  const socials = socialLinksFromSettings(settings);

  return (
    <footer className="site-footer">
      <div className="shell storefront-shell footer-top">
        <div className="footer-brand-block">
          <BrandLogo inverted />
          <p className="footer-statement">{translate("footer.statement")}</p>
          <Button
            className="footer-cta storefront-primary-cta"
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
            <p className="footer-column-title">
              {translate("footer.navigate")}
            </p>
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
              {wa ? (
                <a href={wa} rel="noopener noreferrer" target="_blank">
                  WhatsApp
                </a>
              ) : null}
            </div>
            {socials.length ? (
              <div className="footer-socials">
                {socials.map((social) => (
                  <a
                    key={social.network}
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={social.label}
                  >
                    <SocialNetworkIcon network={social.network} />
                  </a>
                ))}
              </div>
            ) : null}
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
