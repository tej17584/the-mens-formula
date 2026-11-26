import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog";

function featuredBrands(products: CatalogProduct[]) {
  const counts = new Map<string, { name: string; slug: string; count: number }>();
  for (const product of products) {
    const brand = product.brand;
    const current = counts.get(brand.id) ?? {
      name: brand.name,
      slug: brand.slug,
      count: 0,
    };
    current.count += 1;
    counts.set(brand.id, current);
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 6);
}

export function HomeBrandsSection({
  products,
  eyebrow,
}: {
  products: CatalogProduct[];
  eyebrow: string;
}) {
  const brands = featuredBrands(products);
  if (brands.length === 0) return null;

  return (
    <section className="home-brands" aria-labelledby="home-brands-title">
      <div className="shell storefront-shell home-brands-inner">
        <h2 className="home-brands-title" id="home-brands-title">
          <span className="home-brands-title-label">{eyebrow}</span>
        </h2>
        <ul className="home-brands-list">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <Link className="home-brands-link" href={`/catalogo?marca=${brand.slug}`}>
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}