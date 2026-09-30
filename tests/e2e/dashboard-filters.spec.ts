import { expect, test } from "@playwright/test";

const adminEmail = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASWWORD ?? process.env.ADMIN_PASSWORD;

test.describe("dashboard inventory filters", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !adminEmail || !adminPassword,
      "Set ADMIN_USERNAME and ADMIN_PASWWORD in the environment for dashboard e2e.",
    );
    await page.goto("/dashboard/login");
    await page.getByRole("textbox", { name: /correo/i }).fill(adminEmail!);
    await page.getByRole("textbox", { name: /contraseña/i }).fill(adminPassword!);
    await page.getByRole("button", { name: /ingresar/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("keeps search query after toggling visibility", async ({ page }) => {
    await page.goto("/dashboard/products?q=Pomade");
    await expect(page).toHaveURL(/q=Pomade/);
    await page.getByLabel(/más acciones/i).first().click();
    await page.getByRole("menuitem", { name: /ocultar de la web|mostrar en la web/i }).click();
    await expect(page).toHaveURL(/q=Pomade/);
    await expect(page.getByRole("searchbox", { name: /buscar/i })).toHaveValue(
      "Pomade",
    );
  });

  test("can clear all inventory filters at once", async ({ page }) => {
    await page.goto("/dashboard/products?q=Pomade");
    await page.getByRole("button", { name: /limpiar filtros/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/products\/?$/);
    await expect(page.getByRole("searchbox", { name: /buscar/i })).toHaveValue(
      "",
    );
  });
});
