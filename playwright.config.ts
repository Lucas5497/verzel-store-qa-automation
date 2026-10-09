import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * playwright-bdd 7.x: defineBddConfig() retorna o caminho (string) do testDir.
 * NÃO use .outputDir.
 */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'support/**/*.ts'],
});

const baseURL = process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
  baseURL,
  extraHTTPHeaders: {
    Accept: 'application/json',
  },
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'api',
      grepInvert: /@ui\b/,
    },
    {
      name: 'ui-chromium',
      grep: /@ui\b/,
      use: {
        ...devices['Desktop Chrome'],
        locale: 'pt-BR',
        baseURL,
      },
    },
  ],
});