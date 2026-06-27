import { test as setup, expect } from "@playwright/test";

setup("autenticar usuário", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="email"]', "fulano5@alu.ufc.br");
  await page.fill('input[type="password"]', "senha1234");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/vagas/, { timeout: 10_000 });

  await page.context().storageState({ path: "e2e/.auth/user.json" });
});