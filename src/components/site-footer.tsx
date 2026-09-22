import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <BrandLogo inverted />
          <p className="footer-statement">
            Herramientas y productos que acompañan cada buen corte.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/catalogo">Explorar catálogo</Link>
          <Link href="/contacto">Contacto</Link>
          {siteConfig.contact.instagram ? (
            <a href={siteConfig.contact.instagram}>Instagram</a>
          ) : null}
        </div>
      </div>
      <div className="shell footer-bottom">
        © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
