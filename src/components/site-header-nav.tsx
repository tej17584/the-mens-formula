"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "@/i18n";
import { cn } from "cn";

const links = [
  { href: "/", key: "header.home" as const },
  { href: "/catalogo", key: "header.catalog" as const },
  { href: "/contacto", key: "header.contact" as const },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNav() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <>
      <nav className="header-nav" aria-label="Navegación principal">
        {links.map((link) => (
          <Link
            key={link.href}
            className={cn(
              "header-nav-link",
              isActive(pathname, link.href) && "header-nav-link-active",
            )}
            href={link.href}
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Button
          className="header-cta"
          nativeButton={false}
          render={<Link href="/catalogo" />}
          size="lg"
        >
          {t("header.catalogCta")}
        </Button>
        <Sheet>
          <SheetTrigger
            render={
              <Button
                className="header-menu-trigger"
                size="icon"
                type="button"
                variant="outline"
                aria-label={t("header.openMenu")}
              />
            }
          >
            <MenuIcon data-icon="inline-start" />
          </SheetTrigger>
          <SheetContent className="header-mobile-sheet" side="right">
            <SheetHeader>
              <SheetTitle>{t("header.menuTitle")}</SheetTitle>
            </SheetHeader>
            <nav className="header-mobile-nav" aria-label={t("header.menuTitle")}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  className={cn(
                    "header-mobile-link",
                    isActive(pathname, link.href) && "header-mobile-link-active",
                  )}
                  href={link.href}
                >
                  {t(link.key)}
                </Link>
              ))}
              <Button
                className="header-mobile-cta"
                nativeButton={false}
                render={<Link href="/catalogo" />}
                size="lg"
              >
                {t("header.catalogCta")}
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
