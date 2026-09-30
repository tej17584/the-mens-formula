import { expect, test } from "@playwright/test";
import path from "node:path";

const adminEmail = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASWWORD ?? process.env.ADMIN_PASSWORD;

test.describe("dashboard products", () => {
  test.describe.configure({ mode: "serial" });

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

  test("search filter narrows inventory", async ({ page }) => {
    await page.goto("/dashboard/products?q=Pomade");
    await expect(
      page.getByRole("region", { name: /filtros/i }).getByText(/2 productos/i),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Pomade TMF-0036/i })).toBeVisible();
    await expect(page.getByText(/mostrando 1.*2 de 2/i)).toBeVisible();
  });

  test("updates an existing product price", async ({ page }) => {
    await page.goto("/dashboard/products?q=Pomade");
    await page.getByRole("link", { name: /Pomade TMF-0036/i }).click();
    const price = page.getByRole("spinbutton", { name: /precio público/i });
    const current = Number(await price.inputValue());
    const next = current === 99 ? 98 : 99;
    await price.fill(String(next));
    await page.getByRole("button", { name: /actualizar producto/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/products/);
    await page.goto("/dashboard/products?q=Pomade");
    await page.getByRole("link", { name: /Pomade TMF-0036/i }).click();
    await expect(
      page.getByRole("spinbutton", { name: /precio público/i }),
    ).toHaveValue(String(next));
  });

  test("creates and deletes a product with image", async ({ page }) => {
    const name = `E2E Product ${Date.now()}`;
    await page.goto("/dashboard/products/new");
    await page.getByRole("textbox", { name: /nombre/i }).fill(name);
    await page
      .locator('select[name="brandId"]')
      .selectOption("4046de1d-4e13-4efa-8fe5-e8e7ea2821f6");
    await page
      .locator('select[name="categoryId"]')
      .selectOption("fdf1781c-a659-4ef2-ae6c-9693cc478e9c");
    await page
      .getByRole("spinbutton", { name: /precio público/i })
      .fill("150");
    const imageInput = page.locator("#product-images");
    await imageInput.setInputFiles(
      path.join(__dirname, "../fixtures/sample.png"),
    );
    await expect(page.getByText(/1\/3/i)).toBeVisible();
    await page.getByRole("button", { name: /crear producto/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/products(\?|$)/, {
      timeout: 20000,
    });
    await page.goto(`/dashboard/products?q=${encodeURIComponent(name)}`);
    await expect(page.getByRole("link", { name })).toBeVisible();
    await page.getByLabel(/más acciones/i).first().click();
    await page.getByRole("menuitem", { name: /eliminar producto/i }).click();
    await page
      .getByRole("button", { name: /eliminar producto/i })
      .last()
      .click();
    await expect(page.getByRole("link", { name })).toHaveCount(0);
  });
});
