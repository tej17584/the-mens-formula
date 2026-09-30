"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
          <SheetContent
            className="header-mobile-sheet gap-0 p-0"
            side="bottom"
            showCloseButton
          >
            <SheetHeader className="header-mobile-sheet-header">
              <SheetTitle className="header-mobile-sheet-title">
                {t("header.menuTitle")}
              </SheetTitle>
              <SheetDescription className="header-mobile-sheet-desc">
                {t("header.menuDescription")}
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <nav
              className="header-mobile-nav"
              aria-label={t("header.menuTitle")}
            >
              <ul className="header-mobile-list">
                {links.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        className={cn(
                          "header-mobile-link",
                          active && "header-mobile-link-active",
                        )}
                        href={link.href}
                        onClick={closeMenu}
                      >
                        <span>{t(link.key)}</span>
                        <ChevronRightIcon aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="header-mobile-footer">
              <Button
                className="header-mobile-cta"
                nativeButton={false}
                onClick={closeMenu}
                render={<Link href="/catalogo" />}
                size="lg"
              >
                {t("header.catalogCta")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
