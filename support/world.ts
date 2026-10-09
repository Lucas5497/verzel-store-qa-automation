import { test as base, createBdd } from 'playwright-bdd';
import type { CalcularResponse, ItemRequest, PedidoResponse } from '../utils/api-client';

type CarrinhoState = {
  itens: ItemRequest[];
  lastStatus: number;
  lastBody: CalcularResponse | PedidoResponse | null;
  lastPedidoStatus: number;
  lastPedidoBody: PedidoResponse | null;
};

export const test = base.extend<{ carrinho: CarrinhoState }>({
  carrinho: async ({}, use) => {
    await use({
      itens: [],
      lastStatus: 0,
      lastBody: null,
      lastPedidoStatus: 0,
      lastPedidoBody: null,
    });
  },
});

export const { Given, When, Then } = createBdd(test);