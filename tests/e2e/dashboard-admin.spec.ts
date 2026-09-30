import { expect, test } from "@playwright/test";

const adminEmail = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASWWORD ?? process.env.ADMIN_PASSWORD;

test.describe("dashboard admin surfaces", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !adminEmail || !adminPassword,
      "Set ADMIN_USERNAME and ADMIN_PASWWORD in the environment for dashboard e2e.",
    );
    await page.goto("/dashboard/login");
    await page.getByRole("textbox", { name: /correo/i }).fill(adminEmail!);
    await page
      .getByRole("textbox", { name: /contraseña/i })
      .fill(adminPassword!);
    await page.getByRole("button", { name: /ingresar/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("welcome shows inventory and message shortcuts", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /bienvenido/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /nuevo producto/i })).toBeVisible();
    await expect(page.getByText(/productos totales/i)).toBeVisible();
  });

  test("contact messages page renders", async ({ page }) => {
    await page.goto("/dashboard/contact");
    await expect(
      page.getByRole("heading", { name: /mensajes de contacto/i }),
    ).toBeVisible();
  });

  test("brands and settings pages render", async ({ page }) => {
    await page.goto("/dashboard/catalog");
    await expect(
      page.getByRole("heading", { name: /marcas y categorías/i }),
    ).toBeVisible();
    await page.goto("/dashboard/settings");
    await expect(
      page.getByRole("heading", { name: /configuración/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/whatsapp/i).first()).toBeVisible();
  });
});
