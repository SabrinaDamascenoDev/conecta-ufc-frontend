import { test, expect, type Page } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

async function irParaStep2(page: Page) {
  await page.goto("/cadastro");
  await page.fill('input[placeholder="nome"]', "Fulano de Tal");
  await page.fill('input[type="email"]', "fulano5@alu.ufc.br");
  await page.fill('input[type="password"]', "senha1234");
  await page.locator('[role="combobox"]').click();
  await page.getByRole("option", { name: "Sistemas de Informação" }).click();
  await page.click('button[type="submit"]');
  await expect(
    page.locator("text=Selecione quais oportunidades"),
  ).toBeVisible();
}

test.describe("RegisterPage — step 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cadastro");
  });

  test("renderiza os campos do step 1", async ({ page }) => {
    await expect(page.locator('input[placeholder="nome"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /continuar cadastro/i }),
    ).toBeVisible();
  });

  test("mostra erros ao submeter step 1 vazio", async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator("p.text-red-500").first()).toBeVisible();
  });

  test("avança para step 2 com dados válidos", async ({ page }) => {
    await page.fill('input[placeholder="nome"]', "Fulano de Tal");
    await page.fill('input[type="email"]', "fulano@alu.ufc.br");
    await page.fill('input[type="password"]', "senha1234");
    await page.locator('[role="combobox"]').click();
    await page.getByRole("option", { name: "Sistemas de Informação" }).click();
    await page.click('button[type="submit"]');
    await expect(
      page.locator("text=Selecione quais oportunidades"),
    ).toBeVisible();
  });
});

test.describe("RegisterPage — step 2", () => {
  test("renderiza as tags de oportunidade", async ({ page }) => {
    await irParaStep2(page);
    for (const tag of ["PIBIC", "PET", "Extensão"]) {
      await expect(page.locator(`button:has-text("${tag}")`)).toBeVisible();
    }
  });

  test("selecionar e desselecionar tag funciona", async ({ page }) => {
    await irParaStep2(page);
    const pibic = page.locator('button:has-text("PIBIC")');
    await pibic.click();
    await expect(pibic).toHaveClass(/bg-ufc/);
    await pibic.click();
    await expect(pibic).not.toHaveClass(/bg-ufc/);
  });

  test("cadastro completo redireciona para /login", async ({ page }) => {
    await irParaStep2(page);
    await page.locator('button:has-text("PIBIC")').click();
    await page.getByRole("button", { name: /acessar a plataforma/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("botão mostra 'Acessando...' enquanto carrega", async ({ page }) => {
    await irParaStep2(page);
    await page.getByRole("button", { name: /acessar a plataforma/i }).click();
    await expect(
      page.getByRole("button", { name: /acessando/i }),
    ).toBeVisible();
  });
});
