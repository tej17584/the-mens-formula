import { expect, test } from "@playwright/test";

test("contact page highlights WhatsApp and social networks", async ({
  page,
}) => {
  await page.goto("/contacto");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: /whatsapp/i })).toBeVisible();
  await expect(main.getByRole("link", { name: /instagram/i })).toBeVisible();
  await expect(main.getByRole("link", { name: /facebook/i })).toBeVisible();
  await expect(main.getByRole("link", { name: /tiktok/i })).toBeVisible();
  await expect(page.getByLabel(/nombre/i)).toHaveCount(0);
});
