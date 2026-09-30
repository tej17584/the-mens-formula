import { describe, expect, it } from "vitest";
import {
  buildDashboardProductsPath,
  dashboardProductsListPath,
  parseDashboardProductsSearchParams,
  withDashboardFlashStatus,
} from "@/lib/dashboard/products-list-query";

describe("parseDashboardProductsSearchParams", () => {
  it("ignores non-string array values", () => {
    expect(
      parseDashboardProductsSearchParams({
        q: ["pomade", "extra"],
        page: "2",
      }),
    ).toEqual({
      page: 2,
      q: undefined,
      brand: undefined,
      category: undefined,
      visible: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minDistributor: undefined,
      maxDistributor: undefined,
    });
  });

  it("keeps search and filter params", () => {
    expect(
      parseDashboardProductsSearchParams({
        q: "van",
        brand: "4046de1d-4e13-4efa-8fe5-e8e7ea2821f6",
        visible: "true",
        page: "3",
      }),
    ).toMatchObject({
      page: 3,
      q: "van",
      visible: "true",
    });
  });
});

describe("dashboardProductsListPath", () => {
  it("preserves inventory filters and page", () => {
    expect(
      dashboardProductsListPath({ q: "Pomade", status: "updated" }, { page: 2 }),
    ).toBe("/dashboard/products?q=Pomade&page=2");
  });
});

describe("withDashboardFlashStatus", () => {
  it("adds status without dropping filters", () => {
    expect(
      withDashboardFlashStatus("/dashboard/products?q=Pomade", "visibility"),
    ).toBe("/dashboard/products?q=Pomade&status=visibility");
  });
});

describe("buildDashboardProductsPath", () => {
  it("merges query updates and resets page", () => {
    const params = new URLSearchParams("q=van&page=2");
    expect(
      buildDashboardProductsPath("/dashboard/products", params, {
        visible: "true",
      }),
    ).toBe("/dashboard/products?q=van&visible=true");
  });

  it("removes cleared filters", () => {
    const params = new URLSearchParams("q=van&visible=true");
    expect(
      buildDashboardProductsPath("/dashboard/products", params, { q: null }),
    ).toBe("/dashboard/products?visible=true");
  });
});
