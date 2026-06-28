import { test, expect } from "@playwright/test";

test.describe("SalvosPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/salvos");
  });

  test("carrega a página sem erros", async ({ page }) => {
    await expect(page).toHaveURL(/\/salvos/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("sidebar está visível com item Salvos ativo", async ({ page }) => {
    const btnSalvos = page.locator("aside").getByRole("button", { name: /salvos/i });
    await expect(btnSalvos).toHaveClass(/bg-white\/20/);
  });

  test("exibe vagas salvas ou mensagem de vazio", async ({ page }) => {
    await page.waitForTimeout(1_000);
    const temVagas = await page.getByRole("article").count() > 0;
    const temVazio = await page.locator("text=/nenhum|vazio|sem vagas|não há/i").isVisible();
    expect(temVagas || temVazio).toBeTruthy();
  });

  test("clica em 'Saiba mais' e navega para /vaga/:id", async ({ page }) => {
    await page.waitForTimeout(1_000);
    const botao = page.getByRole("button", { name: /saiba mais/i }).first();
    const existe = await botao.isVisible();
    if (existe) {
      await botao.click();
      await expect(page).toHaveURL(/\/vaga\/\d+/, { timeout: 5_000 });
    }
  });
});


test.describe("AlertasPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/alertas");
  });

  test("carrega a página sem erros", async ({ page }) => {
    await expect(page).toHaveURL(/\/alertas/);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("sidebar está visível com item Alertas ativo", async ({ page }) => {
    const btnAlertas = page.locator("aside").getByRole("button", { name: /alertas/i });
    await expect(btnAlertas).toHaveClass(/bg-white\/20/);
  });

  test("exibe badge de contagem na sidebar se houver alertas", async ({ page }) => {
    await page.waitForTimeout(1_000);
    const badge = page.locator("aside span.rounded-full").first();
    const existeBadge = await badge.isVisible();
    if (existeBadge) {
      const texto = await badge.innerText();
      expect(texto).toMatch(/^\d+$|^99\+$/);
    }
  });

  test("exibe alertas cadastrados ou mensagem de vazio", async ({ page }) => {
    await page.waitForTimeout(1_000);
    const temAlertas = await page.getByRole("article").count() > 0;
    const temVazio   = await page.locator("text=/nenhum|vazio|sem alerta/i").isVisible();
    expect(temAlertas || temVazio).toBeTruthy();
  });
});


test.describe("PerfilPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/perfil");
    await page.waitForTimeout(1_000);
  });

  test("carrega a página sem erros", async ({ page }) => {
    await expect(page).toHaveURL(/\/perfil/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("exibe avatar com iniciais no header e no centro", async ({ page }) => {
    const avatarHeader = page.locator(".w-11.h-11.rounded-full");
    await expect(avatarHeader).toBeVisible();
    const iniciais = await avatarHeader.innerText();
    expect(iniciais).toMatch(/^[A-Z?]{1,2}$/);
  });

  test("exibe nome do usuário no h1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const texto = await h1.innerText();
    expect(texto.trim().length).toBeGreaterThan(0);
  });

  test("exibe badge de curso", async ({ page }) => {
    const badge = page.locator("span.bg-\\[\\#003f7f\\].rounded-full").first();
    await expect(badge).toBeVisible();
    const texto = await badge.innerText();
    expect(texto.trim().length).toBeGreaterThan(0);
  });

  test("exibe label e campo de email institucional", async ({ page }) => {
    await expect(page.locator("label", { hasText: /email institucional/i })).toBeVisible();
    const campoEmail = page.locator("div.rounded-2xl").filter({ hasText: /@/ });
    await expect(campoEmail.first()).toBeVisible();
  });

  test("exibe label e campo de nome preenchido", async ({ page }) => {
    await expect(page.locator("label", { hasText: /^nome$/i })).toBeVisible();
    const campoNome = page.locator("div.rounded-2xl").first();
    const texto = await campoNome.innerText();
    expect(texto.trim().length).toBeGreaterThan(0);
  });

  test("exibe seção de alertas selecionados", async ({ page }) => {
    await expect(page.locator("label", { hasText: /alertas selecionados/i })).toBeVisible();
  });

  test("botão Editar Perfil abre dialog", async ({ page }) => {
    const btn = page.getByRole("button", { name: /editar perfil/i });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.locator("[role='dialog']")).toBeVisible({ timeout: 3_000 });
  });

  test("sidebar está visível", async ({ page }) => {
    await expect(page.locator("aside")).toBeVisible();
  });
});