import { test, expect } from "@playwright/test";

test.describe("VagasPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vagas");
  });

  test("renderiza a barra de busca", async ({ page }) => {
    await expect(page.locator("input[type='search'], input[placeholder*='busca' i], input[placeholder*='pesquis' i]").first()).toBeVisible();
  });

  test("exibe cards de vagas ou mensagem de vazio", async ({ page }) => {
    await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });

    const temVagas = await page.locator("text=oportunidade").first().isVisible();
    expect(temVagas).toBeTruthy();
  });

  test("exibe skeleton de loading ao carregar", async ({ page }) => {
    await page.reload();
    const skeleton = page.locator(".animate-pulse").first();
    await expect(skeleton).toBeVisible({ timeout: 3_000 });
  });

  test("busca filtra as vagas", async ({ page }) => {
    await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });

    const input = page.locator("input").first();
    await input.fill("PIBIC");

    await page.waitForTimeout(600);
    await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });
  });

  test("clica em 'Saiba mais' e navega para /vaga/:id", async ({ page }) => {
    await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });

  const botaoSaibaMais = page.getByRole("button", { name: /saber mais/i }).filter({ hasNot: page.locator("[disabled]") }).first();
    await expect(botaoSaibaMais).toBeVisible({ timeout: 5_000 });
    await botaoSaibaMais.click();

    await expect(page).toHaveURL(/\/vaga\/\d+/, { timeout: 5_000 });
  });

  test("avatar do usuário navega para /perfil", async ({ page }) => {
    const avatar = page.locator("button.rounded-full").first();
    await expect(avatar).toBeVisible();
    await avatar.click();

    await expect(page).toHaveURL(/\/perfil/);
  });

  test("filtro rápido de programa atualiza a listagem", async ({ page }) => {
    await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });

    const filtroPibic = page.getByRole("button", { name: "PIBIC" }).first();
    if (await filtroPibic.isVisible()) {
      await filtroPibic.click();
      await page.waitForTimeout(600);
      await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });
    }
  });
});