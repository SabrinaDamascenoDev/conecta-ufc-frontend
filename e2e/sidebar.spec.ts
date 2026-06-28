import { test, expect } from "@playwright/test";

test.describe("Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vagas");
    await expect(page.locator("aside")).toBeVisible();
  });

  test("renderiza logo e título Conecta UFC", async ({ page }) => {
    await expect(page.locator("aside img")).toBeVisible();
    await expect(page.locator("aside", { hasText: "Conecta" })).toBeVisible();
    await expect(page.locator("aside", { hasText: "UFC" })).toBeVisible();
  });

  test("navega para /salvos ao clicar em Salvos", async ({ page }) => {
    await page.locator("aside").getByRole("button", { name: /salvos/i }).click();
    await expect(page).toHaveURL(/\/salvos/);
  });

  test("navega para /alertas ao clicar em Alertas", async ({ page }) => {
    await page.locator("aside").getByRole("button", { name: /alertas/i }).click();
    await expect(page).toHaveURL(/\/alertas/);
  });

  test("navega para /vagas ao clicar em Vagas", async ({ page }) => {
    await page.goto("/salvos");
    await page.locator("aside").getByRole("button", { name: /vagas/i }).click();
    await expect(page).toHaveURL(/\/vagas/);
  });

  test("navega para /perfil ao clicar no avatar do usuário", async ({ page }) => {
    await page.locator("aside button").filter({ hasText: /^[A-Z]{1,2}$/ }).click();
    await expect(page).toHaveURL(/\/perfil/);
  });

  test("exibe iniciais do usuário no avatar", async ({ page }) => {
    const avatar = page.locator("aside .rounded-full").first();
    await expect(avatar).toBeVisible();
    const texto = await avatar.innerText();
    expect(texto).toMatch(/^[A-Z?]{1,2}$/);
  });

  test("item ativo tem destaque visual", async ({ page }) => {
    const btnVagas = page.locator("aside").getByRole("button", { name: /vagas/i });
    await expect(btnVagas).toHaveClass(/bg-white\/20/);
  });

  test.describe("mobile — menu hamburguer", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("sidebar começa fechada no mobile", async ({ page }) => {
      await page.goto("/vagas");
      const aside = page.locator("aside");
      await expect(aside).toHaveClass(/-translate-x-\[110%\]/);
    });

    test("abre ao clicar no botão hamburguer", async ({ page }) => {
      await page.goto("/vagas");
      await page.locator('button[aria-label="Abrir menu"]').click();
      const aside = page.locator("aside");
      await expect(aside).not.toHaveClass(/-translate-x-\[110%\]/);
    });

    test("fecha ao clicar no X", async ({ page }) => {
      await page.goto("/vagas");
      await page.locator('button[aria-label="Abrir menu"]').click();
      await page.locator('button[aria-label="Fechar menu"]').click();
      const aside = page.locator("aside");
      await expect(aside).toHaveClass(/-translate-x-\[110%\]/);
    });

    test("fecha ao clicar no overlay", async ({ page }) => {
      await page.goto("/vagas");
      await page.locator('button[aria-label="Abrir menu"]').click();
      await page.locator(".bg-black\\/40").click();
      const aside = page.locator("aside");
      await expect(aside).toHaveClass(/-translate-x-\[110%\]/);
    });
  });
});