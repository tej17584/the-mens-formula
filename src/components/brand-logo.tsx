import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="brand-logo"
      aria-label="The Men's Formula, inicio"
    >
      <Image
        src={inverted ? "/logo-header-dark.png" : "/logo-header-light.png"}
        alt="The Men's Formula"
        width={180}
        height={50}
        priority
      />
    </Link>
  );
}
