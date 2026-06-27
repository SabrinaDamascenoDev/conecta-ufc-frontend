# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> RegisterPage — step 2 >> renderiza as tags de oportunidade
- Location: e2e/register.spec.ts:64:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("PET")')
Expected: visible
Error: strict mode violation: locator('button:has-text("PET")') resolved to 2 elements:
    1) <button class="px-4 py-2 rounded-full text-sm font-medium border transition-all bg-white text-gray-600 border-gray-200 hover:border-blue-300">PET</button> aka getByRole('button', { name: 'PET', exact: true })
    2) <button class="px-4 py-2 rounded-full text-sm font-medium border transition-all bg-white text-gray-600 border-gray-200 hover:border-blue-300">PET-SI</button> aka getByRole('button', { name: 'PET-SI' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text("PET")')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - region "Notifications alt+T"
  - generic [ref=e7]:
    - img "Pedra da Galinha Choca" [ref=e8]
    - generic [ref=e9]:
      - paragraph [ref=e10]: Conecta
      - heading "UFC" [level=1] [ref=e11]
    - generic [ref=e12]:
      - heading "Oportunidades acadêmicas em um só lugar" [level=2] [ref=e13]:
        - text: Oportunidades acadêmicas
        - text: em um só lugar
      - paragraph [ref=e14]: Encontre bolsas, monitorias, extensão, pesquisa e projetos acadêmicos de forma simples e organizada.
    - generic [ref=e15]:
      - generic [ref=e16]: Bolsas
      - generic [ref=e17]: Monitorias
      - generic [ref=e18]: Extensão
      - generic [ref=e19]: Pesquisa
      - generic [ref=e20]: Desenvolvimento
  - generic [ref=e22]:
    - generic [ref=e23]:
      - button "Entrar" [ref=e24]
      - button "Criar Conta" [ref=e25]
    - heading "Cadastre-se na plataforma" [level=1] [ref=e26]
    - paragraph [ref=e27]: Preencha as informações necessárias para ter acesso as oportunidades.
    - generic [ref=e28]:
      - generic [ref=e29]:
        - img [ref=e31]
        - generic [ref=e33]: Perfil
      - generic [ref=e35]:
        - generic [ref=e36]: "2"
        - generic [ref=e37]: Alertas
    - generic [ref=e38]:
      - generic [ref=e39]:
        - paragraph [ref=e40]: Selecione quais oportunidades você deseja receber alertas
        - generic [ref=e41]:
          - button "PAIP" [ref=e42]
          - button "PID" [ref=e43]
          - button "PIBIC" [ref=e44]
          - button "P&D" [ref=e45]
          - button "PET" [ref=e46]
          - button "PET-SI" [ref=e47]
          - button "PPCA" [ref=e48]
          - button "Extensão" [ref=e49]
      - button "Acessar a plataforma" [ref=e50]
```

# Test source

```ts
  1  | import { test, expect, type Page } from "@playwright/test";
  2  | 
  3  | test.use({ storageState: { cookies: [], origins: [] } });
  4  | 
  5  | async function irParaStep2(page: Page) {
  6  |   await page.goto("/cadastro");
  7  |   await page.fill('input[placeholder="nome"]', "Fulano de Tal");
  8  |   await page.fill('input[type="email"]', "fulano5@alu.ufc.br");
  9  |   await page.fill('input[type="password"]', "senha1234");
  10 |   await page.locator('[role="combobox"]').click();
  11 |   await page.getByRole("option", { name: "Sistemas de Informação" }).click();
  12 |   await page.click('button[type="submit"]');
  13 |   await expect(
  14 |     page.locator("text=Selecione quais oportunidades"),
  15 |   ).toBeVisible();
  16 | }
  17 | 
  18 | test.describe("RegisterPage — step 1", () => {
  19 |   test.beforeEach(async ({ page }) => {
  20 |     await page.goto("/cadastro");
  21 |   });
  22 | 
  23 |   test("renderiza os campos do step 1", async ({ page }) => {
  24 |     await expect(page.locator('input[placeholder="nome"]')).toBeVisible();
  25 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  26 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  27 |     await expect(
  28 |       page.getByRole("button", { name: /continuar cadastro/i }),
  29 |     ).toBeVisible();
  30 |   });
  31 | 
  32 |   test("mostra erros ao submeter step 1 vazio", async ({ page }) => {
  33 |     await page.click('button[type="submit"]');
  34 |     await expect(page.locator("p.text-red-500").first()).toBeVisible();
  35 |   });
  36 | 
  37 |  test("toggle de mostrar/esconder senha funciona", async ({ page }) => {
  38 |   const senhaContainer = page.locator("div").filter({ has: page.locator('input[type="password"]') });
  39 |   
  40 |   await senhaContainer.locator("input").fill("senha1234");
  41 |   await expect(senhaContainer.locator("input")).toBeVisible();
  42 | 
  43 |   await senhaContainer.locator("button").click();
  44 |   await expect(page.locator('input[type="text"]')).toHaveValue("senha1234");
  45 | 
  46 |   await page.locator("div").filter({ has: page.locator('input[type="text"]') }).locator("button").click();
  47 |   await expect(page.locator('input[type="password"]')).toHaveValue("senha1234");
  48 | });
  49 | 
  50 |   test("avança para step 2 com dados válidos", async ({ page }) => {
  51 |     await page.fill('input[placeholder="nome"]', "Fulano de Tal");
  52 |     await page.fill('input[type="email"]', "fulano@alu.ufc.br");
  53 |     await page.fill('input[type="password"]', "senha1234");
  54 |     await page.locator('[role="combobox"]').click();
  55 |     await page.getByRole("option", { name: "Sistemas de Informação" }).click();
  56 |     await page.click('button[type="submit"]');
  57 |     await expect(
  58 |       page.locator("text=Selecione quais oportunidades"),
  59 |     ).toBeVisible();
  60 |   });
  61 | });
  62 | 
  63 | test.describe("RegisterPage — step 2", () => {
  64 |   test("renderiza as tags de oportunidade", async ({ page }) => {
  65 |     await irParaStep2(page);
  66 |     for (const tag of ["PIBIC", "PET", "Extensão"]) {
> 67 |       await expect(page.locator(`button:has-text("${tag}")`)).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  68 |     }
  69 |   });
  70 | 
  71 |   test("selecionar e desselecionar tag funciona", async ({ page }) => {
  72 |     await irParaStep2(page);
  73 |     const pibic = page.locator('button:has-text("PIBIC")');
  74 |     await pibic.click();
  75 |     await expect(pibic).toHaveClass(/bg-ufc/);
  76 |     await pibic.click();
  77 |     await expect(pibic).not.toHaveClass(/bg-ufc/);
  78 |   });
  79 | 
  80 |   test("cadastro completo redireciona para /login", async ({ page }) => {
  81 |     await irParaStep2(page);
  82 |     await page.locator('button:has-text("PIBIC")').click();
  83 |     await page.getByRole("button", { name: /acessar a plataforma/i }).click();
  84 |     await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  85 |   });
  86 | 
  87 |   test("botão mostra 'Acessando...' enquanto carrega", async ({ page }) => {
  88 |     await irParaStep2(page);
  89 |     await page.getByRole("button", { name: /acessar a plataforma/i }).click();
  90 |     await expect(
  91 |       page.getByRole("button", { name: /acessando/i }),
  92 |     ).toBeVisible();
  93 |   });
  94 | });
  95 | 
```