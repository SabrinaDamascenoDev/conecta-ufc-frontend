import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  projects: [
    // Roda o login e salva a sessão
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    // Testes que NÃO precisam de login (login e cadastro)
    {
      name: "publico",
      testMatch: /(login|register)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },

    // Testes que precisam estar logado
    {
      name: "autenticado",
      testIgnore: /(login|register)\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});