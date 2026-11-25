import { describe, expect, it } from "vitest";
import {
  applyCatalogQuery,
  catalogSearchParam,
  paginateCatalog,
  sortCatalogProducts,
} from "@/lib/catalog-query";

const products = [
  {
    name: "Agiva 01 Orange",
    category: { slug: "productos-para-cabello" },
    brand: { slug: "agiva" },
    consumer_price: 55,
  },
  {
    name: "After Shave MIDNIGHT",
    category: { slug: "after-shave" },
    brand: { slug: "level3" },
    consumer_price: 99,
  },
  {
    name: "Pomade",
    category: { slug: "productos-para-cabello" },
    brand: { slug: "level3" },
    consumer_price: 99,
  },
];

describe("catalogSearchParam", () => {
  it("uses the first non-empty array value", () => {
    expect(catalogSearchParam(["level3", "agiva"])).toBe("level3");
  });
});

describe("applyCatalogQuery", () => {
  it("filters by brand slug", () => {
    expect(
      applyCatalogQuery(products, { brand: "Level3" }).map((item) => item.name),
    ).toEqual(["After Shave MIDNIGHT", "Pomade"]);
  });

  it("filters by category and search together", () => {
    expect(
      applyCatalogQuery(products, {
        category: "productos-para-cabello",
        q: "agiva",
      }).map((item) => item.name),
    ).toEqual(["Agiva 01 Orange"]);
  });
});

describe("sortCatalogProducts", () => {
  it("sorts by price ascending", () => {
    expect(
      sortCatalogProducts(products, "price-asc").map((item) => item.name),
    ).toEqual(["Agiva 01 Orange", "After Shave MIDNIGHT", "Pomade"]);
  });
});

describe("paginateCatalog", () => {
  it("keeps the requested page within range", () => {
    expect(paginateCatalog(products, 2, 8)).toMatchObject({
      page: 2,
      total: 3,
      pageSize: 2,
    });
  });
});
