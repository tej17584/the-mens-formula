import { expect, test } from "@playwright/test";

test("contact form submits successfully", async ({ page }) => {
  await page.goto("/contacto");
  const name = `Consulta E2E ${Date.now()}`;
  await page.getByLabel(/nombre/i).fill(name);
  await page.getByLabel(/correo o teléfono/i).fill("e2e@example.com");
  await page.getByLabel(/qué producto buscas/i).fill("Prueba automatizada");
  await page.getByRole("button", { name: /enviar consulta/i }).click();
  await expect(page.getByText(/recibimos tu consulta/i)).toBeVisible();
});
