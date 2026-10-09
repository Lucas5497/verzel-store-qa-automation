import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/world';
import { calcularCarrinho, criarPedido, assertValoresMonetarios, ItemRequest } from '../utils/api-client';
import { calcularEsperado, paraCentavos, ItemCarrinho } from '../utils/oraculo';
import { ProdutoId, LIMITE_QTD_POR_PRODUTO } from '../fixtures/catalogo';

function itemOf(produtoId: string, quantidade: number): ItemRequest {
  return {
    produtoId: String(produtoId).trim(),
    quantidade: Number(quantidade),
  };
}

// ─── Given ───────────────────────────────────────────────────────────────────

Given('um carrinho com o produto {string} na quantidade {int}', async ({ carrinho }, produtoId: string, quantidade: number) => {
  carrinho.itens = [itemOf(produtoId, quantidade)];
});

Given('o produto {string} na quantidade {int}', async ({ carrinho }, produtoId: string, quantidade: number) => {
  carrinho.itens.push(itemOf(produtoId, quantidade));
});

// ─── When autosuficientes (recomendados) ─────────────────────────────────────

When(
  'eu calculo o carrinho com produto {string} quantidade {int} e cupom {string}',
  async ({ request, carrinho }, produtoId: string, quantidade: number, cupom: string) => {
    const itens = [itemOf(produtoId, quantidade)];
    carrinho.itens = itens;
    console.log('[DEBUG] payload =', JSON.stringify({ itens, cupom }));
    const { status, body } = await calcularCarrinho(request, itens, String(cupom).trim());
    console.log('[DEBUG] status =', status);
    carrinho.lastStatus = status;
    carrinho.lastBody = body;
  },
);

When(
  'eu calculo o carrinho com produto {string} quantidade {int} sem cupom',
  async ({ request, carrinho }, produtoId: string, quantidade: number) => {
    const itens = [itemOf(produtoId, quantidade)];
    carrinho.itens = itens;
    const { status, body } = await calcularCarrinho(request, itens);
    carrinho.lastStatus = status;
    carrinho.lastBody = body;
  },
);

When(
  'eu crio um pedido com produto {string} quantidade {int} sem cupom',
  async ({ request, carrinho }, produtoId: string, quantidade: number) => {
    const itens = [itemOf(produtoId, quantidade)];
    carrinho.itens = itens;
    const { status, body } = await criarPedido(request, itens);
    carrinho.lastPedidoStatus = status;
    carrinho.lastPedidoBody = body;
    carrinho.lastStatus = status;
    carrinho.lastBody = body;
  },
);

// ─── When legados (Given + When) ─────────────────────────────────────────────

When('eu calculo o carrinho com o cupom {string}', async ({ request, carrinho }, cupom: string) => {
  if (!carrinho.itens.length) {
    throw new Error('Carrinho sem itens — Given não populou carrinho.itens');
  }
  const { status, body } = await calcularCarrinho(request, carrinho.itens, String(cupom).trim());
  carrinho.lastStatus = status;
  carrinho.lastBody = body;
});

When('eu calculo o carrinho sem cupom', async ({ request, carrinho }) => {
  if (!carrinho.itens.length) {
    throw new Error('Carrinho sem itens — Given não populou carrinho.itens');
  }
  const { status, body } = await calcularCarrinho(request, carrinho.itens);
  carrinho.lastStatus = status;
  carrinho.lastBody = body;
});

When('eu crio um pedido sem cupom', async ({ request, carrinho }) => {
  if (!carrinho.itens.length) {
    throw new Error('Carrinho sem itens — Given não populou carrinho.itens');
  }
  const { status, body } = await criarPedido(request, carrinho.itens);
  carrinho.lastPedidoStatus = status;
  carrinho.lastPedidoBody = body;
  carrinho.lastStatus = status;
  carrinho.lastBody = body;
});

When('eu crio um pedido com o cupom {string}', async ({ request, carrinho }, cupom: string) => {
  if (!carrinho.itens.length) {
    throw new Error('Carrinho sem itens — Given não populou carrinho.itens');
  }
  const { status, body } = await criarPedido(request, carrinho.itens, {
    cupom: String(cupom).trim(),
  });
  carrinho.lastPedidoStatus = status;
  carrinho.lastPedidoBody = body;
  carrinho.lastStatus = status;
  carrinho.lastBody = body;
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('a resposta deve ter status {int}', async ({ carrinho }, statusEsperado: number) => {
  expect(
    carrinho.lastStatus,
    `Status HTTP inesperado. Body: ${JSON.stringify(carrinho.lastBody)}`,
  ).toBe(statusEsperado);
  expect(carrinho.lastBody).not.toBeNull();
});

Then('o cupom deve estar aplicado', async ({ carrinho }) => {
  expect(carrinho.lastBody!.cupom).not.toBeNull();
  expect(carrinho.lastBody!.cupom!.aplicado).toBe(true);
});

Then('o cupom não deve estar aplicado', async ({ carrinho }) => {
  expect(carrinho.lastBody!.cupom).not.toBeNull();
  expect(carrinho.lastBody!.cupom!.aplicado).toBe(false);
});

Then('a mensagem do cupom deve conter {string}', async ({ carrinho }, trecho: string) => {
  expect(carrinho.lastBody!.cupom?.mensagem?.toLowerCase()).toContain(trecho.toLowerCase());
});

Then('o subtotal deve ser {float}', async ({ carrinho }, valor: number) => {
  expect(carrinho.lastBody!.subtotal).toBeCloseTo(valor, 2);
});

Then('o desconto deve ser {float}', async ({ carrinho }, valor: number) => {
  expect(carrinho.lastBody!.desconto).toBeCloseTo(valor, 2);
});

Then('o frete deve ser {float}', async ({ carrinho }, valor: number) => {
  expect(carrinho.lastBody!.frete).toBeCloseTo(valor, 2);
});

Then('o total deve ser {float}', async ({ carrinho }, valor: number) => {
  expect(carrinho.lastBody!.total).toBeCloseTo(valor, 2);
});

Then('o frete grátis deve ser verdadeiro', async ({ carrinho }) => {
  expect(carrinho.lastBody!.freteGratis).toBe(true);
});

Then('o frete grátis deve ser falso', async ({ carrinho }) => {
  expect(carrinho.lastBody!.freteGratis).toBe(false);
});

Then('o valor faltante para frete grátis deve ser {float}', async ({ carrinho }, valor: number) => {
  expect(carrinho.lastBody!.valorFaltanteFreteGratis).toBeCloseTo(valor, 2);
});

Then('o total deve ser consistente com subtotal, desconto e frete', async ({ carrinho }) => {
  assertValoresMonetarios(carrinho.lastBody!);
});

Then('os valores devem bater com o oráculo para o cupom {string}', async ({ carrinho }, cupom: string) => {
  const itens = carrinho.itens.map((i) => ({
    produtoId: i.produtoId as ProdutoId,
    quantidade: i.quantidade,
  })) as ItemCarrinho[];
  const esperado = calcularEsperado(itens, cupom);
  const body = carrinho.lastBody!;
  expect(paraCentavos(body.subtotal)).toBe(esperado.subtotalCentavos);
  expect(paraCentavos(body.desconto)).toBe(esperado.descontoCentavos);
  expect(paraCentavos(body.frete)).toBe(esperado.freteCentavos);
  expect(body.freteGratis).toBe(esperado.freteGratis);
  expect(paraCentavos(body.total)).toBe(esperado.totalCentavos);
});

Then('a resposta deve indicar recusa por limite de quantidade', async ({ carrinho }) => {
  const status = carrinho.lastStatus;
  const body = carrinho.lastBody!;
  const recusouPorStatus = status >= 400 && status < 500;
  const bodyStr = JSON.stringify(body).toLowerCase();
  const recusouPorMensagem =
    bodyStr.includes('limite') ||
    (bodyStr.includes('quantidade') && (body as { erro?: { codigo?: string } }).erro !== undefined);
  const itemAcimaDoLimite = body.itens?.some((i) => i.quantidade > LIMITE_QTD_POR_PRODUTO);

  expect(
    recusouPorStatus || recusouPorMensagem || !itemAcimaDoLimite,
    `CA10 violado: API aceitou quantidade > ${LIMITE_QTD_POR_PRODUTO}. status=${status} body=${JSON.stringify(body)}`,
  ).toBeTruthy();
});

Then('a resposta do pedido deve indicar recusa por limite de quantidade', async ({ carrinho }) => {
  const status = carrinho.lastPedidoStatus;
  const body = carrinho.lastPedidoBody!;
  const recusouPorStatus = status >= 400 && status < 500;
  const itemAcimaDoLimite = body.itens?.some((i) => i.quantidade > LIMITE_QTD_POR_PRODUTO);

  expect(
    recusouPorStatus || !itemAcimaDoLimite,
    `CA10 violado no pedido: status=${status} body=${JSON.stringify(body)}`,
  ).toBeTruthy();
});

Then('a quantidade do produto {string} não deve ser {int}', async ({ carrinho }, produtoId: string, qtd: number) => {
  const item = carrinho.lastBody!.itens?.find((i) => i.produtoId === produtoId);
  if (item) {
    expect(item.quantidade).not.toBe(qtd);
  }
});