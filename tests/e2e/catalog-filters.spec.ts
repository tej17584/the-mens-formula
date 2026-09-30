import { expect, test } from "@playwright/test";

test.describe("storefront catalog filters", () => {
  test("filters by category slug in the URL", async ({ page }) => {
    await page.goto("/catalogo?categoria=productos-para-cabello");
    await expect(page.getByRole("combobox", { name: /categoría/i })).toHaveValue(
      "productos-para-cabello",
    );
    await expect(page.getByText(/\d+ productos/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Agiva 01 Orange" }),
    ).toBeVisible();
  });

  test("clears filters from the sidebar", async ({ page }) => {
    await page.goto("/catalogo?categoria=productos-para-cabello&marca=level3");
    await page.getByRole("button", { name: /limpiar filtros/i }).click();
    await expect(page).toHaveURL(/\/catalogo$/);
  });
});
