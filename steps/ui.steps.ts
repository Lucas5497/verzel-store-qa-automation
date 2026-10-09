import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/world';
import {
  irParaProdutos,
  adicionarProduto,
  abrirCarrinho,
  lerResumo,
  aplicarCupomUI,
  moedasEquivalentes,
  produtoCard,
  esvaziarCarrinhoSeVisivel,
} from '../utils/ui-helpers';

Given('que estou na página de produtos', async ({ page }) => {
  await irParaProdutos(page);
});

When('eu adiciono o produto {string} ao carrinho {int} vez', async ({ page }, nome: string, vezes: number) => {
  await adicionarProduto(page, nome, vezes);
});

When('eu adiciono o produto {string} ao carrinho {int} vezes', async ({ page }, nome: string, vezes: number) => {
  await adicionarProduto(page, nome, vezes);
});

When('eu abro o carrinho', async ({ page }) => {
  await abrirCarrinho(page);
});

When('eu aplico o cupom {string} na interface', async ({ page }, codigo: string) => {
  await aplicarCupomUI(page, codigo);
});

When('eu esvazio o carrinho', async ({ page }) => {
  await esvaziarCarrinhoSeVisivel(page);
});

Then('o resumo deve exibir subtotal {string}', async ({ page }, valor: string) => {
  const atual = await lerResumo(page, 'subtotal');
  expect(moedasEquivalentes(atual, valor), `subtotal: obtido "${atual}" esperado "${valor}"`).toBeTruthy();
});

Then('o resumo deve exibir desconto {string}', async ({ page }, valor: string) => {
  const atual = await lerResumo(page, 'desconto');
  expect(moedasEquivalentes(atual, valor), `desconto: obtido "${atual}" esperado "${valor}"`).toBeTruthy();
});

Then('o resumo deve exibir frete {string}', async ({ page }, valor: string) => {
  const atual = await lerResumo(page, 'frete');
  expect(moedasEquivalentes(atual, valor), `frete: obtido "${atual}" esperado "${valor}"`).toBeTruthy();
});

Then('o resumo deve exibir total {string}', async ({ page }, valor: string) => {
  const atual = await lerResumo(page, 'total');
  expect(moedasEquivalentes(atual, valor), `total: obtido "${atual}" esperado "${valor}"`).toBeTruthy();
});

Then('deve aparecer a mensagem de cupom aplicado', async ({ page }) => {
  await expect(page.getByText(/Cupom .+ aplicado|cupom aplicado/i)).toBeVisible({ timeout: 5_000 });
});

Then('deve aparecer a mensagem de cupom inválido', async ({ page }) => {
  await expect(page.getByText(/Cupom inválido/i)).toBeVisible({ timeout: 5_000 });
});

Then('deve aparecer aviso de frete contendo {string}', async ({ page }, trecho: string) => {
  const aviso = page.locator('.aviso-frete');
  await expect(aviso).toBeVisible();
  await expect(aviso).toContainText(trecho);
});

Then('o card do produto {string} deve exibir aviso de limite', async ({ page }, nome: string) => {
  const card = produtoCard(page, nome);
  await expect(card.locator('.produto-aviso, .produto-aviso-limite')).toContainText(/Limite de 5/i);
});

Then('o botão de adicionar do produto {string} deve estar desabilitado', async ({ page }, nome: string) => {
  const card = produtoCard(page, nome);
  await expect(card.getByRole('button', { name: /Adicionar ao carrinho/i })).toBeDisabled();
});

Then('o item {string} deve ter quantidade {int} no carrinho', async ({ page }, nome: string, qtd: number) => {
  const item = page.locator('.item-carrinho').filter({ hasText: nome });
  await expect(item).toBeVisible();
  const output = item.locator('.seletor-quantidade output, output');
  await expect(output).toHaveText(String(qtd));
});
