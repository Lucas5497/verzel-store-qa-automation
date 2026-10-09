import {
  CATALOGO,
  DESCONTO_BEMVINDO_PERCENT,
  FRETE_CENTAVOS,
  LIMITE_FRETE_GRATIS_CENTAVOS,
  ProdutoId,
} from '../fixtures/catalogo';

export type ItemCarrinho = { produtoId: ProdutoId; quantidade: number };

export type ResultadoEsperado = {
  subtotalCentavos: number;
  descontoCentavos: number;
  freteCentavos: number;
  freteGratis: boolean;
  valorFaltanteFreteGratisCentavos: number;
  totalCentavos: number;
};

export function subtotalCentavos(itens: ItemCarrinho[]): number {
  return itens.reduce((acc, item) => {
    const produto = CATALOGO[item.produtoId];
    if (!produto) throw new Error(`Produto desconhecido: ${item.produtoId}`);
    return acc + produto.precoCentavos * item.quantidade;
  }, 0);
}

/** Desconto só sobre o subtotal dos produtos (não sobre o frete). */
export function descontoCentavos(subtotal: number, cupom?: string | null): number {
  if (!cupom) return 0;
  const normalizado = cupom.trim().toUpperCase();
  if (normalizado === 'BEMVINDO10') {
    return Math.round((subtotal * DESCONTO_BEMVINDO_PERCENT) / 100);
  }
  return 0;
}

export function freteCentavos(subtotalAntesDesconto: number): {
  freteCentavos: number;
  freteGratis: boolean;
  valorFaltanteFreteGratisCentavos: number;
} {
  if (subtotalAntesDesconto >= LIMITE_FRETE_GRATIS_CENTAVOS) {
    return {
      freteCentavos: 0,
      freteGratis: true,
      valorFaltanteFreteGratisCentavos: 0,
    };
  }
  return {
    freteCentavos: FRETE_CENTAVOS,
    freteGratis: false,
    valorFaltanteFreteGratisCentavos: LIMITE_FRETE_GRATIS_CENTAVOS - subtotalAntesDesconto,
  };
}

export function calcularEsperado(
  itens: ItemCarrinho[],
  cupom?: string | null,
): ResultadoEsperado {
  const sub = subtotalCentavos(itens);
  const desc = descontoCentavos(sub, cupom);
  const frete = freteCentavos(sub);
  return {
    subtotalCentavos: sub,
    descontoCentavos: desc,
    freteCentavos: frete.freteCentavos,
    freteGratis: frete.freteGratis,
    valorFaltanteFreteGratisCentavos: frete.valorFaltanteFreteGratisCentavos,
    totalCentavos: sub - desc + frete.freteCentavos,
  };
}


export function paraCentavos(reais: number): number {
  return Math.round(reais * 100);
}

export function paraReais(centavos: number): number {
  return centavos / 100;
}
