import { APIRequestContext, expect } from '@playwright/test';

export type ItemRequest = { produtoId: string; quantidade: number };

export type CalcularResponse = {
  itens: Array<{
    produtoId: string;
    nome: string;
    precoUnitario: number;
    quantidade: number;
    total: number;
  }>;
  subtotal: number;
  desconto: number;
  frete: number;
  freteGratis: boolean;
  valorFaltanteFreteGratis: number;
  total: number;
  cupom: null | {
    codigo: string;
    aplicado: boolean;
    mensagem: string;
  };
  erro?: { codigo: string; mensagem: string; campo?: string };
};

export type PedidoResponse = CalcularResponse & {
  numero?: string;
  criadoEm?: string;
  cliente?: { nome: string; email: string; cep: string };
};

const BASE =
  process.env.BASE_URL?.replace(/\/$/, '') ??
  'https://verzel-store.qa-test-verzel-store.workers.dev';

async function postJson<T>(
  request: APIRequestContext,
  path: string,
  payload: Record<string, unknown>,
): Promise<{ status: number; body: T }> {
  // data como OBJETO — o Playwright serializa e define Content-Type
  const response = await request.post(`${BASE}/api/carrinho/calcular`, {
  data: payload,  // objeto, NÃO JSON.stringify
    });
  const body = (await response.json()) as T;
  return { status: response.status(), body };
}

export async function calcularCarrinho(
  request: APIRequestContext,
  itens: ItemRequest[],
  cupom?: string | null,
): Promise<{ status: number; body: CalcularResponse }> {
  const itensClone = itens.map((i) => ({
    produtoId: String(i.produtoId).trim(),
    quantidade: Number(i.quantidade),
  }));

  const payload: Record<string, unknown> = { itens: itensClone };
  if (cupom != null && String(cupom).trim() !== '') {
    payload.cupom = String(cupom).trim();
  }

  return postJson<CalcularResponse>(request, '/api/carrinho/calcular', payload);
}

export async function criarPedido(
  request: APIRequestContext,
  itens: ItemRequest[],
  opts?: {
    cupom?: string | null;
    nome?: string;
    email?: string;
    cep?: string;
  },
): Promise<{ status: number; body: PedidoResponse }> {
  const itensClone = itens.map((i) => ({
    produtoId: String(i.produtoId).trim(),
    quantidade: Number(i.quantidade),
  }));

  const payload: Record<string, unknown> = {
    itens: itensClone,
    cliente: {
      nome: opts?.nome ?? 'Maria Silva',
      email: opts?.email ?? 'maria.silva@teste.com',
      cep: opts?.cep ?? '01310-100',
    },
  };
  if (opts?.cupom != null && String(opts.cupom).trim() !== '') {
    payload.cupom = String(opts.cupom).trim();
  }

  return postJson<PedidoResponse>(request, '/api/pedidos', payload);
}

export function assertValoresMonetarios(body: CalcularResponse) {
  for (const campo of ['subtotal', 'desconto', 'frete', 'total'] as const) {
    const valor = body[campo];
    const casas = valor.toString().split('.')[1]?.length ?? 0;
    expect(casas, `${campo} deve ter no máximo 2 casas decimais`).toBeLessThanOrEqual(2);
  }
  const esperado = Number((body.subtotal - body.desconto + body.frete).toFixed(2));
  expect(body.total).toBeCloseTo(esperado, 2);
}

