import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { translate } from "@/i18n";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <BrandLogo inverted />
          <p className="footer-statement">{translate("footer.statement")}</p>
        </div>
        <div className="footer-links">
          <Link href="/catalogo">{translate("footer.exploreCatalog")}</Link>
          <Link href="/contacto">{translate("header.contact")}</Link>
          {siteConfig.contact.instagram ? (
            <a href={siteConfig.contact.instagram}>Instagram</a>
          ) : null}
        </div>
      </div>
      <div className="shell footer-bottom">
        © {new Date().getFullYear()} {siteConfig.name}.{" "}
        {translate("footer.copyright")}
      </div>
    </footer>
  );
}
