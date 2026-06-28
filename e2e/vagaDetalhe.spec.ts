import { test, expect } from "@playwright/test";

async function irParaDetalheVaga(page: any) {
  await page.goto("/vagas");
  await expect(page.locator(".animate-pulse").first()).not.toBeVisible({ timeout: 8_000 });

  const botaoSaibaMais = page.getByRole("button", { name: /saber mais/i }).filter({ hasNot: page.locator("[disabled]") }).first();
  await expect(botaoSaibaMais).toBeVisible({ timeout: 5_000 });
  await botaoSaibaMais.click();

  await expect(page).toHaveURL(/\/vaga\/\d+/, { timeout: 5_000 });
}

test.describe("VagaDetalhePage", () => {
  test.beforeEach(async ({ page }) => {
    await irParaDetalheVaga(page);
  });

  test("exibe título da vaga", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const texto = await h1.innerText();
    expect(texto.trim().length).toBeGreaterThan(0);
  });

  test("exibe card de coordenador", async ({ page }) => {
    await expect(page.locator("p", { hasText: /coordenador/i })).toBeVisible();
  });

  test("exibe card de valor da bolsa", async ({ page }) => {
    await expect(page.locator("p", { hasText: /valor da bolsa/i })).toBeVisible();
  });

  test("exibe card de encerramento em dias", async ({ page }) => {
    await expect(page.locator("p", { hasText: /encerra em/i }).first()).toBeVisible();
  });

  test("exibe seção 'Sobre a vaga'", async ({ page }) => {
    await expect(page.locator("p", { hasText: /sobre a vaga/i })).toBeVisible();
  });

  test("exibe vagas voluntárias e remuneradas", async ({ page }) => {
    await expect(page.locator("text=Voluntárias")).toBeVisible();
    await expect(page.locator("text=Remunerada")).toBeVisible();
  });

  test("exibe tags da vaga no rodapé", async ({ page }) => {
    const tags = page.locator("span.rounded-full.bg-\\[\\#00488C\\]");
    await expect(tags.first()).toBeVisible();
  });

  test("botão salvar alterna estado ao clicar", async ({ page }) => {
    const bookmark = page.locator('button[title="Salvar vaga"], button[title="Remover dos salvos"]');
    await expect(bookmark).toBeVisible();

    const tituloBefore = await bookmark.getAttribute("title");
    await bookmark.click();
    const tituloAfter = await bookmark.getAttribute("title");

    expect(tituloBefore).not.toEqual(tituloAfter);
  });

  test("breadcrumb 'vagas' volta para /vagas", async ({ page }) => {
    await page.getByRole("button", { name: /vagas/i }).first().click();
    await expect(page).toHaveURL(/\/vagas/);
  });

  test("botão 'Acessar vaga' abre link externo ou está desabilitado", async ({ page }) => {
    const btnAcessar = page.getByRole("button", { name: /acessar vaga|encerrado/i });
    await expect(btnAcessar).toBeVisible();

    const desabilitado = await btnAcessar.isDisabled();
    if (!desabilitado) {
      const [newPage] = await Promise.all([
        page.context().waitForEvent("page"),
        btnAcessar.click(),
      ]);
      expect(newPage.url()).toMatch(/^https?:\/\//);
      await newPage.close();
    }
  });

  test("avatar no topbar navega para /perfil", async ({ page }) => {
    const avatar = page.locator("button.rounded-full").first();
    await expect(avatar).toBeVisible();
    await avatar.click();
    await expect(page).toHaveURL(/\/perfil/);
  });

  test("sidebar está visível", async ({ page }) => {
    await expect(page.locator("aside")).toBeVisible();
  });
});