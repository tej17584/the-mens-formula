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
        src={inverted ? "/logo-dark.png" : "/logo-light.png"}
        alt="The Men's Formula"
        width={1332}
        height={853}
        sizes="160px"
        priority
      />
    </Link>
  );
}
