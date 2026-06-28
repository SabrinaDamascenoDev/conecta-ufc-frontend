import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("LoginPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renderiza os campos de email e senha", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /entrar na plataforma/i })).toBeVisible();
  });

  test("mostra erros de validação ao submeter vazio", async ({ page }) => {
    await page.click('button[type="submit"]');

    await expect(page.locator("text=/email/i").first()).toBeVisible();
    await expect(page.locator("text=/senha/i").first()).toBeVisible();
  });

  test("mostra erro com credenciais inválidas", async ({ page }) => {
    await page.fill('input[type="email"]', "errado@alu.ufc.br");
    await page.fill('input[type="password"]', "senhaerrada");
    await page.click('button[type="submit"]');

    // Aguarda o toast de erro aparecer
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5_000 });
  });

  test("toggle de mostrar/esconder senha funciona", async ({ page }) => {
    const input = page.locator('input[type="password"], input[type="text"]').first();
    const toggle = page.locator('button[type="button"]').first();

    await expect(page.locator('input[type="password"]')).toBeVisible();

    await toggle.click();
    await expect(page.locator('input[type="text"]')).toBeVisible();

    await toggle.click();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("login com sucesso redireciona para /vagas", async ({ page }) => {
    await page.fill('input[type="email"]', "fulano5@alu.ufc.br");
    await page.fill('input[type="password"]', "senha1234");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/vagas/, { timeout: 10_000 });
  });

  test("botão fica desabilitado enquanto carrega", async ({ page }) => {
    await page.fill('input[type="email"]', "teste@alu.ufc.br");
    await page.fill('input[type="password"]', "senha123");

    const btn = page.getByRole("button", { name: /entrar na plataforma/i });
    await btn.click();

    // Logo após o clique, deve mostrar "Entrando..." e estar disabled
    await expect(page.getByRole("button", { name: /entrando/i })).toBeDisabled();
  });
});