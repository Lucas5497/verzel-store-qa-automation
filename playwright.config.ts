import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**

* playwright-bdd 7.x:
* defineBddConfig() retorna o caminho (string) do testDir.
  */
  const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'support/**/*.ts'],
  });

const baseURL =
process.env.BASE_URL ??
'https://verzel-store.qa-test-verzel-store.workers.dev';

const isCI = !!process.env.CI;

export default defineConfig({
testDir,

timeout: 45_000,
expect: {
timeout: 10_000,
},

retries: isCI ? 1 : 0,
fullyParallel: true,
forbidOnly: isCI,
workers: isCI ? 2 : 1,

reporter: isCI
? [
['list'],
['github'],
[
'html',
{
open: 'never',
outputFolder: 'playwright-report',
},
],
[
'json',
{
outputFile: 'test-results/results.json',
},
],
]
: [
['list'],
[
'html',
{
open: 'never',
outputFolder: 'playwright-report',
},
],
[
'json',
{
outputFile: 'test-results/results.json',
},
],
],

outputDir: 'test-results/artifacts',

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
