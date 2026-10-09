import { Page, expect, Locator } from '@playwright/test';

export function produtoCard(page: Page, nome: string): Locator {
  return page.locator('.produto').filter({ hasText: nome });
}

export async function irParaProdutos(page: Page) {
  await page.goto('/');
  await expect(page.locator('.grade-produtos, .produto').first()).toBeVisible({ timeout: 15_000 });
}

export async function adicionarProduto(page: Page, nome: string, vezes = 1) {
  const card = produtoCard(page, nome);
  await expect(card).toBeVisible();
  const botao = card.getByRole('button', { name: /Adicionar ao carrinho/i });
  for (let i = 0; i < vezes; i++) {
    await botao.click();
    await page.waitForTimeout(200);
  }
}

export async function abrirCarrinho(page: Page) {
  await page.getByRole('link', { name: /Carrinho/i }).click();
  await expect(page.getByRole('heading', { name: /Carrinho/i })).toBeVisible({ timeout: 10_000 });
}

/** Lê valor monetário do resumo via data-valor (subtotal|desconto|frete|total). */
export async function lerResumo(page: Page, campo: 'subtotal' | 'desconto' | 'frete' | 'total'): Promise<string> {
  const dd = page.locator(`[data-valor="${campo}"]`);
  await expect(dd).toBeVisible();
  return (await dd.innerText()).trim();
}

/** Normaliza "R$ 10,00", "- R$ 10,00", "R$10,00" para comparação flexível. */
export function normalizarMoeda(texto: string): string {
  return texto
    .replace(/\s+/g, ' ')
    .replace(/-\s*/g, '')
    .replace(/R\$\s*/i, 'R$ ')
    .trim();
}

export function moedasEquivalentes(a: string, b: string): boolean {
  const num = (s: string) =>
    s
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/^-/, '');
  return Number(num(a)).toFixed(2) === Number(num(b)).toFixed(2);
}

export async function aplicarCupomUI(page: Page, codigo: string) {
  const input = page.locator('#campo-cupom');
  await expect(input).toBeVisible();
  await input.fill(codigo);
  await page.getByRole('button', { name: /Aplicar cupom/i }).click();
  await page.waitForTimeout(500);
}

export async function esvaziarCarrinhoSeVisivel(page: Page) {
  const botao = page.getByRole('button', { name: /Esvaziar carrinho/i });
  if (await botao.isVisible().catch(() => false)) {
    await botao.click();
    await page.waitForTimeout(300);
  }
}
